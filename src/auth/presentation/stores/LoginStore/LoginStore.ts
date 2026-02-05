import { injectable, inject } from "inversiland";
import { makeAutoObservable } from "mobx";
import LoginStoreState from "../../types/LoginStoreState";
import LoginPayload from "src/auth/application/types/LoginPayload";
import LoginUseCase from "src/auth/application/useCases/LoginUseCase";
import GetCurrentUserUseCase from "src/auth/application/useCases/GetCurrentUserUseCase";

@injectable()
export class LoginStore implements LoginStoreState {
  isLoading = false;
  error: string | null = null;
  user: LoginStoreState["user"] = null;

  constructor(
    @inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @inject(GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase
  ) {
    makeAutoObservable(this);
  }

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  setUser = (user: LoginStoreState["user"]) => {
    this.user = user;
  };

  async login(payload: LoginPayload) {
    this.setIsLoading(true);
    this.setError(null);

    return this.loginUseCase
      .execute(payload)
      .then(async (user) => {
        // First set the basic user from login
        this.setUser(user);
        
        // Then fetch full profile with gender, image, etc.
        if (user.token) {
          try {
            const fullProfile = await this.getCurrentUserUseCase.execute(user.token);
            this.setUser(fullProfile);
          } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Don't fail login if profile fetch fails
          }
        }
      })
      .catch((error) => {
        this.setError(error.message || "Login failed");
        throw error;
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  }

  clearError = () => {
    this.setError(null);
  };

  logout = () => {
    this.setUser(null);
    this.setError(null);
  };
}

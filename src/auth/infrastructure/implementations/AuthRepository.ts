import { injectable, inject } from "inversiland";
import { IAuthRepository } from "src/auth/domain/specifications/IAuthRepository";
import LoginPayload from "src/auth/application/types/LoginPayload";
import UserEntity from "src/auth/domain/entities/UserEntity";
import DummyJsonAuthResponseDto from "../models/DummyJsonAuthResponseDto";
import UserProfileDto from "../models/UserProfileDto";
import IHttpClient, {
  IHttpClientToken,
} from "src/core/domain/specifications/IHttpClient";
import { plainToInstance } from "class-transformer";

@injectable()
export default class AuthRepository implements IAuthRepository {
  private readonly baseUrl = "/auth";
  private readonly userBaseUrl = "/user";

  constructor(
    @inject(IHttpClientToken) private readonly httpClient: IHttpClient
  ) {}

  /**
   * Login dengan API dummyjson.com
   * Mengirim username dan password, menerima user data dan tokens
   */
  async login(payload: LoginPayload): Promise<UserEntity> {
    const response = await this.httpClient.post<
      { username: string; password: string },
      unknown
    >(`${this.baseUrl}/login`, {
      username: payload.username || payload.email?.split("@")[0] || "", // Fallback: extract username from email
      password: payload.password,
    });

    const responseDto = plainToInstance(DummyJsonAuthResponseDto, response);

    return responseDto.toDomain();
  }

  /**
   * Get current user profile dari /user/me
   * Memerlukan Bearer token untuk authorization
   */
  async getCurrentUser(token: string): Promise<UserEntity> {
    const response = await this.httpClient.get<unknown>(
      `${this.userBaseUrl}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseDto = plainToInstance(UserProfileDto, response);
    const user = responseDto.toDomain();

    // Set token from parameter since toDomain() doesn't have it
    user.token = token;

    return user;
  }

  /**
   * Dummy login - untuk testing/development
   * Simpan fungsi ini untuk fallback atau testing
   */
  async loginDummy(payload: LoginPayload): Promise<UserEntity> {
    // Dummy login - simulasi API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validasi sederhana untuk demo
        if (payload.email === "user@example.com" && payload.password === "password123") {
          resolve({
            id: 1,
            email: payload.email,
            name: "John Doe",
            token: "dummy-jwt-token-" + Date.now(),
          });
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000); // Simulasi network delay
    });
  }

  async logout(): Promise<void> {
    // Dummy logout - biasanya clear token, dll
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("User logged out");
        resolve();
      }, 500);
    });
  }
}

import { getModuleContainer, module } from "inversiland";
import { LoginStore } from "./presentation/stores/LoginStore/LoginStore";
import { IAuthRepositoryToken } from "./domain/specifications/IAuthRepository";
import AuthRepository from "./infrastructure/implementations/AuthRepository";
import LoginUseCase from "./application/useCases/LoginUseCase";
import LogoutUseCase from "./application/useCases/LogoutUseCase";
import GetCurrentUserUseCase from "./application/useCases/GetCurrentUserUseCase";

@module({
  providers: [
    {
      provide: IAuthRepositoryToken,
      useClass: AuthRepository,
    },
    LoginUseCase,
    LogoutUseCase,
    GetCurrentUserUseCase,
    {
      useClass: LoginStore,
      scope: "Singleton",
    },
  ],
})
export class AuthModule {}

export const authModuleContainer = getModuleContainer(AuthModule);

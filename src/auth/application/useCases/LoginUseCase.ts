import {
  IAuthRepository,
  IAuthRepositoryToken,
} from "src/auth/domain/specifications/IAuthRepository";
import LoginPayload from "src/auth/application/types/LoginPayload";
import { injectable, inject } from "inversiland";
import { UseCase } from "src/core/application/UseCase";
import UserEntity from "src/auth/domain/entities/UserEntity";

@injectable()
export default class LoginUseCase
  implements UseCase<LoginPayload, Promise<UserEntity>>
{
  constructor(
    @inject(IAuthRepositoryToken)
    private readonly authRepository: IAuthRepository
  ) {}

  public execute(payload: LoginPayload) {
    return this.authRepository.login(payload);
  }
}

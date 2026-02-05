import {
  IAuthRepository,
  IAuthRepositoryToken,
} from "src/auth/domain/specifications/IAuthRepository";
import { injectable, inject } from "inversiland";
import { UseCase } from "src/core/application/UseCase";

@injectable()
export default class LogoutUseCase
  implements UseCase<void, Promise<void>>
{
  constructor(
    @inject(IAuthRepositoryToken)
    private readonly authRepository: IAuthRepository
  ) {}

  public execute() {
    return this.authRepository.logout();
  }
}

import { inject, injectable } from "inversiland";
import {
  IAuthRepository,
  IAuthRepositoryToken,
} from "src/auth/domain/specifications/IAuthRepository";
import UserEntity from "src/auth/domain/entities/UserEntity";

@injectable()
export default class GetCurrentUserUseCase {
  constructor(
    @inject(IAuthRepositoryToken)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(token: string): Promise<UserEntity> {
    return this.authRepository.getCurrentUser(token);
  }
}

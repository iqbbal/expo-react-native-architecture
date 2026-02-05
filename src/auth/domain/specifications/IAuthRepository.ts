import UserEntity from "../entities/UserEntity";
import LoginPayload from "../../application/types/LoginPayload";

export const IAuthRepositoryToken = Symbol("IAuthRepository");

export interface IAuthRepository {
  login: (payload: LoginPayload) => Promise<UserEntity>;
  logout: () => Promise<void>;
  getCurrentUser: (token: string) => Promise<UserEntity>;
}

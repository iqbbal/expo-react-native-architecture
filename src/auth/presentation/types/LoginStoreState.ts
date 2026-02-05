import UserEntity from "src/auth/domain/entities/UserEntity";

export default interface LoginStoreState {
  isLoading: boolean;
  error: string | null;
  user: UserEntity | null;
}

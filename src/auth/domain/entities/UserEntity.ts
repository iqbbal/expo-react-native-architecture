export default interface UserEntity {
  id: number;
  email: string;
  name: string;
  token: string;
  // Additional fields from dummyjson.com API
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
  refreshToken?: string;
}

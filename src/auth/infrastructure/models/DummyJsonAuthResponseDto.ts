import { Expose } from "class-transformer";
import ResponseDto from "src/core/infrastructure/models/ResponseDto";
import UserEntity from "src/auth/domain/entities/UserEntity";

/**
 * DTO untuk response dari dummyjson.com API
 */
export default class DummyJsonAuthResponseDto extends ResponseDto<UserEntity> {
  @Expose()
  id!: number;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  gender!: string;

  @Expose()
  image!: string;

  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;

  toDomain(): UserEntity {
    return {
      id: this.id,
      email: this.email,
      name: `${this.firstName} ${this.lastName}`,
      token: this.accessToken,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      image: this.image,
      refreshToken: this.refreshToken,
    };
  }
}


import { Expose } from "class-transformer";
import ResponseDto from "src/core/infrastructure/models/ResponseDto";
import UserEntity from "src/auth/domain/entities/UserEntity";

/**
 * DTO untuk response dari dummyjson.com /user/me API
 */
export default class UserProfileDto extends ResponseDto<UserEntity> {
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
  maidenName?: string;

  @Expose()
  age?: number;

  toDomain(): UserEntity {
    return {
      id: this.id,
      email: this.email,
      name: `${this.firstName} ${this.lastName}`,
      token: "", // Will be set from existing token
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      image: this.image,
    };
  }
}

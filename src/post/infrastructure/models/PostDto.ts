import { Expose, Type } from "class-transformer";
import ResponseDto from "src/core/infrastructure/models/ResponseDto";
import PostEntity from "src/post/domain/entities/PostEntity";

class ReactionsDto {
  @Expose()
  likes!: number;

  @Expose()
  dislikes!: number;
}

export default class PostDto extends ResponseDto<PostEntity> {
  @Expose()
  id!: number;

  @Expose()
  userId!: number;

  @Expose()
  title!: string;

  @Expose()
  body?: string;

  @Expose()
  @Type(() => ReactionsDto)
  reactions?: ReactionsDto;

  toDomain(): PostEntity {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      body: this.body,
      reactions: this.reactions ? {
        likes: this.reactions.likes,
        dislikes: this.reactions.dislikes,
      } : undefined,
    };
  }
}


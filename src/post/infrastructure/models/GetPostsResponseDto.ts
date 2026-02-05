import { Expose, Type } from "class-transformer";
import PostDto from "./PostDto";
import PostEntity from "src/post/domain/entities/PostEntity";

/**
 * DTO untuk response list posts dari dummyjson.com API
 * Format: { posts: [...], total: number, skip: number, limit: number }
 */
export default class GetPostsResponseDto {
  @Expose()
  @Type(() => PostDto)
  posts!: PostDto[];

  @Expose()
  total!: number;

  @Expose()
  skip!: number;

  @Expose()
  limit!: number;

  toDomain(): { results: PostEntity[]; total: number; skip: number; limit: number } {
    return {
      results: this.posts.map(post => post.toDomain()),
      total: this.total,
      skip: this.skip,
      limit: this.limit,
    };
  }
}

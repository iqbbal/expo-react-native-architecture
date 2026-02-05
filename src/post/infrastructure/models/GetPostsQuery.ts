import PayloadDto from "src/core/infrastructure/models/PayloadDto";
import GetPostsPayload from "src/post/application/types/GetPostsPayload";
import { Expose } from "class-transformer";

export default class GetPostsQuery extends PayloadDto<GetPostsPayload> {
  @Expose()
  limit!: number;

  @Expose()
  skip!: number;

  transform(payload: GetPostsPayload) {
    const limit = payload.pageSize || 10;
    const skip = (payload.page - 1) * limit;

    return {
      limit,
      skip,
    };
  }
}

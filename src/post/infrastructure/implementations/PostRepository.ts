import GetPostsPayload from "src/post/application/types/GetPostsPayload";
import { injectable, inject } from "inversiland";
import { IPostRepository } from "../../domain/specifications/IPostRepository";
import GetPostsResponse from "src/post/application/types/GetPostsResponse";
import PostDto from "../models/PostDto";
import GetPostsResponseDto from "../models/GetPostsResponseDto";
import GetPostsQuery from "../models/GetPostsQuery";
import { plainToInstance } from "class-transformer";
import IHttpClient, {
  IHttpClientToken,
} from "src/core/domain/specifications/IHttpClient";

@injectable()
class PostRepository implements IPostRepository {
  private readonly baseUrl = "/posts";

  constructor(
    @inject(IHttpClientToken) private readonly httpClient: IHttpClient
  ) {}

  public async find(id: number) {
    const response = await this.httpClient.get(`${this.baseUrl}/${id}`);
    const responseDto = plainToInstance(PostDto, response);

    return responseDto.toDomain();
  }

  public async get(payload: GetPostsPayload): Promise<GetPostsResponse> {
    console.log("🟡 PostRepository.get() - payload:", payload);
    
    // Transform payload directly
    const limit = payload.pageSize || 10;
    const skip = (payload.page - 1) * limit;
    
    const query = { limit, skip };
    
    console.log("🟡 PostRepository.get() - query:", query);
    
    // Build query string manually to avoid URLSearchParams issues
    const queryString = `limit=${query.limit}&skip=${query.skip}`;
    const url = `${this.baseUrl}?${queryString}`;
    
    console.log("🟡 PostRepository.get() - URL:", url);
    
    const response = await this.httpClient.get<unknown>(url);
    console.log("🟡 PostRepository.get() - raw response:", response);
    
    const responseDto = plainToInstance(GetPostsResponseDto, response);
    const result = responseDto.toDomain();
    
    console.log("🟡 PostRepository.get() - domain result:", {
      resultsCount: result.results.length,
      total: result.total,
    });

    return result;
  }
}

export default PostRepository;

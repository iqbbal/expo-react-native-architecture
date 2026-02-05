# Post API Migration to DummyJSON

## 📋 Overview
Post API telah dimigrasikan untuk menggunakan response structure dari **dummyjson.com**, dengan field baru `reactions` dan pagination metadata yang lengkap.

## 🔄 Perubahan Response Structure

### **Before (Old API)**
```json
[
  {
    "id": 1,
    "userId": 121,
    "title": "Post Title",
    "body": "Post content..."
  }
]
```

### **After (DummyJSON API)**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "His mother had always taught him",
      "reactions": {
        "likes": 192,
        "dislikes": 25
      },
      "userId": 121
    }
  ],
  "total": 251,
  "skip": 0,
  "limit": 2
}
```

## 📝 Changes Made

### 1. **Domain Layer**
#### `PostEntity.ts`
```typescript
export default interface PostEntity {
  id: number;
  userId: number;
  title: string;
  body?: string;           // ✅ Now optional (not returned in list)
  reactions?: {            // ✅ New field
    likes: number;
    dislikes: number;
  };
}
```

### 2. **Infrastructure Layer**
#### `PostDto.ts`
```typescript
class ReactionsDto {
  @Expose() likes!: number;
  @Expose() dislikes!: number;
}

export default class PostDto extends ResponseDto<PostEntity> {
  @Expose() id!: number;
  @Expose() userId!: number;
  @Expose() title!: string;
  @Expose() body?: string;                    // ✅ Optional
  @Expose() @Type(() => ReactionsDto)
  reactions?: ReactionsDto;                    // ✅ Nested object mapping
  
  toDomain(): PostEntity {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      body: this.body,
      reactions: this.reactions ? {            // ✅ Conditional mapping
        likes: this.reactions.likes,
        dislikes: this.reactions.dislikes,
      } : undefined,
    };
  }
}
```

#### `GetPostsResponseDto.ts` (New File)
```typescript
export default class GetPostsResponseDto {
  @Expose()
  @Type(() => PostDto)
  posts!: PostDto[];        // ✅ Array of posts in 'posts' field
  
  @Expose() total!: number;  // ✅ Total count
  @Expose() skip!: number;   // ✅ Pagination offset
  @Expose() limit!: number;  // ✅ Page size
  
  toDomain() {
    return {
      results: this.posts.map(post => post.toDomain()),
      total: this.total,
      skip: this.skip,
      limit: this.limit,
    };
  }
}
```

#### `PostRepository.ts`
**Before:**
```typescript
public async get({}: GetPostsPayload): Promise<GetPostsResponse> {
  const posts = await this.httpClient.get<unknown[]>(this.baseUrl);
  const response: GetPostsResponse = {
    results: posts.map((post) => plainToInstance(PostDto, post).toDomain()),
    count: posts.length,
  };
  return response;
}
```

**After:**
```typescript
public async get({}: GetPostsPayload): Promise<GetPostsResponse> {
  const response = await this.httpClient.get<unknown>(this.baseUrl);
  const responseDto = plainToInstance(GetPostsResponseDto, response);
  return responseDto.toDomain();
}
```

### 3. **Application Layer**
#### `GetPostsResponse.ts`
```typescript
export default interface GetPostsResponse {
  results: PostEntity[];
  total: number;    // ✅ Changed from 'count'
  skip: number;     // ✅ New field
  limit: number;    // ✅ New field
}
```

### 4. **Presentation Layer**
#### `ListState.ts` (Core)
```typescript
export default interface ListState<ResultItemType, FiltersType> {
  isLoading: boolean;
  results: ResultItemType[];
  total: number;    // ✅ Changed from 'count'
  filters: FiltersType;
  pagination: PaginationState;
}
```

#### `GetPostsStore.ts`
```typescript
export class GetPostsStore implements GetPostsStoreState {
  total = 0;  // ✅ Changed from 'count'
  
  get pageCount() {
    return Math.ceil(this.total / this.pagination.pageSize);  // ✅ Use 'total'
  }
  
  setTotal = (total: GetPostsStoreState["total"]) => {        // ✅ Renamed method
    this.total = total;
  };
  
  async getPosts() {
    return this.getPostsUseCase
      .execute(payload)
      .then((response) => {
        this.setResults(response.results);
        this.setTotal(response.total);  // ✅ Use 'total'
      });
  }
}
```

#### `PostItem.tsx` (Component)
```typescript
const PostItem = ({ post }: PostItemProps) => {
  const { title, body, reactions } = post;
  
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {body && <Text style={styles.body}>{body}</Text>}      {/* ✅ Optional rendering */}
        {reactions && (                                        {/* ✅ Show reactions */}
          <View style={styles.reactionsContainer}>
            <Text style={styles.reactions}>
              👍 {reactions.likes}  👎 {reactions.dislikes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
```

## 🎯 Key Features

### **Nested Object Mapping**
```typescript
@Expose()
@Type(() => ReactionsDto)
reactions?: ReactionsDto;
```
The `@Type()` decorator tells class-transformer how to transform nested objects.

### **Optional Field Handling**
```typescript
body?: string;           // Optional in entity
{body && <Text>{body}</Text>}  // Conditional rendering
```

### **Wrapper DTO Pattern**
```typescript
{
  "posts": [...],    // Array wrapped in 'posts' field
  "total": 251,      // Metadata at root level
  "skip": 0,
  "limit": 2
}
```

## 📊 Data Flow

```
API Response
    ↓
GetPostsResponseDto (Infrastructure)
    ↓ toDomain()
GetPostsResponse (Application)
    ↓
GetPostsStore (Presentation)
    ↓
PostItem Component
```

## 🔍 Migration Checklist

- ✅ Updated `PostEntity` with `reactions` field
- ✅ Made `body` optional in `PostEntity`
- ✅ Created `GetPostsResponseDto` for wrapper response
- ✅ Updated `PostDto` with nested `ReactionsDto`
- ✅ Changed `PostRepository.get()` to use new DTO
- ✅ Renamed `count` → `total` in all layers
- ✅ Added `skip` and `limit` to response types
- ✅ Updated `PostItem` component to show reactions
- ✅ Added conditional rendering for optional fields

## 🧪 Testing
To test with real API:
```
GET https://dummyjson.com/posts
GET https://dummyjson.com/posts?limit=10&skip=0
GET https://dummyjson.com/posts/1
```

## 📚 Related Files
- Domain: `src/post/domain/entities/PostEntity.ts`
- Infrastructure: 
  - `src/post/infrastructure/models/PostDto.ts`
  - `src/post/infrastructure/models/GetPostsResponseDto.ts`
  - `src/post/infrastructure/implementations/PostRepository.ts`
- Application: `src/post/application/types/GetPostsResponse.ts`
- Presentation: 
  - `src/core/presentation/types/ListState.ts`
  - `src/post/presentation/stores/GetPostsStore/GetPostsStore.ts`
  - `src/post/presentation/components/PostItem.tsx`

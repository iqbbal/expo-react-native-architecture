# Auth Repository Refactoring

## 📋 Overview
`AuthRepository` telah di-refactor untuk mengikuti pola arsitektur yang sama dengan `PostRepository`, menerapkan prinsip Clean Architecture dan Dependency Injection.

## 🔄 Perubahan Utama

### 1. **Dependency Injection dengan IHttpClient**
**Before:**
```typescript
@injectable()
export default class AuthRepository implements IAuthRepository {
  async login(payload: LoginPayload): Promise<UserEntity> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {...});
    // manual fetch dan error handling
  }
}
```

**After:**
```typescript
@injectable()
export default class AuthRepository implements IAuthRepository {
  private readonly baseUrl = "/auth";

  constructor(
    @inject(IHttpClientToken) private readonly httpClient: IHttpClient
  ) {}

  async login(payload: LoginPayload): Promise<UserEntity> {
    const response = await this.httpClient.post<...>(`${this.baseUrl}/login`, {...});
    const responseDto = plainToInstance(DummyJsonAuthResponseDto, response);
    return responseDto.toDomain();
  }
}
```

### 2. **DTO Pattern dengan Class Transformer**
**Before:** Response langsung di-map manual
```typescript
return {
  id: data.id,
  email: data.email,
  name: `${data.firstName} ${data.lastName}`,
  ...
};
```

**After:** Menggunakan DTO class dengan `@Expose()` decorator
```typescript
export default class DummyJsonAuthResponseDto extends ResponseDto<UserEntity> {
  @Expose() id!: number;
  @Expose() username!: string;
  // ... other fields

  toDomain(): UserEntity {
    return {
      id: this.id,
      email: this.email,
      name: `${this.firstName} ${this.lastName}`,
      ...
    };
  }
}
```

## ✨ Benefits

1. **Konsistensi Arsitektur**: Sama dengan `PostRepository` dan repository lainnya
2. **Centralized HTTP Handling**: Semua request melalui `IHttpClient` yang sudah memiliki:
   - Logging dengan `axios-logger`
   - Base URL configuration dari `env.apiUrl`
   - Error handling otomatis (401/403)
   - Request/Response interceptors
3. **Type Safety**: Menggunakan class-transformer untuk validasi dan transformasi data
4. **Testability**: Lebih mudah di-mock karena menggunakan dependency injection
5. **Separation of Concerns**: DTO layer terpisah dari business logic

## 📁 File Structure

```
src/auth/
├── infrastructure/
│   ├── models/
│   │   └── DummyJsonAuthResponseDto.ts  # DTO class dengan @Expose decorators
│   └── implementations/
│       └── AuthRepository.ts             # Repository dengan DI pattern
├── domain/
│   └── entities/
│       └── UserEntity.ts                 # Domain model
└── application/
    └── types/
        └── LoginPayload.ts               # Input payload
```

## 🔧 Technical Details

### HTTP Client Injection
```typescript
constructor(
  @inject(IHttpClientToken) private readonly httpClient: IHttpClient
) {}
```
- `IHttpClient` adalah abstraksi dari axios
- Sudah dikonfigurasi dengan base URL dari environment
- Memiliki built-in logging dan error handling

### DTO to Domain Mapping
```typescript
const response = await this.httpClient.post<...>(...);
const responseDto = plainToInstance(DummyJsonAuthResponseDto, response);
return responseDto.toDomain();
```
- `plainToInstance`: Mengkonversi plain object ke class instance
- `toDomain()`: Method untuk mapping dari DTO ke Domain Entity

## 🧪 Testing
Fungsi `loginDummy()` tetap tersedia untuk unit testing tanpa memerlukan network call.

## 📚 Related Files
- `src/core/infrastructure/implementations/HttpClient.ts` - HTTP client implementation
- `src/core/domain/specifications/IHttpClient.ts` - HTTP client interface
- `src/core/infrastructure/models/ResponseDto.ts` - Base DTO class
- `src/post/infrastructure/implementations/PostRepository.ts` - Reference implementation

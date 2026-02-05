# Custom App Bar with User Profile

## 📋 Overview
PostsScreen sekarang memiliki **Custom App Bar** yang menampilkan informasi user profile yang diambil dari API `/user/me` dengan authorization Bearer token.

## 🎨 UI Design

```
┌─────────────────────────────────────────────┐
│  👤  Emily                             🔔  │
│      female                                │
└─────────────────────────────────────────────┘
```

**Layout:**
- **Kiri**: Photo profile (circular) + firstName (atas) + gender (bawah)
- **Kanan**: Notification icon (🔔)

## 🔄 Data Flow

```
User Login
    ↓
LoginUseCase.execute()
    ↓
Basic User Data (id, email, name, token)
    ↓
GetCurrentUserUseCase.execute(token)
    ↓
Full Profile from /user/me (firstName, gender, image)
    ↓
LoginStore (observable)
    ↓
CustomAppBar (observer)
```

## 📁 Files Added/Modified

### **New Files**

#### 1. `UserProfileDto.ts`
DTO untuk response dari `/user/me`:
```typescript
export default class UserProfileDto extends ResponseDto<UserEntity> {
  @Expose() id!: number;
  @Expose() username!: string;
  @Expose() email!: string;
  @Expose() firstName!: string;
  @Expose() lastName!: string;
  @Expose() gender!: string;
  @Expose() image!: string;
  
  toDomain(): UserEntity {
    return {
      id: this.id,
      email: this.email,
      name: `${this.firstName} ${this.lastName}`,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      image: this.image,
      // ...
    };
  }
}
```

#### 2. `GetCurrentUserUseCase.ts`
Use case untuk fetch user profile:
```typescript
@injectable()
export default class GetCurrentUserUseCase {
  async execute(token: string): Promise<UserEntity> {
    return this.authRepository.getCurrentUser(token);
  }
}
```

#### 3. `CustomAppBar.tsx`
Komponen UI untuk app bar:
```tsx
const CustomAppBar = observer(() => {
  const loginStore = useLoginStore();
  const { user } = loginStore;

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.leftSection}>
        <Image source={{ uri: user.image }} />
        <View>
          <Text>{user.firstName}</Text>
          <Text>{user.gender}</Text>
        </View>
      </View>
      
      {/* Notification Button */}
      <TouchableOpacity onPress={handleNotificationPress}>
        <Text>🔔</Text>
      </TouchableOpacity>
    </View>
  );
});
```

### **Modified Files**

#### 1. `UserEntity.ts`
Menambahkan field `gender`:
```typescript
export default interface UserEntity {
  // ... existing fields
  gender?: string;  // ✅ New field
}
```

#### 2. `IAuthRepository.ts`
Menambahkan method `getCurrentUser`:
```typescript
export interface IAuthRepository {
  login: (payload: LoginPayload) => Promise<UserEntity>;
  logout: () => Promise<void>;
  getCurrentUser: (token: string) => Promise<UserEntity>;  // ✅ New method
}
```

#### 3. `AuthRepository.ts`
Implementasi `getCurrentUser`:
```typescript
async getCurrentUser(token: string): Promise<UserEntity> {
  const response = await this.httpClient.get<unknown>(
    `/user/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseDto = plainToInstance(UserProfileDto, response);
  const user = responseDto.toDomain();
  user.token = token;  // Preserve token
  
  return user;
}
```

#### 4. `LoginStore.ts`
Auto-fetch profile setelah login:
```typescript
async login(payload: LoginPayload) {
  return this.loginUseCase
    .execute(payload)
    .then(async (user) => {
      // First set basic user
      this.setUser(user);
      
      // Then fetch full profile
      if (user.token) {
        try {
          const fullProfile = await this.getCurrentUserUseCase.execute(user.token);
          this.setUser(fullProfile);  // ✅ Update with full data
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    });
}
```

#### 5. `AuthModule.ts`
Register `GetCurrentUserUseCase`:
```typescript
@module({
  providers: [
    // ...
    GetCurrentUserUseCase,  // ✅ Added
    // ...
  ],
})
```

#### 6. `PostsScreen.tsx`
Menggunakan `CustomAppBar` dan `LoginStoreProvider`:
```tsx
const PostsScreen = observer(() => {
  return (
    <SafeAreaView>
      <CustomAppBar />  {/* ✅ Custom app bar */}
      <View>
        <FlatList data={results} ... />
      </View>
    </SafeAreaView>
  );
});

// ✅ Provide both stores
export default withProviders(
  GetPostsStoreProvider, 
  LoginStoreProvider
)(PostsScreen);
```

## 🔐 API Integration

### **Endpoint: GET /user/me**

**Request:**
```http
GET https://dummyjson.com/user/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Emily",
  "lastName": "Johnson",
  "maidenName": "Smith",
  "age": 28,
  "gender": "female",
  "email": "emily.johnson@x.dummyjson.com",
  "image": "https://dummyjson.com/icon/emilys/128",
  "username": "emilys"
}
```

## ✨ Key Features

### 1. **Automatic Profile Loading**
Setelah login berhasil, profile lengkap otomatis di-fetch dari `/user/me`:
```typescript
// Login flow:
1. Call /auth/login → get basic user + token
2. Automatically call /user/me with token → get full profile
3. Update LoginStore with complete data
```

### 2. **Observable State**
CustomAppBar menggunakan MobX observer untuk reaktif terhadap perubahan user data:
```typescript
const CustomAppBar = observer(() => {
  const { user } = useLoginStore();
  // ✅ Auto re-render when user changes
});
```

### 3. **Multiple Providers**
PostsScreen menggunakan multiple providers untuk akses ke berbagai stores:
```typescript
withProviders(GetPostsStoreProvider, LoginStoreProvider)(PostsScreen)
```

### 4. **Safe Fallbacks**
- Default placeholder image jika tidak ada
- Profile fetch error tidak membatalkan login
- Gender capitalize otomatis

## 🎯 User Experience

**Login Flow:**
1. User login dengan username/password
2. Loading indicator muncul
3. Basic user data tersimpan
4. **Background:** Full profile di-fetch dari `/user/me`
5. **UI Update:** App bar menampilkan firstName, gender, dan photo
6. User dinavigasi ke News screen dengan app bar yang sudah complete

## 🧪 Testing

**Test Credentials:**
```
Username: emilys
Password: emilyspass

Expected Profile:
- firstName: Emily
- gender: female
- image: https://dummyjson.com/icon/emilys/128
```

## 📊 Architecture Layers

```
┌─────────────────────────────────────┐
│  Presentation Layer                 │
│  - CustomAppBar (Component)         │
│  - PostsScreen (Screen)             │
│  - LoginStore (State Management)    │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  Application Layer                  │
│  - GetCurrentUserUseCase            │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  Domain Layer                       │
│  - UserEntity                       │
│  - IAuthRepository                  │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  Infrastructure Layer               │
│  - AuthRepository                   │
│  - UserProfileDto                   │
│  - HttpClient                       │
└─────────────────────────────────────┘
```

## 🔧 Customization

### Change Notification Icon
Edit `CustomAppBar.tsx`:
```tsx
<Text style={styles.notificationIcon}>🔔</Text>
// Change to: 
<Text style={styles.notificationIcon}>🔴</Text>  // Red dot
// Or use an icon library
```

### Add More User Info
1. Update `UserEntity` with new field
2. Update `UserProfileDto` with `@Expose()` decorator
3. Update `CustomAppBar` to display new field

### Handle Notification Press
Edit `handleNotificationPress` in `CustomAppBar.tsx`:
```typescript
const handleNotificationPress = () => {
  navigation.navigate("Notifications");
};
```

## 📚 Related Documentation
- `AUTH_REPOSITORY_REFACTORING.md` - Auth architecture
- `TEST_CREDENTIALS.md` - Login credentials

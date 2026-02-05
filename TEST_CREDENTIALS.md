# Test Credentials - DummyJSON API

API ini menggunakan **https://dummyjson.com** sebagai backend.

## Login Credentials

Berikut adalah beberapa kredensial yang bisa digunakan untuk testing:

### User 1 (Emily)
- **Username**: `emilys`
- **Password**: `emilyspass`

### User 2 (Michael)
- **Username**: `michaelw`
- **Password**: `michaelwpass`

### User 3 (Sophia)
- **Username**: `sophiab`
- **Password**: `sophiabpass`

### User 4 (James)
- **Username**: `jamesd`
- **Password**: `jamesdpass`

### User 5 (Emma)
- **Username**: `emmaj`
- **Password**: `emmajpass`

## API Endpoints

### Login
```
POST https://dummyjson.com/auth/login
Content-Type: application/json

{
  "username": "emilys",
  "password": "emilyspass"
}
```

### Response
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Dokumentasi Lengkap

Untuk melihat semua user dan dokumentasi API lengkap, kunjungi:
- **Users List**: https://dummyjson.com/users
- **API Docs**: https://dummyjson.com/docs/auth

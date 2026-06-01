# 🏗️ HOW IT WORKS - Architecture & API Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Client (Browser/Mobile)             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS API Server                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers (Route Handlers)                        │   │
│  │  ├── AuthController      - Login, signup, refresh   │   │
│  │  ├── UsersController     - User management          │   │
│  │  └── ... (Future modules)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services (Business Logic)                           │   │
│  │  ├── AuthService         - Auth logic               │   │
│  │  ├── UsersService        - User operations          │   │
│  │  └── PrismaService       - Database access          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Guards & Middleware                                 │   │
│  │  ├── JwtAuthGuard        - JWT validation           │   │
│  │  ├── RolesGuard          - Role-based access        │   │
│  │  └── ErrorHandling       - Exception filters        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Swagger Documentation                               │   │
│  │  URL: /api-docs                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────────────────┘
                      │ SQL
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Prisma ORM                                  │
│  ├── Schema Validation                                      │
│  ├── Type-Safe Queries                                      │
│  └── Auto-Generated Client                                  │
└─────────────────────┬──────────────────────────────────────┘
                      │ JDBC
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                             │
│  ├── users table          - User accounts                   │
│  ├── user_sessions table  - JWT refresh tokens              │
│  └── ... (Future tables)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## API Request Flow

### 1. Authentication Flow (Login)

```
Client                          Server
  │                               │
  ├─ POST /auth/login ─────────> │
  │  (email, password)            │
  │                               │
  │                     [Validate credentials]
  │                     [Hash password check]
  │                               │
  │ <──── 200 OK + JWT ─────────┤
  │  (access_token)               │
  │  (refresh_token)              │
  │                               │
  │  [Store token in localStorage]
  │
  └─ Authorization Header ──────> │
     Bearer: <access_token>       │
```

**Steps:**
1. Client sends email & password to `/auth/login`
2. Server validates credentials using bcrypt
3. Server generates JWT token & refresh token
4. Client stores JWT in localStorage
5. Client includes JWT in Authorization header for future requests

---

### 2. Protected Route Flow

```
Client                          Server
  │                               │
  ├─ GET /users ────────────────> │
  │  Headers: {                   │
  │    Authorization:             │
  │    "Bearer <jwt_token>"       │
  │  }                            │
  │                               │
  │                     [JwtAuthGuard validates]
  │                     [Decode token]
  │                     [Extract user info]
  │                               │
  │ <──── 200 OK + Data ────────┤
  │  (if valid)                   │
  │                               │
  │ <──── 401 Unauthorized ─────┤
  │  (if invalid/expired)         │
```

**Steps:**
1. Client includes JWT in Authorization header
2. JwtAuthGuard intercepts request
3. Guard validates token signature
4. If valid: Extract user ID from token payload
5. If invalid/expired: Return 401 error
6. Proceed to controller if valid

---

### 3. Token Refresh Flow

```
Client                          Server
  │                               │
  │ [Access token expired]        │
  │                               │
  ├─ POST /auth/refresh ────────> │
  │  (refresh_token)              │
  │                               │
  │                     [Validate refresh token]
  │                     [Check expiration]
  │                     [Issue new access token]
  │                               │
  │ <──── 200 OK + New JWT ─────┤
  │  (new access_token)           │
  │                               │
  │  [Update localStorage]
  │
  └─ Continue with new JWT ─────> │
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image TEXT,
  role VARCHAR(20) DEFAULT 'COUPLE',
  provider VARCHAR(50),              -- OAuth provider (google, facebook)
  provider_id VARCHAR(255),          -- OAuth provider ID
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## Module Architecture

### Auth Module
```
auth/
├── auth.controller.ts      - Routes: POST /auth/login, /auth/signup
├── auth.service.ts         - Business logic: hash, validate, generate JWT
├── dto/
│   ├── login.dto.ts       - Request validation
│   └── auth-response.dto.ts
├── guards/
│   └── jwt-auth.guard.ts  - Validate JWT tokens
├── strategies/
│   └── jwt.strategy.ts    - Passport JWT strategy
└── decorators/
    └── current-user.decorator.ts  - Extract user from request
```

**Responsibilities:**
- User login & signup
- JWT token generation
- Refresh token management
- Password hashing with bcrypt

---

### Users Module
```
users/
├── users.controller.ts     - Routes: GET /users, GET /users/:id, etc
├── users.service.ts        - Business logic: CRUD operations
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
└── entities/
    └── user.entity.ts      - Type definitions
```

**Responsibilities:**
- User profile management
- User data validation
- User search & filtering

---

### Prisma Module
```
prisma/
├── prisma.service.ts       - Prisma client wrapper
└── prisma.module.ts        - Module configuration
```

**Responsibilities:**
- Database connection management
- Prisma client lifecycle
- Made available to all modules via DI

---

## Request Lifecycle

```
HTTP Request
    ↓
Router (URL matching)
    ↓
Middleware (CORS, logging, etc)
    ↓
Guards (JWT validation, roles)
    ↓
Pipes (DTO validation, transformation)
    ↓
Controller (Route handler)
    ↓
Service (Business logic)
    ↓
Prisma (Database operations)
    ↓
PostgreSQL (Data persistence)
    ↓
Serializer (Response formatting)
    ↓
HTTP Response
```

---

## Data Flow Example: Create User

```
1. Client sends POST /users
   Body: { email: "user@example.com", firstName: "John" }

2. Router matches to UsersController.create()

3. Pipe validates DTO
   - Checks email format
   - Validates required fields
   - Transforms data types

4. Guard checks JWT (if protected route)

5. Controller calls UsersService.create()

6. Service calls PrismaService
   prisma.users.create({ data: {...} })

7. Prisma generates SQL query and sends to PostgreSQL
   INSERT INTO users (email, first_name, ...)

8. Database returns created record

9. Service returns user object

10. Controller serializes response

11. Response sent to client
    Status: 201 Created
    Body: { id: "...", email: "...", ... }
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/vivaah360"

# JWT
JWT_SECRET="min_32_chars_secret_key_here"
JWT_EXPIRATION="24h"

# Refresh Token
REFRESH_TOKEN_SECRET="min_32_chars_refresh_secret"
REFRESH_TOKEN_EXPIRATION="7d"

# Server
PORT=3000
NODE_ENV="development"
```

---

## Key Concepts

### JWT (JSON Web Token)
- Stateless authentication token
- Encoded with secret key
- Contains user ID & expiration
- Decoded & validated on each protected request

### Prisma
- Type-safe database ORM
- Generates migrations
- Auto-generates TypeScript types
- Simplifies database queries

### Guards
- Validate requests before handler executes
- Can check JWT, roles, permissions
- Return 401/403 if validation fails

### DTOs (Data Transfer Objects)
- Validates incoming request data
- Class-validator decorators
- Ensures type safety
- Transforms data if needed

### Services
- Contain business logic
- Depend on Prisma for data access
- Reusable across controllers
- Testable independently

---

## Testing API

### Using Swagger UI
1. Go to `http://localhost:3000/api-docs`
2. Click "Authorize" button
3. Paste JWT token: `Bearer <token>`
4. Test endpoints with "Try it out" button

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Protected request
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <jwt_token>"
```

### Using Postman
1. Set request type and URL
2. Add Authorization header: `Bearer <token>`
3. Send request

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/expired JWT | Get new token from /auth/refresh |
| 422 Unprocessable Entity | DTO validation failed | Check request body format |
| 500 Internal Server Error | Database error | Check PostgreSQL connection |
| CORS Error | Frontend not in CORS whitelist | Update CORS_ORIGINS in .env |

---

**Last Updated**: June 1, 2026

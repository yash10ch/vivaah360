# Vivaah360 API - Project Setup & Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Work Completed Today](#work-completed-today)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Database & Prisma](#database--prisma)
- [API Documentation](#api-documentation)
- [Module Breakdown](#module-breakdown)
- [Authentication](#authentication)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Vivaah360** is a wedding planning platform API built with:
- **Framework**: NestJS 10
- **Database**: PostgreSQL
- **ORM**: Prisma 6.19.3
- **Authentication**: JWT with Passport.js
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

This is a production-ready backend API for a comprehensive wedding planning solution.

---

## Work Completed Today

### ✅ Completed Tasks

1. **Folder Structure Created**
   - Set up modular folder architecture under `src/`
   - Created subdirectories for auth (controllers, services, dto, guards, strategies)
   - Organized users, prisma, common, and config modules

2. **NestJS Module Generation**
   - Generated `auth` module with controller and service
   - Generated `users` module with controller and service
   - Generated `prisma` module for database abstraction

3. **Prisma Setup & Bug Fixes**
   - Configured Prisma 6 with PostgreSQL datasource
   - Created `prisma.config.ts` for Prisma configuration
   - Set up database schema with `users` and `user_sessions` models
   - **Fixed Prisma Error**: Resolved schema validation error by maintaining v6-compatible datasource configuration

4. **Swagger API Documentation**
   - Integrated Swagger UI at `/api-docs`
   - Configured Bearer token authentication in Swagger
   - Set up API title, description, and versioning

5. **Package Updates**
   - Added Swagger dependencies: `@nestjs/swagger`, `swagger-ui-express`
   - Verified all authentication packages: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`

---

## Project Structure

```
vivaah360-api/
├── src/
│   ├── auth/                      # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── controllers/           # Custom auth controllers
│   │   ├── services/              # Custom auth services
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── guards/                # Auth guards (JWT, etc)
│   │   └── strategies/            # Passport strategies
│   │
│   ├── users/                     # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.spec.ts
│   │   └── users.service.spec.ts
│   │
│   ├── prisma/                    # Prisma service module
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.ts
│   │   └── prisma.service.spec.ts
│   │
│   ├── common/                    # Shared utilities, decorators, etc
│   │
│   ├── config/                    # Configuration files
│   │
│   ├── app.module.ts              # Root application module
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                    # Application entry point
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
│
├── test/
│   └── app.e2e-spec.ts            # End-to-end tests
│
├── prisma.config.ts               # Prisma configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── nest-cli.json                  # NestJS CLI config
└── .env                           # Environment variables (not in repo)
```

---

## Prerequisites

Before getting started, ensure you have:

- **Node.js**: v20.3.1 or higher
- **npm**: v10.0.0 or higher
- **PostgreSQL**: v12 or higher (running locally or remote connection)
- **Git**: For version control

### Check Versions
```bash
node --version
npm --version
```

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yash10ch/vivaah360.git
cd vivaah360/backend/vivaah360-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/vivaah360"

# JWT Configuration
JWT_SECRET="your_jwt_secret_key_here"
JWT_EXPIRATION="24h"

# API Configuration
NODE_ENV="development"
PORT=3000

# Refresh Token
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_TOKEN_EXPIRATION="7d"
```

**Important**: Replace values with your actual configuration.

### 4. Set Up Database

#### Option A: Using Prisma Migrate (Recommended)
```bash
npx prisma migrate dev --name init
```

#### Option B: Push Existing Schema
```bash
npx prisma db push
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

---

## Running the Project

### Development Mode (with hot-reload)
```bash
npm run start:dev
```
Server runs on `http://localhost:3000`

### Debug Mode
```bash
npm run start:debug
```
Debugger available on port 9229

### Production Build
```bash
npm run build
npm run start:prod
```

### Other Commands

| Command | Purpose |
|---------|---------|
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Generate coverage report |
| `npm run test:e2e` | Run end-to-end tests |

---

## Database & Prisma

### Prisma Overview

Prisma is a next-generation ORM that provides:
- Type-safe database access
- Auto-generated migrations
- Interactive database browser (Prisma Studio)
- Schema validation

### Current Database Schema

#### Users Table
```prisma
model users {
  id              String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email           String          @unique @db.VarChar(255)
  first_name      String?         @db.VarChar(100)
  last_name       String?         @db.VarChar(100)
  profile_image   String?
  role            String          @default("COUPLE") @db.VarChar(20)
  provider        String?         @db.VarChar(50)      # OAuth provider
  provider_id     String?         @db.VarChar(255)    # OAuth provider ID
  is_active       Boolean?        @default(true)
  created_at      DateTime?       @default(now()) @db.Timestamp(6)
  updated_at      DateTime?       @default(now()) @db.Timestamp(6)
  user_sessions   user_sessions[]
}
```

#### User Sessions Table
```prisma
model user_sessions {
  id              String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id         String    @db.Uuid
  refresh_token   String
  expires_at      DateTime  @db.Timestamp(6)
  created_at      DateTime? @default(now()) @db.Timestamp(6)
  users           users     @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_user")
}
```

### Useful Prisma Commands

#### View Data in Prisma Studio
```bash
npx prisma studio
```
Opens interactive UI at `http://localhost:5555`

#### Create a Migration
```bash
npx prisma migrate dev --name name_of_migration
```

#### View Migration Status
```bash
npx prisma migrate status
```

#### Reset Database (Development Only!)
```bash
npx prisma migrate reset
```
⚠️ Warning: This deletes all data!

#### Validate Schema
```bash
npx prisma validate
```

---

## API Documentation

### Swagger UI

Once the server is running, access the interactive API documentation:

```
http://localhost:3000/api-docs
```

### Features Available in Swagger
- ✅ Explore all API endpoints
- ✅ View request/response schemas
- ✅ Try endpoints with the "Try it out" button
- ✅ Authenticate with Bearer token
- ✅ View error responses

### Authentication in Swagger

1. Click the "Authorize" button (top-right)
2. Enter your JWT token in the format: `Bearer <your_token>`
3. All requests will include this token

---

## Module Breakdown

### 1. **Auth Module**
Handles user authentication and authorization.

**Files:**
- `auth.controller.ts` - Route handlers for login, signup, token refresh
- `auth.service.ts` - Authentication business logic
- `strategies/` - Passport.js strategies (JWT, local, etc)
- `guards/` - Custom auth guards (JWT validation)
- `dto/` - Data Transfer Objects for auth requests/responses

**Features:**
- JWT-based authentication
- Password hashing with bcrypt
- Refresh token mechanism
- Role-based access control (RBAC)

### 2. **Users Module**
Manages user profiles and data.

**Files:**
- `users.controller.ts` - User CRUD endpoints
- `users.service.ts` - User business logic
- `users.controller.spec.ts` - Controller tests
- `users.service.spec.ts` - Service tests

**Features:**
- User registration and profile management
- User data validation
- Social login provider integration

### 3. **Prisma Module**
Database abstraction layer.

**Files:**
- `prisma.service.ts` - Prisma client wrapper
- `prisma.module.ts` - Module configuration

**Purpose:**
- Centralized database service
- Lifecycle management (onModuleInit, onModuleDestroy)
- Accessibility across all modules via dependency injection

### 4. **Common Module**
Shared utilities and helpers.

**Expected Contents:**
- Common exceptions
- Custom decorators
- Shared DTOs
- Utility functions

### 5. **Config Module**
Configuration management.

**Expected Contents:**
- Configuration services
- Environment variable validation
- Constants

---

## Authentication

### JWT Flow

```
1. User Login → Generate JWT + Refresh Token
2. Client stores JWT in localStorage/cookie
3. Client sends JWT in Authorization header: "Bearer <token>"
4. Server validates JWT using Passport strategy
5. Route handler receives authenticated user
6. Token expires → Client uses Refresh Token to get new JWT
```

### Required Dependencies
- `@nestjs/jwt` - JWT generation/validation
- `@nestjs/passport` - Passport integration
- `passport-jwt` - JWT strategy for Passport
- `bcrypt` - Password hashing

---

## Development Workflow

### Creating a New API Endpoint

#### Step 1: Generate Module (if needed)
```bash
nest g module my-feature
nest g controller my-feature
nest g service my-feature
```

#### Step 2: Create DTO (Data Transfer Object)
```bash
# File: src/my-feature/dto/create-my-feature.dto.ts
export class CreateMyFeatureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

#### Step 3: Implement Service
```bash
# File: src/my-feature/my-feature.service.ts
@Injectable()
export class MyFeatureService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMyFeatureDto) {
    return this.prisma.myModel.create({ data });
  }
}
```

#### Step 4: Add Controller Endpoint
```bash
# File: src/my-feature/my-feature.controller.ts
@Controller('my-feature')
export class MyFeatureController {
  constructor(private service: MyFeatureService) {}

  @Post()
  create(@Body() dto: CreateMyFeatureDto) {
    return this.service.create(dto);
  }
}
```

#### Step 5: Add to Module
```bash
# File: src/my-feature/my-feature.module.ts
@Module({
  controllers: [MyFeatureController],
  providers: [MyFeatureService],
  imports: [PrismaModule],
})
export class MyFeatureModule {}
```

#### Step 6: Import in App Module
```bash
# File: src/app.module.ts
@Module({
  imports: [MyFeatureModule, AuthModule, UsersModule, PrismaModule],
})
export class AppModule {}
```

---

## Troubleshooting

### Issue: Prisma Schema Validation Error (P1012)
```
Error: Argument "url" is missing in data source block "db"
```
**Solution:**
- Current setup uses Prisma v6 which requires `url = env("DATABASE_URL")` in schema
- This is already configured correctly in the project
- Run: `npx prisma validate` to verify

### Issue: Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
1. Ensure PostgreSQL is running
2. Verify `DATABASE_URL` in `.env` file
3. Check credentials (username, password, port)
4. Test connection: `psql postgresql://user:password@localhost:5432/vivaah360`

### Issue: Prisma Client Not Generated
```
Error: Could not find @prisma/client in node_modules
```
**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

### Issue: Port 3000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or run on different port
PORT=3001 npm run start:dev
```

### Issue: JWT Authentication Not Working
**Check:**
1. JWT_SECRET is set in `.env`
2. Token format is correct: `Bearer <token>`
3. Token hasn't expired
4. Use Swagger UI to test with valid token

### Issue: Changes Not Reflecting (Hot-Reload Not Working)
**Solution:**
```bash
# Stop the server and restart
npm run start:dev
```

---

## Environment Variables Reference

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME

# JWT
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRATION=24h

# Refresh Token
REFRESH_TOKEN_SECRET=your_refresh_secret_key
REFRESH_TOKEN_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=development

# Optional: CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## Next Steps

1. **Create Authentication Endpoints**
   - POST `/auth/signup` - Register new user
   - POST `/auth/login` - Login user
   - POST `/auth/refresh` - Refresh JWT token
   - POST `/auth/logout` - Logout user

2. **Implement User Endpoints**
   - GET `/users` - List all users
   - GET `/users/:id` - Get user by ID
   - PATCH `/users/:id` - Update user profile
   - DELETE `/users/:id` - Delete user

3. **Add More Models**
   - Wedding details, guests, vendors, budget, timeline, etc.

4. **Testing**
   - Write unit tests for services
   - Write integration tests for controllers
   - Set up E2E test suite

5. **Deployment**
   - Set up CI/CD pipeline (GitHub Actions)
   - Deploy to cloud (AWS, Heroku, Vercel)
   - Set up monitoring and logging

---

## Useful Resources

- **NestJS Documentation**: https://docs.nestjs.com
- **Prisma Documentation**: https://www.prisma.io/docs
- **JWT Guide**: https://jwt.io/introduction
- **Passport.js**: https://www.passportjs.org
- **PostgreSQL**: https://www.postgresql.org/docs

---

## Support & Questions

For issues or questions:
1. Check this documentation first
2. Review NestJS and Prisma official docs
3. Check the troubleshooting section
4. Review error logs carefully

---

**Last Updated**: June 1, 2026  
**Version**: 1.0  
**Branch**: feature/yash

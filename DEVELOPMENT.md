# 🛠️ DEVELOPMENT - Setup, Commands & Workflow

## ⚡ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/yash10ch/vivaah360.git
cd vivaah360/backend/vivaah360-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
nano .env  # or open in editor
```

### 4. Setup Database
```bash
# Create migrations
npx prisma migrate dev --name init

# View data (opens UI at localhost:5555)
npx prisma studio
```

### 5. Start Development
```bash
npm run start:dev
```

✅ Server running: `http://localhost:3000`  
✅ API docs: `http://localhost:3000/api-docs`

---

## 📋 All npm Commands

### Development
```bash
npm run start:dev        # Start with hot-reload (best for development)
npm run start:debug      # Start with debugger on port 9229
npm start                # Start production mode
npm run start:prod       # Run compiled dist folder
```

### Building
```bash
npm run build            # Compile TypeScript to dist/
npm run build:prod       # Build for production
```

### Code Quality
```bash
npm run lint             # Run ESLint and fix issues
npm run format           # Format code with Prettier
npm run lint:check       # Check without fixing
```

### Testing
```bash
npm test                 # Run unit tests once
npm run test:watch       # Watch mode - reruns on change
npm run test:cov         # Coverage report
npm run test:debug       # Debug tests
npm run test:e2e         # End-to-end tests
```

### Database / Prisma
```bash
npx prisma studio              # Open database UI (port 5555)
npx prisma generate            # Regenerate Prisma client
npx prisma validate            # Validate schema syntax
npx prisma format              # Auto-format schema.prisma
npx prisma migrate dev --name <name>  # Create & apply migration
npx prisma migrate status              # Check migration status
npx prisma migrate reset               # ⚠️ Reset database (dev only!)
```

---

## 🏗️ Daily Development Workflow

### Morning Standup
```bash
# Get latest code
git pull origin feature/yash

# Install new dependencies
npm install

# Check database migrations
npx prisma migrate status

# Start dev server
npm run start:dev
```

### While Coding
1. Make changes to files
2. Hot-reload picks up changes automatically
3. Check Swagger docs: `http://localhost:3000/api-docs`
4. Test endpoints manually

### Before Committing
```bash
# Check code quality
npm run lint        # Fix lint errors
npm run format      # Format code

# Run tests
npm test            # Make sure tests pass

# Verify build
npm run build       # Ensure no TypeScript errors

# Review changes
git status
git diff
```

### Committing
```bash
git add .
git commit -m "feat(auth): add login endpoint"
git push origin feature/yash
```

---

## 🆕 Creating New Features

### 1. Generate Module Structure
```bash
# Create module, controller, service
nest g mo features/my-feature
nest g co features/my-feature
nest g s features/my-feature

# This creates:
# src/features/my-feature/
# ├── my-feature.module.ts
# ├── my-feature.controller.ts
# ├── my-feature.controller.spec.ts
# ├── my-feature.service.ts
# └── my-feature.service.spec.ts
```

### 2. Create DTOs
```bash
mkdir -p src/features/my-feature/dto

# Create validation classes
cat > src/features/my-feature/dto/create-my-feature.dto.ts << 'EOF'
import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMyFeatureDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}
EOF
```

### 3. Implement Service (Business Logic)
```typescript
// src/features/my-feature/my-feature.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMyFeatureDto } from './dto/create-my-feature.dto';

@Injectable()
export class MyFeatureService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMyFeatureDto) {
    // Business logic here
    return this.prisma.myModel.create({ data });
  }

  async findAll() {
    return this.prisma.myModel.findMany();
  }

  async findOne(id: string) {
    return this.prisma.myModel.findUnique({ where: { id } });
  }
}
```

### 4. Add Controller Endpoints
```typescript
// src/features/my-feature/my-feature.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MyFeatureService } from './my-feature.service';
import { CreateMyFeatureDto } from './dto/create-my-feature.dto';

@Controller('my-feature')
@UseGuards(JwtAuthGuard)  // Protect all endpoints
export class MyFeatureController {
  constructor(private service: MyFeatureService) {}

  @Post()
  @ApiOperation({ summary: 'Create new item' })
  @ApiResponse({ status: 201, description: 'Item created' })
  create(@Body() dto: CreateMyFeatureDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
```

### 5. Import Module in App
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { MyFeatureModule } from './features/my-feature/my-feature.module';

@Module({
  imports: [
    MyFeatureModule,      // Add this
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
})
export class AppModule {}
```

### 6. Add Tests
```bash
# Tests generated automatically with -spec suffix
npm test  # Run all tests
npm run test:watch  # Watch mode

# Edit my-feature.service.spec.ts and my-feature.controller.spec.ts
```

---

## 🗄️ Database Management

### Add New Table to Schema

1. **Edit schema.prisma**
```prisma
// prisma/schema.prisma
model MyModel {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String   @db.VarChar(255)
  email     String   @unique
  userId    String   @db.Uuid
  user      users    @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @db.Timestamp(6)
  updatedAt DateTime @updatedAt @db.Timestamp(6)
}

model users {
  id        String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String    @unique @db.VarChar(255)
  // ... other fields
  myModels  MyModel[]  // Add this relation
}
```

2. **Create migration**
```bash
npx prisma migrate dev --name add_my_model
```

3. **Generate client**
```bash
npx prisma generate
```

4. **Use in service**
```typescript
async create(data: CreateMyModelDto) {
  return this.prisma.myModel.create({ data });
}
```

### Prisma Query Examples

```typescript
// CREATE
await this.prisma.users.create({
  data: { email: 'user@example.com', firstName: 'John' },
});

// READ
await this.prisma.users.findMany();
await this.prisma.users.findUnique({ where: { id: '123' } });
await this.prisma.users.findFirst({ where: { email: 'user@example.com' } });

// UPDATE
await this.prisma.users.update({
  where: { id: '123' },
  data: { firstName: 'Jane' },
});

// DELETE
await this.prisma.users.delete({ where: { id: '123' } });

// WITH RELATIONS
await this.prisma.users.findUnique({
  where: { id: '123' },
  include: { user_sessions: true },  // Include related records
});
```

---

## 🔒 Protected Routes & Authentication

### Use JwtAuthGuard
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)  // Protect entire controller
export class UsersController {
  // All routes here require JWT
}

// Or protect specific routes
@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() { ... }

  @Get('public')  // Not protected
  findPublic() { ... }
}
```

### Get Current User in Handler
```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Get('profile')
getProfile(@CurrentUser() user: any) {
  return user;  // Automatically extracts from JWT
}
```

---

## 🧪 Testing

### Run Tests
```bash
npm test              # Run all once
npm run test:watch    # Watch mode
npm run test:cov      # Coverage
```

### Write Service Test
```typescript
// my-feature.service.spec.ts
import { Test } from '@nestjs/testing';
import { MyFeatureService } from './my-feature.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MyFeatureService', () => {
  let service: MyFeatureService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MyFeatureService,
        { provide: PrismaService, useValue: { myModel: { findMany: jest.fn() } } },
      ],
    }).compile();

    service = module.get(MyFeatureService);
  });

  it('should find all items', async () => {
    await service.findAll();
    expect(prisma.myModel.findMany).toHaveBeenCalled();
  });
});
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Windows: Kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run start:dev
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection:
psql postgresql://user:pass@localhost:5432/vivaah360
```

### Prisma Client Not Found
```bash
npm install @prisma/client
npx prisma generate
```

### TypeScript Errors
```bash
npm run build  # Shows all TypeScript errors
```

### Hot-Reload Not Working
```bash
# Restart dev server
npm run start:dev
```

### Tests Failing
```bash
npm test -- --clearCache
npm test -- --verbose
```

---

## 📚 Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/
│   ├── strategies/
│   ├── decorators/
│   └── dto/
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/          # Shared utilities (empty, ready for use)
├── config/          # Config files (empty, ready for use)
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Migration files

test/
└── app.e2e-spec.ts
```

---

## 🔑 Environment Variables

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/vivaah360"

# JWT Authentication
JWT_SECRET="your_secret_key_min_32_chars"
JWT_EXPIRATION="24h"

# Refresh Token
REFRESH_TOKEN_SECRET="your_refresh_secret_min_32_chars"
REFRESH_TOKEN_EXPIRATION="7d"

# Server
PORT=3000
NODE_ENV="development"

# Optional
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

---

## 📤 Git Workflow

### Branch Naming
```
feature/feature-name     # New features
bugfix/bug-name          # Bug fixes
hotfix/issue-name        # Production hotfixes
```

### Commit Messages
```
feat(auth): add JWT authentication
fix(users): resolve null reference error
docs(readme): update setup instructions
refactor(prisma): improve database service
test(users): add unit tests
```

### Push Code
```bash
git checkout -b feature/my-feature
git add .
git commit -m "feat(scope): description"
git push origin feature/my-feature
# Create PR on GitHub
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build          # Creates dist/ folder
npm run start:prod     # Run compiled code
```

### Environment for Production
```env
NODE_ENV="production"
JWT_SECRET="production_secret_key"
DATABASE_URL="production_database_url"
# All other config
```

### Deployment Steps
1. Build: `npm run build`
2. Migrate: `npx prisma migrate deploy`
3. Start: `npm run start:prod`
4. Monitor logs

---

## 📞 Resources & Help

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **JWT Guide**: https://jwt.io
- **Passport.js**: https://www.passportjs.org

---

**Updated**: June 1, 2026  
**Maintained by**: Development Team

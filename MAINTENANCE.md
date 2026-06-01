# 🛠️ Vivaah360 Project Maintenance Guide

## Daily Development Checklist

### Before Starting Development
- [ ] Pull latest changes: `git pull origin feature/yash`
- [ ] Install new dependencies: `npm install`
- [ ] Check database connection: `.env` file configured
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Start dev server: `npm run start:dev`

### While Developing
- [ ] Follow the folder structure (don't create random files)
- [ ] Create DTOs for all data transfers
- [ ] Use Prisma service for all DB operations
- [ ] Write unit tests for services
- [ ] Use Swagger decorators for API documentation
- [ ] Follow TypeScript strict mode
- [ ] Keep code formatted: `npm run format`
- [ ] Check for linting errors: `npm run lint`

### Before Committing
- [ ] Run tests: `npm test`
- [ ] Run linter: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Test locally: `npm run start:dev`
- [ ] Update SETUP.md if changes made
- [ ] Document breaking changes
- [ ] Review your changes carefully

### Database Changes
- [ ] Update `prisma/schema.prisma`
- [ ] Create migration: `npx prisma migrate dev --name description`
- [ ] Test migration locally
- [ ] Push to repository
- [ ] Other developers pull and run migration

---

## Module Development Guide

### Creating a New Module

```bash
# 1. Generate module, controller, service
nest g mo features/my-module
nest g co features/my-module
nest g s features/my-module

# 2. Create DTOs
mkdir -p src/features/my-module/dto
touch src/features/my-module/dto/create-my-module.dto.ts
touch src/features/my-module/dto/update-my-module.dto.ts

# 3. Implement logic following NestJS patterns
# 4. Add Swagger decorators
# 5. Write tests
# 6. Import module in app.module.ts
```

### Module Template Structure
```
src/features/my-module/
├── dto/
│   ├── create-my-module.dto.ts
│   ├── update-my-module.dto.ts
│   └── query-my-module.dto.ts
├── entities/
│   └── my-module.entity.ts
├── my-module.module.ts
├── my-module.controller.ts
├── my-module.controller.spec.ts
├── my-module.service.ts
└── my-module.service.spec.ts
```

---

## Database Management

### Common Prisma Tasks

| Task | Command |
|------|---------|
| Create migration | `npx prisma migrate dev --name name` |
| View schema in UI | `npx prisma studio` |
| Check migration status | `npx prisma migrate status` |
| Reset database | `npx prisma migrate reset` ⚠️ **Dev only** |
| Validate schema | `npx prisma validate` |
| Generate client | `npx prisma generate` |
| Format schema | `npx prisma format` |

### Adding New Model to Schema

1. **Edit schema.prisma**
```prisma
model MyModel {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String   @db.VarChar(255)
  email     String   @unique
  createdAt DateTime @default(now()) @db.Timestamp(6)
  updatedAt DateTime @updatedAt @db.Timestamp(6)
}
```

2. **Create migration**
```bash
npx prisma migrate dev --name add_my_model
```

3. **Generate Prisma client**
```bash
npx prisma generate
```

4. **Use in service**
```typescript
const result = await this.prisma.myModel.create({ data: {...} });
```

---

## Testing Guidelines

### Unit Tests (Services)
```bash
npm test -- my-module.service
```

### Integration Tests (Controllers)
```bash
npm test -- my-module.controller
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:cov
```

---

## API Development Workflow

### Step 1: Define DTO
```typescript
// src/features/users/dto/create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
```

### Step 2: Create Entity (Optional)
```typescript
// src/features/users/entities/user.entity.ts
export class UserEntity {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  createdAt: Date;
}
```

### Step 3: Implement Service
```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.users.findMany();
  }
}
```

### Step 4: Add Controller Endpoints
```typescript
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }
}
```

### Step 5: Add to Module
```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
```

---

## Authentication & Authorization

### Protecting Routes with JWT Guard

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)  // Protect entire controller
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

### Getting Current User in Handlers

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Get('profile')
getProfile(@CurrentUser() user: UserEntity) {
  return user;
}
```

---

## Git Workflow

### Branch Naming Convention
- Feature: `feature/feature-name`
- Bug fix: `bugfix/bug-name`
- Hotfix: `hotfix/issue-name`
- Release: `release/v1.0.0`

### Commit Message Convention
```
type(scope): subject

- feature(auth): add JWT authentication
- fix(users): resolve null reference in profile endpoint
- docs(setup): update installation instructions
- refactor(prisma): improve database service structure
- test(users): add unit tests for user service
```

### Before Pushing
```bash
npm run lint        # Fix linting issues
npm run format      # Format code
npm test            # Run tests
git status          # Check what you're committing
git add .
git commit -m "type(scope): message"
git push origin feature/branch-name
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Build successful: `npm run build`
- [ ] Database migrations ready: `npx prisma migrate status`
- [ ] Environment variables configured
- [ ] Sensitive data not in code (API keys, passwords)

### Deployment
- [ ] Set environment variables on server
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Install dependencies: `npm install --production`
- [ ] Build application: `npm run build`
- [ ] Start application: `npm run start:prod`

### Post-Deployment
- [ ] Check server logs for errors
- [ ] Test API endpoints
- [ ] Monitor database performance
- [ ] Setup automated backups

---

## Performance & Best Practices

### Optimization Tips
1. **Database Queries**
   - Use Prisma select/include to avoid over-fetching
   - Add pagination for large datasets
   - Use database indexes for frequent queries

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

3. **API Response**
   - Return only necessary fields
   - Use pagination with limits
   - Compress responses (gzip)

4. **Error Handling**
   - Use proper HTTP status codes
   - Provide meaningful error messages
   - Log errors for debugging

### Code Quality
- Write descriptive comments for complex logic
- Follow TypeScript strict mode
- Use interfaces for type safety
- Keep functions small and focused
- DRY principle - Don't Repeat Yourself

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Prisma Client not found | Run `npx prisma generate` |
| Port 3000 already in use | Kill process or use different port |
| Database connection error | Check `.env` and PostgreSQL status |
| JWT token not working | Verify `JWT_SECRET` in `.env` |
| Module import error | Check if module is in app.module.ts imports |
| Tests failing | Run `npm test` locally before pushing |

---

## Documentation Standards

### Code Comments
```typescript
/**
 * Finds a user by email address
 * @param email - The email address to search for
 * @returns Promise<User | null> - The user object or null if not found
 */
async findByEmail(email: string): Promise<User | null> {
  return this.prisma.users.findUnique({ where: { email } });
}
```

### API Documentation (Swagger)
```typescript
@Get(':id')
@ApiOperation({ summary: 'Get user by ID' })
@ApiParam({ name: 'id', description: 'User ID (UUID)' })
@ApiResponse({ status: 200, type: UserEntity })
@ApiResponse({ status: 404, description: 'User not found' })
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

### README Updates
- Update SETUP.md when adding new features
- Document breaking changes
- Keep deployment instructions current
- Add new environment variables to .env.example

---

## Resources

- **NestJS Best Practices**: https://docs.nestjs.com
- **Prisma Patterns**: https://www.prisma.io/docs/concepts
- **TypeScript Tips**: https://www.typescriptlang.org/docs
- **RESTful API Design**: https://restfulapi.net
- **JWT Security**: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html

---

**Last Updated**: June 1, 2026  
**Maintained By**: Development Team

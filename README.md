# 💒 Vivaah360 API

A comprehensive wedding planning platform API built with **NestJS**, **PostgreSQL**, and **Prisma**.

![NestJS](https://img.shields.io/badge/NestJS-10.0-red?style=flat-square&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2d3748?style=flat-square&logo=prisma)

## 🚀 Quick Start

### Prerequisites
- Node.js v20.3+
- PostgreSQL 12+
- npm v10+

### Setup (3 steps)

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

3. **Setup database & run**
```bash
npx prisma migrate dev --name init
npm run start:dev
```

✅ Server: `http://localhost:3000`  
📖 API docs: `http://localhost:3000/api-docs`

---

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # Users module
├── prisma/            # Database service
├── common/            # Shared utilities
├── config/            # Configuration
└── app.module.ts      # Root module
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **HOW_IT_WORKS.md** | System architecture, API flow, database schema |
| **DEVELOPMENT.md** | Setup, commands, development workflow |
| **.env.example** | Environment variables template |

---

## 🏃 Common Commands

```bash
npm run start:dev        # Development with hot-reload
npm run start:debug      # Debug mode
npm run build            # Production build
npm run lint             # Fix linting
npm run format           # Format code
npm test                 # Run tests

# Database
npx prisma studio       # Open database UI
npx prisma migrate dev --name name  # Create migration
```

See **DEVELOPMENT.md** for complete command reference.

---

## 🔐 Authentication

- JWT-based authentication
- Passport.js strategies
- Google OAuth social login
- Refresh token support with stored sessions
- Bearer token in Swagger

### Auth endpoints

- `GET /auth/google` - start Google OAuth login
- `GET /auth/google/callback` - Google OAuth redirect callback
- `GET /auth/me` - authenticated user profile
- `POST /auth/refresh` - refresh access token using `{ refreshToken }`
- `POST /auth/logout` - revoke refresh token using `{ refreshToken }`

### Required environment variables

- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `REFRESH_TOKEN_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`

Access API docs with token: `http://localhost:3000/api-docs`

---

## 📋 Current Status

- ✅ Project structure setup
- ✅ Auth & Users modules created
- ✅ Prisma database configured
- ✅ Swagger API documentation
- ✅ JWT authentication ready

**Branch**: feature/yash | **Repo**: https://github.com/yash10ch/vivaah360


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

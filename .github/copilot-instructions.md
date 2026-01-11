# House of Hilsha Backend - AI Coding Instructions

## Architecture Overview

This is a TypeScript/Express backend using **Better Auth** for authentication with MongoDB. Key architectural decision: Better Auth manages its own user/session tables, while we maintain a separate `UserProfile` model for extended app-specific data.

### Layer Structure

```
Routes → Controller → Service → Model/Better Auth
```

- **Controllers**: Request validation (Zod) and response formatting only - no business logic
- **Services**: All business logic, Better Auth API interactions
- **Models**: Mongoose schemas for app data; Better Auth manages auth tables separately

### Dual Auth Routes

Two auth route handlers exist by design:

- `/api/auth/*` - Better Auth internal routes (verification callbacks, tokens)
- `/auth/*` - Custom routes with our controller/service layer

## Code Patterns

### Adding New Features

Follow the heroSlider feature as a template:

1. **Model**: `src/models/{feature}.model.ts` - Mongoose schema with TypeScript interface
2. **Validator**: `src/validators/{feature}.schema.ts` - Zod schemas for create/update
3. **Service**: `src/services/{feature}.service.ts` - Static class methods, business logic
4. **Controller**: `src/controllers/{feature}.controller.ts` - Parse with `.parse()`, delegate to service
5. **Routes**: `src/routes/{feature}.routes.ts` - Apply middleware, bind controller methods

### Error Handling

Use `AppError` from `src/middlewares/error.middleware.ts`:

```typescript
throw new AppError("User not found", 404);
```

Global error handler catches all errors - never return errors directly from controllers.

### Validation Pattern

Always use Zod schemas in controllers:

```typescript
const payload = createSchema.parse(req.body); // Throws on invalid input
```

For auth routes, use `safeParse` with custom error messages.

### Protected Routes

Use `requireAuth` middleware - it attaches `req.user` and `req.session`:

```typescript
router.get("/profile", requireAuth, controller.getProfile.bind(controller));
```

### Response Format

All responses follow this structure:

```typescript
res.json({ success: true, data: {...}, message?: "..." });
```

## Better Auth Integration

- Config in `src/config/betterAuth.ts` - email templates, token expiry settings
- Use `auth.api.*` methods in services (e.g., `auth.api.signUpEmail`, `auth.api.signInEmail`)
- Session retrieval: `authService.getSession(req)`
- Email sending is fire-and-forget (`void sendEmail(...)`) to prevent timing attacks

## Commands

```bash
npm run dev      # Development with hot reload (tsx watch)
npm run build    # TypeScript compilation
npm start        # Production (runs compiled JS)
npm run typecheck # Type checking without emit
```

## Environment Requirements

Required in `.env`:

- `MONGODB_URI`, `BETTER_AUTH_SECRET` (min 32 chars)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- `FRONTEND_URL` (for CORS)

## File Import Convention

Use `.js` extensions in imports despite TypeScript source:

```typescript
import { auth } from "./config/betterAuth.js";
```

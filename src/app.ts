import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/betterAuth.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import siteInfoRoutes from "./routes/siteInfo.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { generalRateLimiter } from "./middlewares/rateLimiter.middleware.js";

/**
 * Express Application Setup
 */
export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // Body parsing
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Cookie parsing
  app.use(cookieParser());

  // Rate limiting
  app.use(generalRateLimiter);

  // Trust proxy for rate limiting behind reverse proxy
  app.set("trust proxy", 1);

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  });

  // Root endpoint
  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "House of Hilsha API",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        auth: "/auth/*",
        docs: "See README.md for API documentation",
      },
    });
  });

  // Better Auth handler - handles internal auth routes
  // This must be before our custom routes to handle verification callbacks
  app.all("/api/auth/*", toNodeHandler(auth));

  // Custom auth routes
  app.use("/auth", authRoutes);

  // About page routes
  app.use("/about", aboutRoutes);

  // Site info routes
  app.use("/site-info", siteInfoRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}

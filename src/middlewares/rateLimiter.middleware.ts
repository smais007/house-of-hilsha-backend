import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

/**
 * Rate Limiter Middleware
 * Protects against brute force attacks
 */

/**
 * General API rate limiter
 * Limits requests per window for all endpoints
 */
export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes by default
  max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests per window
  message: {
    success: false,
    status: "fail",
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, res, _next, options) => {
    res.status(429).json(options.message);
  },
});

/**
 * Auth-specific rate limiter
 * Stricter limits for authentication endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: env.AUTH_RATE_LIMIT_MAX, // 10 attempts per window
  message: {
    success: false,
    status: "fail",
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res, _next, options) => {
    res.status(429).json(options.message);
  },
  // Skip successful requests for rate limiting
  skipSuccessfulRequests: false,
  // Key generator - uses IP address
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
  },
});

/**
 * Password reset rate limiter
 * Very strict to prevent abuse
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    success: false,
    status: "fail",
    message: "Too many password reset attempts, please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res, _next, options) => {
    res.status(429).json(options.message);
  },
});

/**
 * Email verification rate limiter
 */
export const emailVerificationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: {
    success: false,
    status: "fail",
    message:
      "Too many verification email requests, please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res, _next, options) => {
    res.status(429).json(options.message);
  },
});

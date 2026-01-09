import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { auth } from "../config/betterAuth.js";
import { toNodeHandler } from "better-auth/node";

const router = Router();

/**
 * Auth Routes
 *
 * All authentication endpoints.
 * Rate limiting applied to prevent brute force attacks.
 */

// Better Auth handler for internal routes (email verification, etc.)
// This handles routes like /auth/verify-email with token validation
router.all("/api/auth/*", toNodeHandler(auth));

// Custom routes with our controller layer

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/signup",
  authRateLimiter,
  authController.signup.bind(authController)
);

/**
 * @route   POST /auth/login
 * @desc    Authenticate user and get session
 * @access  Public
 */
router.post(
  "/login",
  authRateLimiter,
  authController.login.bind(authController)
);

/**
 * @route   POST /auth/logout
 * @desc    Sign out user and invalidate session
 * @access  Private
 */
router.post("/logout", authController.logout.bind(authController));

/**
 * @route   POST /auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post(
  "/forgot-password",
  authRateLimiter,
  authController.forgotPassword.bind(authController)
);

/**
 * @route   POST /auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post(
  "/reset-password",
  authRateLimiter,
  authController.resetPassword.bind(authController)
);

/**
 * @route   POST /auth/change-password
 * @desc    Change password for authenticated user
 * @access  Private
 */
router.post(
  "/change-password",
  authController.changePassword.bind(authController)
);

/**
 * @route   POST /auth/send-verification-email
 * @desc    Resend verification email
 * @access  Public
 */
router.post(
  "/send-verification-email",
  authRateLimiter,
  authController.sendVerificationEmail.bind(authController)
);

/**
 * @route   GET /auth/session
 * @desc    Get current session
 * @access  Public (returns null if not authenticated)
 */
router.get("/session", authController.getSession.bind(authController));

/**
 * @route   GET /auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get("/profile", authController.getProfile.bind(authController));

export default router;

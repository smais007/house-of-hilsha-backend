import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  sendVerificationEmailSchema,
} from "../utils/validation.js";
import { AppError } from "../middlewares/error.middleware.js";

/**
 * Auth Controller
 *
 * Orchestrates authentication requests.
 * Contains no business logic - delegates to AuthService.
 * Handles request/response transformation and validation.
 */

class AuthController {
  /**
   * POST /auth/signup
   * Register a new user
   */
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const validationResult = signupSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
          validationResult.error.errors[0]?.message || "Invalid input",
          400
        );
      }

      const { email, password, name } = validationResult.data;

      // Delegate to service
      const result = await authService.signup({ email, password, name });

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            emailVerified: result.user.emailVerified,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   * Authenticate user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
          validationResult.error.errors[0]?.message || "Invalid input",
          400
        );
      }

      const { email, password, rememberMe } = validationResult.data;

      // Delegate to service
      const result = await authService.login(
        { email, password, rememberMe },
        req
      );

      // Set session cookie if Better Auth hasn't already
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: result.user?.id,
            email: result.user?.email,
            name: result.user?.name,
            emailVerified: result.user?.emailVerified,
          },
          session: result.session
            ? {
                id: result.session.id,
                expiresAt: result.session.expiresAt,
              }
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Sign out user
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.logout(req);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/forgot-password
   * Request password reset email
   */
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate input
      const validationResult = forgotPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
          validationResult.error.errors[0]?.message || "Invalid input",
          400
        );
      }

      const { email, redirectTo } = validationResult.data;

      // Delegate to service
      const result = await authService.requestPasswordReset(email, redirectTo);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/reset-password
   * Reset password using token
   */
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate input
      const validationResult = resetPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
          validationResult.error.errors[0]?.message || "Invalid input",
          400
        );
      }

      const { token, newPassword } = validationResult.data;

      // Delegate to service
      const result = await authService.resetPassword({ token, newPassword });

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/change-password
   * Change password for authenticated user
   */
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate input
      const validationResult = changePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
          validationResult.error.errors[0]?.message || "Invalid input",
          400
        );
      }

      const { currentPassword, newPassword, revokeOtherSessions } =
        validationResult.data;

      // Delegate to service
      const result = await authService.changePassword(
        { currentPassword, newPassword, revokeOtherSessions },
        req
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/send-verification-email
   * Resend verification email
   */
  async sendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate input
      const validationResult = sendVerificationEmailSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
          validationResult.error.errors[0]?.message || "Invalid input",
          400
        );
      }

      const { email, callbackURL } = validationResult.data;

      // Delegate to service
      const result = await authService.sendVerificationEmail(
        email,
        callbackURL
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/session
   * Get current session
   */
  async getSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const session = await authService.getSession(req);

      if (!session) {
        res.status(200).json({
          success: true,
          data: {
            authenticated: false,
            user: null,
            session: null,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          authenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            emailVerified: session.user.emailVerified,
            image: session.user.image,
          },
          session: {
            id: session.session.id,
            expiresAt: session.session.expiresAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/profile
   * Get user profile
   */
  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const session = await authService.getSession(req);

      if (!session) {
        throw new AppError("Unauthorized", 401);
      }

      const profile = await authService.getUserProfile(session.user.id);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            emailVerified: session.user.emailVerified,
          },
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const authController = new AuthController();

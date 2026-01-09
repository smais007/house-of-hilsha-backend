import { auth, type Session, type User } from "../config/betterAuth.js";
import { UserProfile } from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import type { Request } from "express";

/**
 * Auth Service
 *
 * Handles all authentication logic using Better Auth.
 * This service wraps Better Auth methods to provide a clean interface
 * and adds any additional business logic needed.
 */

// Signup data interface
export interface SignupData {
  email: string;
  password: string;
  name: string;
}

// Login data interface
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Password reset data interface
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// Change password data interface
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}

class AuthService {
  /**
   * Sign up a new user with email and password
   * Better Auth handles password hashing and token generation
   */
  async signup(data: SignupData): Promise<{ user: User; message: string }> {
    try {
      // Use Better Auth to create user
      const result = await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
        },
      });

      if (!result || !result.user) {
        throw new AppError("Failed to create user account", 500);
      }

      // Create user profile in our database for extended data
      await UserProfile.create({
        authUserId: result.user.id,
        email: data.email,
        displayName: data.name,
        preferences: {
          notifications: true,
          newsletter: false,
          theme: "system",
        },
        metadata: {
          loginCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        user: result.user,
        message:
          "Account created successfully. Please check your email to verify your account.",
      };
    } catch (error: any) {
      // Handle specific Better Auth errors
      if (error.message?.includes("already exists")) {
        throw new AppError("An account with this email already exists", 409);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error.message || "Failed to create account",
        error.status || 500
      );
    }
  }

  /**
   * Sign in a user with email and password
   * Better Auth handles password verification and session creation
   */
  async login(
    data: LoginData,
    request: Request
  ): Promise<{ session: any; user: any }> {
    try {
      // Convert Express request headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const result = await auth.api.signInEmail({
        body: {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe ?? true,
        },
        headers,
      });

      console.log("Login result:", JSON.stringify(result, null, 2));

      if (!result || !result.user) {
        throw new AppError("Invalid email or password", 401);
      }

      // Update user profile login metadata
      await UserProfile.findOneAndUpdate(
        { authUserId: result.user.id },
        {
          $set: { "metadata.lastLogin": new Date() },
          $inc: { "metadata.loginCount": 1 },
        }
      );

      // Better Auth returns 'token' not 'session' object
      return {
        session: {
          token: result.token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        user: result.user,
      };
    } catch (error: any) {
      // Handle unverified email error
      if (error.status === 403 || error.message?.includes("verify")) {
        throw new AppError(
          "Please verify your email address before signing in",
          403
        );
      }
      if (error.message?.includes("Invalid") || error.status === 401) {
        throw new AppError("Invalid email or password", 401);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || "Login failed", error.status || 500);
    }
  }

  /**
   * Sign out the current user
   * Invalidates the session
   */
  async logout(request: Request): Promise<{ success: boolean }> {
    try {
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      await auth.api.signOut({
        headers,
      });

      return { success: true };
    } catch (error: any) {
      throw new AppError(error.message || "Logout failed", error.status || 500);
    }
  }

  /**
   * Request password reset email
   * Better Auth generates and sends the reset token
   */
  async requestPasswordReset(
    email: string,
    redirectTo?: string
  ): Promise<{ message: string }> {
    try {
      console.log("Requesting password reset for:", email);

      // Use the correct Better Auth server API method (requestPasswordReset, not forgetPassword)
      const result = await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo:
            redirectTo || `${process.env.FRONTEND_URL}/reset-password`,
        },
      });

      console.log("Password reset result:", result);

      // Always return success message to prevent email enumeration
      return {
        message:
          "If an account with that email exists, we sent a password reset link.",
      };
    } catch (error: any) {
      console.log("Password reset error:", error);
      // Don't reveal if email exists - always return success message
      return {
        message:
          "If an account with that email exists, we sent a password reset link.",
      };
    }
  }

  /**
   * Reset password using token
   * Better Auth validates the token and updates the password
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      await auth.api.resetPassword({
        body: {
          token: data.token,
          newPassword: data.newPassword,
        },
      });

      return { message: "Password reset successfully. You can now sign in." };
    } catch (error: any) {
      if (
        error.message?.includes("expired") ||
        error.message?.includes("invalid")
      ) {
        throw new AppError(
          "Password reset link has expired or is invalid. Please request a new one.",
          400
        );
      }
      throw new AppError(
        error.message || "Failed to reset password",
        error.status || 500
      );
    }
  }

  /**
   * Change password for authenticated user
   * Better Auth validates current password and updates to new one
   */
  async changePassword(
    data: ChangePasswordData,
    request: Request
  ): Promise<{ message: string }> {
    try {
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      await auth.api.changePassword({
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: data.revokeOtherSessions ?? true,
        },
        headers,
      });

      return { message: "Password changed successfully." };
    } catch (error: any) {
      if (error.message?.includes("incorrect")) {
        throw new AppError("Current password is incorrect", 400);
      }
      throw new AppError(
        error.message || "Failed to change password",
        error.status || 500
      );
    }
  }

  /**
   * Send email verification link
   * Triggers Better Auth to send verification email
   */
  async sendVerificationEmail(
    email: string,
    callbackURL?: string
  ): Promise<{ message: string }> {
    try {
      await auth.api.sendVerificationEmail({
        body: {
          email,
          callbackURL:
            callbackURL || `${process.env.FRONTEND_URL}/verify-email`,
        },
      });

      return { message: "Verification email sent. Please check your inbox." };
    } catch (error: any) {
      throw new AppError(
        error.message || "Failed to send verification email",
        error.status || 500
      );
    }
  }

  /**
   * Get current session
   * Returns the authenticated user's session data
   */
  async getSession(request: Request): Promise<Session | null> {
    try {
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const session = await auth.api.getSession({
        headers,
      });

      return session;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get user profile from our database
   */
  async getUserProfile(authUserId: string) {
    return UserProfile.findOne({ authUserId });
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    authUserId: string,
    updates: Partial<{
      displayName: string;
      bio: string;
      avatar: string;
      preferences: {
        notifications?: boolean;
        newsletter?: boolean;
        theme?: "light" | "dark" | "system";
      };
    }>
  ) {
    return UserProfile.findOneAndUpdate(
      { authUserId },
      { $set: updates },
      { new: true }
    );
  }
}

// Export singleton instance
export const authService = new AuthService();

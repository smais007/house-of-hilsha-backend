import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { AppError } from "./error.middleware.js";

/**
 * Auth Middleware
 * Protects routes that require authentication
 */

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;
        image?: string;
      };
      session?: {
        id: string;
        expiresAt: Date;
      };
    }
  }
}

/**
 * Require Authentication Middleware
 * Blocks access if user is not authenticated
 */
export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await authService.getSession(req);

    if (!session) {
      throw new AppError("Unauthorized - Please sign in to continue", 401);
    }

    // Attach user and session to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      image: session.user.image,
    };
    req.session = {
      id: session.session.id,
      expiresAt: session.session.expiresAt,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require Email Verified Middleware
 * Blocks access if user's email is not verified
 * Must be used after requireAuth
 */
export async function requireEmailVerified(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized - Please sign in to continue", 401);
    }

    if (!req.user.emailVerified) {
      throw new AppError(
        "Please verify your email address to access this resource",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional Auth Middleware
 * Attaches user to request if authenticated, but doesn't block
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await authService.getSession(req);

    if (session) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
      };
      req.session = {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      };
    }

    next();
  } catch (error) {
    // Don't throw error, just continue without user
    next();
  }
}

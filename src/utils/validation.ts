import { z } from "zod";

/**
 * Validation Schemas
 * Using Zod for type-safe input validation
 */

/**
 * Password validation rules
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must not exceed 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
  );

/**
 * Email validation
 */
const emailSchema = z
  .string()
  .email("Please provide a valid email address")
  .toLowerCase()
  .trim();

/**
 * Name validation
 */
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name must not exceed 100 characters")
  .trim();

/**
 * Signup Schema
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(true),
});

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
  redirectTo: z.string().url().optional(),
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: passwordSchema,
});

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  revokeOtherSessions: z.boolean().optional().default(true),
});

/**
 * Send Verification Email Schema
 */
export const sendVerificationEmailSchema = z.object({
  email: emailSchema,
  callbackURL: z.string().url().optional(),
});

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
  displayName: nameSchema.optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  preferences: z
    .object({
      notifications: z.boolean().optional(),
      newsletter: z.boolean().optional(),
      theme: z.enum(["light", "dark", "system"]).optional(),
    })
    .optional(),
});

// Export types
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SendVerificationEmailInput = z.infer<
  typeof sendVerificationEmailSchema
>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

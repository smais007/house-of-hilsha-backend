import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendEmail } from "../utils/email.js";

// MongoDB client for Better Auth
const mongoClient = new MongoClient(process.env.MONGODB_URI!);

export const auth = betterAuth({
  // Database configuration using MongoDB adapter
  database: mongodbAdapter(mongoClient.db()),

  // Base URL for auth endpoints
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  // Secret key for signing tokens and cookies
  secret: process.env.BETTER_AUTH_SECRET!,

  // Trusted origins for CORS
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],

  // Email and password authentication configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    // Password reset token expiration (default: 1 hour)
    resetPasswordTokenExpiresIn: parseInt(
      process.env.PASSWORD_RESET_EXPIRY || "3600"
    ),

    // Send password reset email
    sendResetPassword: async ({ user, url, token }, request) => {
      // Don't await to prevent timing attacks
      void sendEmail({
        to: user.email,
        subject: "Reset Your Password - House of Hilsha",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Password Reset Request</h1>
            <p>Hello ${user.name || "there"},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent by House of Hilsha. Please do not reply to this email.
            </p>
          </div>
        `,
        text: `Reset your password by visiting: ${url}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`,
      });
    },

    // Callback after password is reset
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password reset completed for user: ${user.email}`);
    },
  },

  // Email verification configuration
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: parseInt(process.env.EMAIL_VERIFICATION_EXPIRY || "86400"), // 24 hours

    // Send verification email
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Don't await to prevent timing attacks
      void sendEmail({
        to: user.email,
        subject: "Verify Your Email - House of Hilsha",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to House of Hilsha!</h1>
            <p>Hello ${user.name || "there"},</p>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent by House of Hilsha. Please do not reply to this email.
            </p>
          </div>
        `,
        text: `Welcome to House of Hilsha!\n\nPlease verify your email by visiting: ${url}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.`,
      });
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Advanced configuration
  advanced: {
    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === "production",

    // Cookie configuration
    cookiePrefix: "hoh_auth",

    // Generate session token
    generateId: () => {
      return crypto.randomUUID();
    },
  },

  // Account configuration
  account: {
    accountLinking: {
      enabled: false, // Only email-password for now
    },
  },

  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // Don't allow setting via API
      },
    },
  },
});

// Export auth types for use in other files
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

// Connect to MongoDB for Better Auth
export async function connectAuthDatabase(): Promise<void> {
  try {
    await mongoClient.connect();
    console.log("✅ Better Auth connected to MongoDB");
  } catch (error) {
    console.error("❌ Better Auth MongoDB connection failed:", error);
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectAuthDatabase(): Promise<void> {
  try {
    await mongoClient.close();
    console.log("🔌 Better Auth disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting Better Auth from MongoDB:", error);
  }
}

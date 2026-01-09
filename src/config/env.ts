import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

// Environment validation schema
interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASS: string;
  EMAIL_FROM: string;
  EMAIL_VERIFICATION_EXPIRY: number;
  PASSWORD_RESET_EXPIRY: number;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  AUTH_RATE_LIMIT_MAX: number;
}

function validateEnv(): EnvConfig {
  const requiredVars = [
    "MONGODB_URI",
    "BETTER_AUTH_SECRET",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // Validate BETTER_AUTH_SECRET length
  if (process.env.BETTER_AUTH_SECRET!.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters long");
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    MONGODB_URI: process.env.MONGODB_URI!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
    SMTP_SECURE: process.env.SMTP_SECURE === "true",
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
    EMAIL_FROM: process.env.EMAIL_FROM || "noreply@houseofhilsha.com",
    EMAIL_VERIFICATION_EXPIRY: parseInt(
      process.env.EMAIL_VERIFICATION_EXPIRY || "86400",
      10
    ),
    PASSWORD_RESET_EXPIRY: parseInt(
      process.env.PASSWORD_RESET_EXPIRY || "3600",
      10
    ),
    RATE_LIMIT_WINDOW_MS: parseInt(
      process.env.RATE_LIMIT_WINDOW_MS || "900000",
      10
    ),
    RATE_LIMIT_MAX_REQUESTS: parseInt(
      process.env.RATE_LIMIT_MAX_REQUESTS || "100",
      10
    ),
    AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "10", 10),
  };
}

export const env = validateEnv();

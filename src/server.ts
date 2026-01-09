import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import {
  connectAuthDatabase,
  disconnectAuthDatabase,
} from "./config/betterAuth.js";
import { verifyEmailTransporter } from "./utils/email.js";

/**
 * Server Entry Point
 * Initializes database connections and starts the HTTP server
 */

const app = createApp();

async function startServer(): Promise<void> {
  try {
    console.log("🚀 Starting House of Hilsha Backend...\n");

    // Connect to MongoDB (Mongoose for app data)
    await connectDatabase();

    // Connect to MongoDB (Better Auth)
    await connectAuthDatabase();

    // Verify email transporter
    await verifyEmailTransporter();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      console.log(`\n✨ Server running on http://localhost:${env.PORT}`);
      console.log(`📚 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}\n`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log("HTTP server closed");

        await disconnectDatabase();
        await disconnectAuthDatabase();

        console.log("All connections closed");
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error("Forcing shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: Error) => {
      console.error("Unhandled Rejection:", reason);
      // Don't exit, let the error handler deal with it
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

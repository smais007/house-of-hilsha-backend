import mongoose from "mongoose";
import { env } from "./env.js";

// MongoDB connection options
const mongooseOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB using Mongoose (for application data)
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, mongooseOptions);
    console.log("✅ Mongoose connected to MongoDB");
  } catch (error) {
    console.error("❌ Mongoose MongoDB connection failed:", error);
    throw error;
  }
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("📦 Mongoose connected to database");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose disconnected from database");
});

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    console.log("🔌 Mongoose connection closed");
  } catch (error) {
    console.error("❌ Error closing Mongoose connection:", error);
  }
}

export { mongoose };

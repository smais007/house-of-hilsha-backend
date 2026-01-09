import { Schema, model, Document } from "mongoose";

/**
 * User Model
 *
 * Note: Better Auth manages its own user and session tables in MongoDB.
 * This model is for any additional user-related data your application needs.
 * Better Auth stores: user, session, account, verification tables.
 *
 * This model can be used to extend user data or for application-specific queries.
 */

export interface IUserProfile extends Document {
  authUserId: string; // Reference to Better Auth user ID
  email: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    theme: "light" | "dark" | "system";
  };
  metadata: {
    lastLogin?: Date;
    loginCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    metadata: {
      lastLogin: {
        type: Date,
      },
      loginCount: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    collection: "user_profiles",
  }
);

// Update the updatedAt timestamp before saving
userProfileSchema.pre("save", function (next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Note: Indexes are already created via schema field options (unique: true, index: true)
// No need for additional index() calls

export const UserProfile = model<IUserProfile>(
  "UserProfile",
  userProfileSchema
);

// Export type for Better Auth user (reference only)
export interface BetterAuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

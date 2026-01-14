import { About, type IAbout } from "../models/about.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import type {
  CreateAboutInput,
  UpdateAboutInput,
} from "../validators/about.schema.js";

/**
 * About Service
 * Handles all business logic for about page content
 */
export class AboutService {
  /**
   * Get about page data
   * Returns the single about document (there should only be one)
   */
  static async getAbout(): Promise<IAbout | null> {
    const about = await About.findOne().lean();
    return about as IAbout | null;
  }

  /**
   * Create about page data
   * Only creates if no about document exists
   */
  static async createAbout(data: CreateAboutInput): Promise<IAbout> {
    // Check if about data already exists
    const existingAbout = await About.findOne();

    if (existingAbout) {
      throw new AppError("About data already exists. Use update instead.", 400);
    }

    const about = await About.create(data);
    return about;
  }

  /**
   * Update about page data
   * Updates the single about document
   */
  static async updateAbout(data: UpdateAboutInput): Promise<IAbout> {
    const about = await About.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    });

    if (!about) {
      throw new AppError("About data not found", 404);
    }

    return about;
  }

  /**
   * Delete about page data
   * Removes the about document
   */
  static async deleteAbout(): Promise<void> {
    const result = await About.findOneAndDelete();

    if (!result) {
      throw new AppError("About data not found", 404);
    }
  }

  /**
   * Upsert about page data
   * Creates if not exists, updates if exists
   */
  static async upsertAbout(data: CreateAboutInput): Promise<IAbout> {
    const about = await About.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return about;
  }
}

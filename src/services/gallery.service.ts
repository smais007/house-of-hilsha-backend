import { Gallery, type IGallery } from "../models/gallery.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
} from "../validators/gallery.schema.js";

/**
 * Gallery Service
 * Handles all business logic for gallery content
 */
export class GalleryService {
  /**
   * Get gallery data
   * Returns the single gallery document (there should only be one)
   */
  static async getGallery(): Promise<IGallery | null> {
    const gallery = await Gallery.findOne().lean();
    return gallery as IGallery | null;
  }

  /**
   * Create gallery data
   * Only creates if no gallery document exists
   */
  static async createGallery(data: CreateGalleryInput): Promise<IGallery> {
    // Check if gallery already exists
    const existingGallery = await Gallery.findOne();

    if (existingGallery) {
      throw new AppError("Gallery already exists. Use update instead.", 400);
    }

    const gallery = await Gallery.create(data);
    return gallery;
  }

  /**
   * Update gallery data
   * Updates the single gallery document
   */
  static async updateGallery(data: UpdateGalleryInput): Promise<IGallery> {
    const gallery = await Gallery.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    });

    if (!gallery) {
      throw new AppError("Gallery not found", 404);
    }

    return gallery;
  }

  /**
   * Delete gallery data
   * Removes the gallery document
   */
  static async deleteGallery(): Promise<void> {
    const result = await Gallery.findOneAndDelete();

    if (!result) {
      throw new AppError("Gallery not found", 404);
    }
  }

  /**
   * Upsert gallery data
   * Creates if not exists, updates if exists
   */
  static async upsertGallery(data: CreateGalleryInput): Promise<IGallery> {
    const gallery = await Gallery.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return gallery;
  }
}

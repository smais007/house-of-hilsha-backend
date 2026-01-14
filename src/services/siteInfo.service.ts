import { SiteInfo, type ISiteInfo } from "../models/siteInfo.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import type {
  CreateSiteInfoInput,
  UpdateSiteInfoInput,
} from "../validators/siteInfo.schema.js";

/**
 * Site Info Service
 * Handles all business logic for site information
 */
export class SiteInfoService {
  /**
   * Get site info data
   * Returns the single site info document (there should only be one)
   */
  static async getSiteInfo(): Promise<ISiteInfo | null> {
    const siteInfo = await SiteInfo.findOne().lean();
    return siteInfo as ISiteInfo | null;
  }

  /**
   * Create site info data
   * Only creates if no site info document exists
   */
  static async createSiteInfo(data: CreateSiteInfoInput): Promise<ISiteInfo> {
    // Check if site info already exists
    const existingSiteInfo = await SiteInfo.findOne();

    if (existingSiteInfo) {
      throw new AppError("Site info already exists. Use update instead.", 400);
    }

    const siteInfo = await SiteInfo.create(data);
    return siteInfo;
  }

  /**
   * Update site info data
   * Updates the single site info document
   */
  static async updateSiteInfo(data: UpdateSiteInfoInput): Promise<ISiteInfo> {
    const siteInfo = await SiteInfo.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    });

    if (!siteInfo) {
      throw new AppError("Site info not found", 404);
    }

    return siteInfo;
  }

  /**
   * Delete site info data
   * Removes the site info document
   */
  static async deleteSiteInfo(): Promise<void> {
    const result = await SiteInfo.findOneAndDelete();

    if (!result) {
      throw new AppError("Site info not found", 404);
    }
  }

  /**
   * Upsert site info data
   * Creates if not exists, updates if exists
   */
  static async upsertSiteInfo(data: CreateSiteInfoInput): Promise<ISiteInfo> {
    const siteInfo = await SiteInfo.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return siteInfo;
  }
}

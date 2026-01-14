import type { Request, Response, NextFunction } from "express";
import { SiteInfoService } from "../services/siteInfo.service.js";
import {
  createSiteInfoSchema,
  updateSiteInfoSchema,
} from "../validators/siteInfo.schema.js";

/**
 * Site Info Controller
 * Handles HTTP requests for site information
 */
export class SiteInfoController {
  /**
   * GET /site-info
   * Get site info - accessible to all
   */
  async getSiteInfo(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const siteInfo = await SiteInfoService.getSiteInfo();

      if (!siteInfo) {
        res.status(404).json({
          success: false,
          message: "Site info not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: siteInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /site-info
   * Create site info - admin only
   */
  async createSiteInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createSiteInfoSchema.parse(req.body);
      const siteInfo = await SiteInfoService.createSiteInfo(payload);

      res.status(201).json({
        success: true,
        message: "Site info created successfully",
        data: siteInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /site-info
   * Update site info - admin only
   */
  async updateSiteInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = updateSiteInfoSchema.parse(req.body);
      const siteInfo = await SiteInfoService.updateSiteInfo(payload);

      res.status(200).json({
        success: true,
        message: "Site info updated successfully",
        data: siteInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /site-info
   * Delete site info - admin only
   */
  async deleteSiteInfo(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await SiteInfoService.deleteSiteInfo();

      res.status(200).json({
        success: true,
        message: "Site info deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /site-info/upsert
   * Create or update site info - admin only
   */
  async upsertSiteInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createSiteInfoSchema.parse(req.body);
      const siteInfo = await SiteInfoService.upsertSiteInfo(payload);

      res.status(200).json({
        success: true,
        message: "Site info saved successfully",
        data: siteInfo,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const siteInfoController = new SiteInfoController();

import type { Request, Response, NextFunction } from "express";
import { AboutService } from "../services/about.service.js";
import {
  createAboutSchema,
  updateAboutSchema,
} from "../validators/about.schema.js";

/**
 * About Controller
 * Handles HTTP requests for about page content
 */
export class AboutController {
  /**
   * GET /about
   * Get about page data - accessible to all
   */
  async getAbout(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const about = await AboutService.getAbout();

      if (!about) {
        res.status(404).json({
          success: false,
          message: "About data not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /about
   * Create about page data - admin only
   */
  async createAbout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createAboutSchema.parse(req.body);
      const about = await AboutService.createAbout(payload);

      res.status(201).json({
        success: true,
        message: "About data created successfully",
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /about
   * Update about page data - admin only
   */
  async updateAbout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = updateAboutSchema.parse(req.body);
      const about = await AboutService.updateAbout(payload);

      res.status(200).json({
        success: true,
        message: "About data updated successfully",
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /about
   * Delete about page data - admin only
   */
  async deleteAbout(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await AboutService.deleteAbout();

      res.status(200).json({
        success: true,
        message: "About data deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /about/upsert
   * Create or update about page data - admin only
   */
  async upsertAbout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createAboutSchema.parse(req.body);
      const about = await AboutService.upsertAbout(payload);

      res.status(200).json({
        success: true,
        message: "About data saved successfully",
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aboutController = new AboutController();

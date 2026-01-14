import type { Request, Response, NextFunction } from "express";
import { GalleryService } from "../services/gallery.service.js";
import {
  createGallerySchema,
  updateGallerySchema,
} from "../validators/gallery.schema.js";

/**
 * Gallery Controller
 * Handles HTTP requests for gallery content
 */
export class GalleryController {
  /**
   * GET /gallery
   * Get gallery data - accessible to all
   */
  async getGallery(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const gallery = await GalleryService.getGallery();

      if (!gallery) {
        res.status(404).json({
          success: false,
          message: "Gallery not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /gallery
   * Create gallery data - admin only
   */
  async createGallery(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createGallerySchema.parse(req.body);
      const gallery = await GalleryService.createGallery(payload);

      res.status(201).json({
        success: true,
        message: "Gallery created successfully",
        data: gallery,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /gallery
   * Update gallery data - admin only
   */
  async updateGallery(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = updateGallerySchema.parse(req.body);
      const gallery = await GalleryService.updateGallery(payload);

      res.status(200).json({
        success: true,
        message: "Gallery updated successfully",
        data: gallery,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /gallery
   * Delete gallery data - admin only
   */
  async deleteGallery(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await GalleryService.deleteGallery();

      res.status(200).json({
        success: true,
        message: "Gallery deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /gallery/upsert
   * Create or update gallery data - admin only
   */
  async upsertGallery(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createGallerySchema.parse(req.body);
      const gallery = await GalleryService.upsertGallery(payload);

      res.status(200).json({
        success: true,
        message: "Gallery saved successfully",
        data: gallery,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const galleryController = new GalleryController();

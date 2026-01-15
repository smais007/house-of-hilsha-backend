import type { Request, Response, NextFunction } from "express";
import { SpecialOffersService } from "../services/specialOffers.service.js";
import {
  createSpecialOffersSchema,
  updateSpecialOffersSchema,
} from "../validators/specialOffers.schema.js";

/**
 * Special Offers Controller
 * Handles HTTP requests for special offers content
 */
export class SpecialOffersController {
  /**
   * GET /special-offers
   */
  async getSpecialOffers(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const specialOffers = await SpecialOffersService.getSpecialOffers();

      if (!specialOffers) {
        res.status(404).json({
          success: false,
          message: "Special offers not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: specialOffers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /special-offers
   */
  async createSpecialOffers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createSpecialOffersSchema.parse(req.body);
      const specialOffers = await SpecialOffersService.createSpecialOffers(
        payload
      );

      res.status(201).json({
        success: true,
        message: "Special offers created successfully",
        data: specialOffers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /special-offers
   */
  async updateSpecialOffers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = updateSpecialOffersSchema.parse(req.body);
      const specialOffers = await SpecialOffersService.updateSpecialOffers(
        payload
      );

      res.status(200).json({
        success: true,
        message: "Special offers updated successfully",
        data: specialOffers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /special-offers
   */
  async deleteSpecialOffers(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await SpecialOffersService.deleteSpecialOffers();

      res.status(200).json({
        success: true,
        message: "Special offers deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /special-offers/upsert
   */
  async upsertSpecialOffers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = createSpecialOffersSchema.parse(req.body);
      const specialOffers = await SpecialOffersService.upsertSpecialOffers(
        payload
      );

      res.status(200).json({
        success: true,
        message: "Special offers saved successfully",
        data: specialOffers,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const specialOffersController = new SpecialOffersController();

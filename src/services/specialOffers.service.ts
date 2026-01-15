import {
  SpecialOffers,
  type ISpecialOffers,
} from "../models/specialOffers.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import type {
  CreateSpecialOffersInput,
  UpdateSpecialOffersInput,
} from "../validators/specialOffers.schema.js";

/**
 * Special Offers Service
 * Handles all business logic for special offers content
 */
export class SpecialOffersService {
  /**
   * Get special offers data
   */
  static async getSpecialOffers(): Promise<ISpecialOffers | null> {
    const specialOffers = await SpecialOffers.findOne().lean();
    return specialOffers as ISpecialOffers | null;
  }

  /**
   * Create special offers data
   */
  static async createSpecialOffers(
    data: CreateSpecialOffersInput
  ): Promise<ISpecialOffers> {
    const existing = await SpecialOffers.findOne();

    if (existing) {
      throw new AppError(
        "Special offers already exists. Use update instead.",
        400
      );
    }

    const specialOffers = await SpecialOffers.create(data);
    return specialOffers;
  }

  /**
   * Update special offers data
   */
  static async updateSpecialOffers(
    data: UpdateSpecialOffersInput
  ): Promise<ISpecialOffers> {
    const specialOffers = await SpecialOffers.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    });

    if (!specialOffers) {
      throw new AppError("Special offers not found", 404);
    }

    return specialOffers;
  }

  /**
   * Delete special offers data
   */
  static async deleteSpecialOffers(): Promise<void> {
    const result = await SpecialOffers.findOneAndDelete();

    if (!result) {
      throw new AppError("Special offers not found", 404);
    }
  }

  /**
   * Upsert special offers data
   */
  static async upsertSpecialOffers(
    data: CreateSpecialOffersInput
  ): Promise<ISpecialOffers> {
    const specialOffers = await SpecialOffers.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return specialOffers;
  }
}

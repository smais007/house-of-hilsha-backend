import { Request, Response } from "express";
import { HeroSliderService } from "../services/heroSlider.service";
import {
  createHeroSliderSchema,
  updateHeroSliderSchema,
} from "../validators/heroSlider.schema";

export class HeroSliderController {
  static async getPublicSliders(req: Request, res: Response) {
    const sliders = await HeroSliderService.getActiveSliders();
    res.json({ success: true, data: sliders });
  }

  static async createSlider(req: Request, res: Response) {
    const payload = createHeroSliderSchema.parse(req.body);
    const slider = await HeroSliderService.createSlider(payload);

    res.status(201).json({
      success: true,
      data: slider,
      message: "Slider created successfully",
    });
  }

  static async updateSlider(req: Request, res: Response) {
    const payload = updateHeroSliderSchema.parse(req.body);
    const slider = await HeroSliderService.updateSlider(req.params.id, payload);

    res.json({
      success: true,
      data: slider,
      message: "Slider updated successfully",
    });
  }

  static async deleteSlider(req: Request, res: Response) {
    const slider = await HeroSliderService.softDeleteSlider(req.params.id);

    res.json({
      success: true,
      data: slider,
      message: "Slider deactivated successfully",
    });
  }
}

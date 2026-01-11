import { HeroSlider } from "../models/heroSlider.model";
import { Types } from "mongoose";

export class HeroSliderService {
  static async getActiveSliders() {
    return HeroSlider.find({ isActive: true }).sort({ order: 1 });
  }

  static async createSlider(data: any) {
    return HeroSlider.create(data);
  }

  static async updateSlider(id: string, data: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid slider ID");
    }

    const slider = await HeroSlider.findByIdAndUpdate(id, data, { new: true });

    if (!slider) {
      throw new Error("Slider not found");
    }

    return slider;
  }

  static async softDeleteSlider(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid slider ID");
    }

    const slider = await HeroSlider.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!slider) {
      throw new Error("Slider not found");
    }

    return slider;
  }
}

import { Schema, model, Document } from "mongoose";

export interface HeroSliderDocument extends Document {
  image: string;
  altText: string;
  subtitle: string;
  title: string;
  desc: string;
  link: string;
  textLink: string;
  isActive: boolean;
  order: number;
}

const heroSliderSchema = new Schema<HeroSliderDocument>(
  {
    image: { type: String, required: true },
    altText: { type: String, required: true },
    subtitle: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    link: { type: String, required: true },
    textLink: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export const HeroSlider = model<HeroSliderDocument>(
  "HeroSlider",
  heroSliderSchema
);

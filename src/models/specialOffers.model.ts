import { Schema, model, Document } from "mongoose";

/**
 * Special Offers Model
 * Stores special offers content and items
 */

export interface ISpecialOfferItem {
  _id?: string;
  tag: string;
  title: string;
  price: string;
  image: string;
  altText: string;
  description_primary: string;
  description_secondary: string;
  link: string;
  linkText: string;
}

export interface ISpecialOffers extends Document {
  subtitle: string;
  title: string;
  phrase: string;
  divider: boolean;
  align: "left" | "right" | "center";
  emptyMessage: string;
  carouselAriaLabel: string;
  prevButtonAriaLabel: string;
  nextButtonAriaLabel: string;
  paginationBulletAriaLabel: string;
  items: ISpecialOfferItem[];
  createdAt: Date;
  updatedAt: Date;
}

const specialOfferItemSchema = new Schema<ISpecialOfferItem>({
  tag: {
    type: String,
    trim: true,
    default: "",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  altText: {
    type: String,
    required: true,
    trim: true,
  },
  description_primary: {
    type: String,
    trim: true,
    default: "",
  },
  description_secondary: {
    type: String,
    trim: true,
    default: "",
  },
  link: {
    type: String,
    trim: true,
    default: "/",
  },
  linkText: {
    type: String,
    trim: true,
    default: "",
  },
});

const specialOffersSchema = new Schema<ISpecialOffers>(
  {
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    phrase: {
      type: String,
      trim: true,
      default: "",
    },
    divider: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String,
      enum: ["left", "right", "center"],
      default: "center",
    },
    emptyMessage: {
      type: String,
      default: "No offers available at the moment.",
    },
    carouselAriaLabel: {
      type: String,
      default: "Special offers carousel",
    },
    prevButtonAriaLabel: {
      type: String,
      default: "Previous special offer",
    },
    nextButtonAriaLabel: {
      type: String,
      default: "Next special offer",
    },
    paginationBulletAriaLabel: {
      type: String,
      default: "Go to offer {index}",
    },
    items: {
      type: [specialOfferItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const SpecialOffers = model<ISpecialOffers>(
  "SpecialOffers",
  specialOffersSchema
);

import { Schema, model, Document } from "mongoose";

/**
 * Gallery Model
 * Stores gallery page content and items
 */

export interface IGalleryItem {
  _id?: string;
  image: string;
  title: string;
  altText: string;
  subtitle: string;
}

export interface IGallery extends Document {
  subtitle: string;
  title: string;
  phrase: string;
  divider: boolean;
  align: "left" | "right" | "center";
  emptyMessage: string;
  errorMessage: string;
  lightboxOpenLabel: string;
  lightboxPrevAriaLabel: string;
  lightboxNextAriaLabel: string;
  lightboxCloseAriaLabel: string;
  items: IGalleryItem[];
  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<IGalleryItem>({
  image: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  altText: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
    default: "",
  },
});

const gallerySchema = new Schema<IGallery>(
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
      default: true,
    },
    align: {
      type: String,
      enum: ["left", "right", "center"],
      default: "center",
    },
    emptyMessage: {
      type: String,
      default: "No gallery items available at the moment.",
    },
    errorMessage: {
      type: String,
      default: "Error loading gallery:",
    },
    lightboxOpenLabel: {
      type: String,
      default: "Open lightbox",
    },
    lightboxPrevAriaLabel: {
      type: String,
      default: "Previous image",
    },
    lightboxNextAriaLabel: {
      type: String,
      default: "Next image",
    },
    lightboxCloseAriaLabel: {
      type: String,
      default: "Close lightbox",
    },
    items: {
      type: [galleryItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = model<IGallery>("Gallery", gallerySchema);

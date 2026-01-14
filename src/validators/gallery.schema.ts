import { z } from "zod";

/**
 * Gallery Validation Schemas
 */

// Gallery item schema
const galleryItemSchema = z.object({
  image: z.string().min(1, "Image is required"),
  title: z.string().min(1, "Title is required"),
  altText: z.string().min(1, "Alt text is required"),
  subtitle: z.string().default(""),
});

// Create gallery schema
export const createGallerySchema = z.object({
  subtitle: z.string().min(1, "Subtitle is required"),
  title: z.string().min(1, "Title is required"),
  phrase: z.string().default(""),
  divider: z.boolean().default(true),
  align: z.enum(["left", "right", "center"]).default("center"),
  emptyMessage: z.string().default("No gallery items available at the moment."),
  errorMessage: z.string().default("Error loading gallery:"),
  lightboxOpenLabel: z.string().default("Open lightbox"),
  lightboxPrevAriaLabel: z.string().default("Previous image"),
  lightboxNextAriaLabel: z.string().default("Next image"),
  lightboxCloseAriaLabel: z.string().default("Close lightbox"),
  items: z.array(galleryItemSchema).default([]),
});

// Update gallery schema (all fields optional)
export const updateGallerySchema = z.object({
  subtitle: z.string().min(1, "Subtitle is required").optional(),
  title: z.string().min(1, "Title is required").optional(),
  phrase: z.string().optional(),
  divider: z.boolean().optional(),
  align: z.enum(["left", "right", "center"]).optional(),
  emptyMessage: z.string().optional(),
  errorMessage: z.string().optional(),
  lightboxOpenLabel: z.string().optional(),
  lightboxPrevAriaLabel: z.string().optional(),
  lightboxNextAriaLabel: z.string().optional(),
  lightboxCloseAriaLabel: z.string().optional(),
  items: z.array(galleryItemSchema).optional(),
});

// Type exports
export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;

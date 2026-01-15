import { z } from "zod";

/**
 * Special Offers Validation Schemas
 */

// Special offer item schema
const specialOfferItemSchema = z.object({
  tag: z.string().default(""),
  title: z.string().min(1, "Title is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().min(1, "Image is required"),
  altText: z.string().min(1, "Alt text is required"),
  description_primary: z.string().default(""),
  description_secondary: z.string().default(""),
  link: z.string().default("/"),
  linkText: z.string().default(""),
});

// Create special offers schema
export const createSpecialOffersSchema = z.object({
  subtitle: z.string().min(1, "Subtitle is required"),
  title: z.string().min(1, "Title is required"),
  phrase: z.string().default(""),
  divider: z.boolean().default(false),
  align: z.enum(["left", "right", "center"]).default("center"),
  emptyMessage: z.string().default("No offers available at the moment."),
  carouselAriaLabel: z.string().default("Special offers carousel"),
  prevButtonAriaLabel: z.string().default("Previous special offer"),
  nextButtonAriaLabel: z.string().default("Next special offer"),
  paginationBulletAriaLabel: z.string().default("Go to offer {index}"),
  items: z.array(specialOfferItemSchema).default([]),
});

// Update special offers schema (all fields optional)
export const updateSpecialOffersSchema = z.object({
  subtitle: z.string().min(1, "Subtitle is required").optional(),
  title: z.string().min(1, "Title is required").optional(),
  phrase: z.string().optional(),
  divider: z.boolean().optional(),
  align: z.enum(["left", "right", "center"]).optional(),
  emptyMessage: z.string().optional(),
  carouselAriaLabel: z.string().optional(),
  prevButtonAriaLabel: z.string().optional(),
  nextButtonAriaLabel: z.string().optional(),
  paginationBulletAriaLabel: z.string().optional(),
  items: z.array(specialOfferItemSchema).optional(),
});

// Type exports
export type CreateSpecialOffersInput = z.infer<
  typeof createSpecialOffersSchema
>;
export type UpdateSpecialOffersInput = z.infer<
  typeof updateSpecialOffersSchema
>;

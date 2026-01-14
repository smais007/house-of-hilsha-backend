import { z } from "zod";

/**
 * About Page Validation Schemas
 */

// Schedule item schema
const scheduleItemSchema = z.object({
  id: z.number(),
  day: z.string().min(1, "Day is required"),
  time: z.string().min(1, "Time is required"),
});

// Opening hours schema
const openingHoursSchema = z.object({
  title: z.string().min(1, "Title is required"),
  schedule: z.array(scheduleItemSchema).default([]),
});

// Create about schema
export const createAboutSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  altText: z.string().min(1, "Alt text is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  title: z.string().min(1, "Title is required"),
  divider: z.boolean().default(false),
  align: z.enum(["left", "right", "center"]).default("left"),
  priorityImage: z.boolean().default(false),
  buttonLink: z.string().default(""),
  buttonText: z.string().default(""),
  showOpeningHours: z.boolean().default(false),
  openingHours: openingHoursSchema.default({
    title: "Opening Hours",
    schedule: [],
  }),
  descriptionParagraphs: z.array(z.string()).default([]),
  descriptionParagraphsTwo: z.array(z.string()).default([]),
  descriptionParagraphsThree: z.array(z.string()).default([]),
});

// Update about schema (all fields optional)
export const updateAboutSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required").optional(),
  altText: z.string().min(1, "Alt text is required").optional(),
  subtitle: z.string().min(1, "Subtitle is required").optional(),
  title: z.string().min(1, "Title is required").optional(),
  divider: z.boolean().optional(),
  align: z.enum(["left", "right", "center"]).optional(),
  priorityImage: z.boolean().optional(),
  buttonLink: z.string().optional(),
  buttonText: z.string().optional(),
  showOpeningHours: z.boolean().optional(),
  openingHours: openingHoursSchema.optional(),
  descriptionParagraphs: z.array(z.string()).optional(),
  descriptionParagraphsTwo: z.array(z.string()).optional(),
  descriptionParagraphsThree: z.array(z.string()).optional(),
});

// Type exports
export type CreateAboutInput = z.infer<typeof createAboutSchema>;
export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;

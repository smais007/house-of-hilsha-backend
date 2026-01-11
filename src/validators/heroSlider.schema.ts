import { z } from "zod";

export const createHeroSliderSchema = z.object({
  image: z.string().url(),
  altText: z.string().min(1),
  subtitle: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().min(1),
  link: z.string().min(1),
  textLink: z.string().min(1),
  order: z.number().int().nonnegative(),
  isActive: z.boolean().optional(),
});

export const updateHeroSliderSchema = createHeroSliderSchema.partial();

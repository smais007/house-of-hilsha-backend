import { z } from "zod";

/**
 * Site Info Validation Schemas
 */

// Topbar schema
const topbarSchema = z.object({
  addressIcon: z.string().default("fa-solid fa-location-dot"),
  addressAriaLabel: z.string().default("Location"),
  phoneIcon: z.string().default("fa-solid fa-phone"),
  phoneAriaLabel: z.string().default("Call us at"),
  emailIcon: z.string().default("fa-solid fa-envelope"),
  emailAriaLabel: z.string().default("Email us at"),
});

// Create site info schema
export const createSiteInfoSchema = z.object({
  urlLogo: z.string().min(1, "Logo URL is required"),
  urlMap: z.string().default(""),
  phone: z.string().min(1, "Phone is required"),
  fax: z.string().default(""),
  emailInfo: z.string().email("Invalid email format"),
  emailReservations: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().default(""),
  country: z.string().min(1, "Country is required"),
  largeCountry: z.string().default(""),
  phoneLabel: z.string().default("Phone:"),
  faxLabel: z.string().default("Fax:"),
  copyright: z.string().default(""),
  scrollToTopLabel: z.string().default("Go to top"),
  scrollToTopIconClasses: z.string().default("fas fa-angle-double-up"),
  menuToggleAriaLabelOpen: z.string().default("Open menu"),
  menuToggleAriaLabelClose: z.string().default("Close menu"),
  topbar: topbarSchema.default({}),
});

// Update site info schema (all fields optional)
export const updateSiteInfoSchema = z.object({
  urlLogo: z.string().min(1, "Logo URL is required").optional(),
  urlMap: z.string().optional(),
  phone: z.string().min(1, "Phone is required").optional(),
  fax: z.string().optional(),
  emailInfo: z.string().email("Invalid email format").optional(),
  emailReservations: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  zip: z.string().optional(),
  country: z.string().min(1, "Country is required").optional(),
  largeCountry: z.string().optional(),
  phoneLabel: z.string().optional(),
  faxLabel: z.string().optional(),
  copyright: z.string().optional(),
  scrollToTopLabel: z.string().optional(),
  scrollToTopIconClasses: z.string().optional(),
  menuToggleAriaLabelOpen: z.string().optional(),
  menuToggleAriaLabelClose: z.string().optional(),
  topbar: topbarSchema.partial().optional(),
});

// Type exports
export type CreateSiteInfoInput = z.infer<typeof createSiteInfoSchema>;
export type UpdateSiteInfoInput = z.infer<typeof updateSiteInfoSchema>;

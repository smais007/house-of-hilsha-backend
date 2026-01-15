import { Router } from "express";
import { galleryController } from "../controllers/gallery.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

/**
 * Gallery Routes
 *
 * GET    /gallery        - Get gallery data (public)
 * POST   /gallery        - Create gallery data (admin only)
 * PUT    /gallery        - Update gallery data (admin only)
 * DELETE /gallery        - Delete gallery data (admin only)
 * PUT    /gallery/upsert - Create or update gallery data (admin only)
 */

const router = Router();

// Public route - get gallery data
router.get("/", galleryController.getGallery.bind(galleryController));

// Admin only routes
router.post(
  "/",

  galleryController.createGallery.bind(galleryController)
);

router.put(
  "/",
  requireAuth,
  requireAdmin,
  galleryController.updateGallery.bind(galleryController)
);

router.delete(
  "/",
  requireAuth,
  requireAdmin,
  galleryController.deleteGallery.bind(galleryController)
);

router.put(
  "/upsert",
  requireAuth,
  requireAdmin,
  galleryController.upsertGallery.bind(galleryController)
);

export default router;

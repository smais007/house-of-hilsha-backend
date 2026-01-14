import { Router } from "express";
import { aboutController } from "../controllers/about.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

/**
 * About Routes
 *
 * GET    /about        - Get about data (public)
 * POST   /about        - Create about data (admin only)
 * PUT    /about        - Update about data (admin only)
 * DELETE /about        - Delete about data (admin only)
 * PUT    /about/upsert - Create or update about data (admin only)
 */

const router = Router();

// Public route - get about data
router.get("/", aboutController.getAbout.bind(aboutController));

// Admin only routes
router.post(
  "/",
  requireAuth,
  requireAdmin,
  aboutController.createAbout.bind(aboutController)
);

router.put(
  "/",
  requireAuth,
  requireAdmin,
  aboutController.updateAbout.bind(aboutController)
);

router.delete(
  "/",
  requireAuth,
  requireAdmin,
  aboutController.deleteAbout.bind(aboutController)
);

router.put(
  "/upsert",
  requireAuth,
  requireAdmin,
  aboutController.upsertAbout.bind(aboutController)
);

export default router;

import { Router } from "express";
import { siteInfoController } from "../controllers/siteInfo.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

/**
 * Site Info Routes
 *
 * GET    /site-info        - Get site info (public)
 * POST   /site-info        - Create site info (admin only)
 * PUT    /site-info        - Update site info (admin only)
 * DELETE /site-info        - Delete site info (admin only)
 * PUT    /site-info/upsert - Create or update site info (admin only)
 */

const router = Router();

// Public route - get site info
router.get("/", siteInfoController.getSiteInfo.bind(siteInfoController));

// Admin only routes
router.post(
  "/",

  siteInfoController.createSiteInfo.bind(siteInfoController)
);

router.put(
  "/",

  siteInfoController.updateSiteInfo.bind(siteInfoController)
);

router.delete(
  "/",

  siteInfoController.deleteSiteInfo.bind(siteInfoController)
);

router.put(
  "/upsert",

  siteInfoController.upsertSiteInfo.bind(siteInfoController)
);

export default router;

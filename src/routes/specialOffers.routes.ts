import { Router } from "express";
import { specialOffersController } from "../controllers/specialOffers.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

/**
 * Special Offers Routes
 *
 * GET    /special-offers        - Get special offers (public)
 * POST   /special-offers        - Create special offers (admin only)
 * PUT    /special-offers        - Update special offers (admin only)
 * DELETE /special-offers        - Delete special offers (admin only)
 * PUT    /special-offers/upsert - Create or update (admin only)
 */

const router = Router();

// Public route
router.get(
  "/",
  specialOffersController.getSpecialOffers.bind(specialOffersController)
);

// Admin only routes
router.post(
  "/",

  specialOffersController.createSpecialOffers.bind(specialOffersController)
);

router.put(
  "/",
  requireAuth,
  requireAdmin,
  specialOffersController.updateSpecialOffers.bind(specialOffersController)
);

router.delete(
  "/",
  requireAuth,
  requireAdmin,
  specialOffersController.deleteSpecialOffers.bind(specialOffersController)
);

router.put(
  "/upsert",
  requireAuth,
  requireAdmin,
  specialOffersController.upsertSpecialOffers.bind(specialOffersController)
);

export default router;

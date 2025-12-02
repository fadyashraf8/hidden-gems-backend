import express from "express";
import {
  getUserAllWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistCounter,
  clearAllWishlist,
  getUserWishlistForAdmin,
} from "../controllers/wishlist.controller.js";
import { protectedRoutes, allowedTo } from "../controllers/auth.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.use(protectedRoutes);

// Get user's wishlist
wishlistRouter.route("/").get(getUserAllWishlist);

// Add to wishlist
wishlistRouter.route("/add").post(addToWishlist);

// Remove from wishlist
wishlistRouter.route("/remove/:gemId").delete(removeFromWishlist);

// Get wishlist counter (for frontend badge)
wishlistRouter.route("/counter").get(getWishlistCounter);

// Clear entire wishlist
wishlistRouter.route("/clear").delete(clearAllWishlist);

// Admin route to get a user's wishlist
wishlistRouter.route("/admin/:userId").get(allowedTo("admin"), getUserWishlistForAdmin);

export default wishlistRouter;

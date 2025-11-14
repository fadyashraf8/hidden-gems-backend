import express from "express";
import * as reviewController from "../controllers/review.controller.js";
const router = express.Router();

//get all reviews for a place
router.get("/:id", reviewController.getAllReviews);
router.post("/", reviewController.postReview);
router.delete("/:id", reviewController.deleteReview);
router.patch("/:id" , reviewController.updateReview);

export default router;
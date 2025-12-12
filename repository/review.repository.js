import mongoose from "mongoose";
import { reviewModel } from "../models/review.js";

export const createReview = async (review) => {
  const created = await reviewModel.create(review);
  return created.populate("userId", "firstName lastName");
};


export const getAllReviews = () => {
  return reviewModel
    .find()
        .populate("userId", "firstName lastName email")
    .populate("gemId", "-embeddings");
};

export const getReviewByAuthorId = async (id, gemId) => {
  return reviewModel.findOne({ userId: id, gemId: gemId })        .populate("userId", "firstName lastName email")
    .populate("gemId", "-embeddings");
};

export const getAllReviewsForGem = (gemId) => {
  return reviewModel
    .find({ gemId: gemId })
        .populate("userId", "firstName lastName email")
    .populate("gemId", "-embeddings");
};

export const deleteReviewById = async (id) => {
  return await reviewModel.findByIdAndDelete(id);
};

export const updateReviewById = async (id, updatedFields) => {
  return await reviewModel.findByIdAndUpdate(
    id,
    { $set: updatedFields },
    { new: true }
  )
          .populate("userId", "firstName lastName email")
    .populate("gemId", "-embeddings");
};

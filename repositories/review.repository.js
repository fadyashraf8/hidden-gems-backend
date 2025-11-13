import mongoose from "mongoose";
import { reviewModel } from "../models/review";

export const createReview = async (review) => {
    return await reviewModel.create(review);
}

export const getAllReviewsForGem = async (gemId) => {
    return await reviewModel.find({gemId: gemId});
}

export const deleteReviewById = async (id) => {
    return await reviewModel.deleteOne({id: id});
}

export const updateReviewById = async (id, updatedFields) => {
    return await reviewModel.findByIdAndUpdate(id,  {$set: {updatedFields} }, {new: true});
}


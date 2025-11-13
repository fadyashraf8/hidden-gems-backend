import { createReview, deleteReviewById, getAllReviewsForGem, updateReviewById } from "../repositories/review.repository"

export const getAllReviewsByGemId = async (id) => {
    return await getAllReviewsForGem(id);
}

export const create = async (review) => {
    return await createReview(review);
}

export const deleteReview = async(id) => {
    return await deleteReviewById(id);
}

export const updateReview = async (id, review) => {
    return await updateReviewById(id, review);
}
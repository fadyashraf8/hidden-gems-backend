import express from 'express';
import { ReviewValidation } from '../validations/reviewValidations';
import handleValidation from '../middleware/handleValidation';
import { create, deleteReview, getAllReviewsByGemId } from '../services/review.service';
const router = express.Router();


router.get('/:id', ReviewValidation.getReviewValidation(), handleValidation, async (req, res) => {
    const id = req.params;
    const reviews = await getAllReviewsByGemId(id);
    console.log(reviews);
})

router.post("/", ReviewValidation.createValidationRules(), handleValidation, async (req, res) => {
    const review = req.body;
    const createdReview = await create(review);
})

router.delete("/:id", ReviewValidation.getReviewValidation(), handleValidation, async(req, res) => {
    const id = req.params;
    const deletedReview = await deleteReview(id);
    console.log(deletedReview);
})

router.put("/:id", ReviewValidation.createValidationRules(), ReviewValidation.getReviewValidation(), handleValidation, async(req, res) => {
    const review = req.body;
    const id  = req.params;
})
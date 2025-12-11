import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { uploadToCloudinary } from "../middleware/cloudinaryConfig.js";
import { getGem } from "../repository/gem.repo.js";
import { getRatingNumberByReviewId } from "../repository/rating.repo.js";
import {
  createReview,
  deleteReviewById,
  getAllReviewsForGem,
  updateReviewById,
  getAllReviews,
  getReviewByAuthorId,
} from "../repository/review.repository.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import { logActivity } from "./activity.controller.js";
import { getGemById } from "./gem.controller.js";


const getReviewByUserId = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const userPost = await getReviewByAuthorId(userId);
  if (!userPost._id) {
    return next(new AppError("Review not found.", 404));
  }

  let responseReview = userPost.toObject ? userPost.toObject() : userPost;
  const isViewingOwnReview =req.user._id.toString() === userPost.userId.toString();
  if (responseReview.isAnonymous && responseReview.userId && !isViewingOwnReview) {
    responseReview.userId = {
      _id: responseReview.userId._id,
      firstName: "Anonymous",
      lastName: "",
    };
  }

  return res.status(200).send(userPost);
})
const getAllReviewsForAllGems = catchAsyncError(async (req, res, next) => {
  const countQuery = new ApiFeatures(getAllReviews(), req.query)
    .filter()
    .search();

  const totalItems = await countQuery.mongooseQuery.countDocuments();
  const apifeatures = new ApiFeatures(getAllReviews(), req.query)
    .filter()
    .search()
    .sort()
    .fields()
    .paginate();

  // const result = await apifeatures.mongooseQuery;

  let result = await apifeatures.mongooseQuery
    .populate("userId", "firstName lastName _id")
    .lean()
  
    // Handle anonymous reviews
    result = result.map((review) => {
      // const reviewObj = review.toObject ? review.toObject() : review;
      if (review.isAnonymous && review.userId) {
        review.userId = {
          _id: review.userId._id,
          firstName: "Anonymous",
          lastName: "",
        };
      }

      return review;
    });


  const totalPages = Math.ceil(totalItems / apifeatures.limit);

  return res.status(200).json({
    message: "success",
    page: apifeatures.page,
    totalItems,
    totalPages,
    result,
  });
});

const getAllReviewsByGemId = catchAsyncError(async (req, res, next) => {
  const gemId = req.params.id;
  const apifeatures = new ApiFeatures(getAllReviewsForGem(gemId), req.query)
    .paginate()
    .sort()
    .fields()
    .filter()
    .search();
  let result = await apifeatures.mongooseQuery;
  for (let review of result) {
    review.rating = await getRatingNumberByReviewId(review._id);
    // Handle anonymous reviews
    if (review.isAnonymous && review.userId) {
      // Create a masked user object
      review.userId = {
        _id: review.userId._id,
        firstName: "Anonymous",
        lastName: "",
      };
    }

    //  console.log(review.rating);
  }
  // const reviewsList = await getAllReviewsForGem(gemId);
  return res.status(200).send(result);
});

const postReview = catchAsyncError(async (req, res, next) => {
  const reviewObj = req.body;
  const userId = req.user._id;
  const isExist = await getReviewByAuthorId(userId, reviewObj.gemId);
  if(isExist) {
    return next(new AppError("User already has a review on this gem.", 400));
  }
  const gemExist = await getGem(reviewObj.gemId);
  if(!gemExist) {
    return next(new AppError("Gem can not be found to put on a review.", 404));
  }
  let images = [];

  if (req.files?.images?.length) {
    for (const file of req.files.images) {
      const result = await uploadToCloudinary(file.buffer, "reviews");
      images.push(result.secure_url);
    }
  }

  reviewObj.images = images;
  reviewObj.userId = userId;
  //check gemId exist
  const createdReview = await createReview(reviewObj)
    .populate(
    "userId",
    "firstName lastName _id"
  );
    
    let responseReview = createdReview.toObject();
    if (responseReview.isAnonymous && responseReview.userId) {
      // Mask the user's name
      responseReview.userId = {
        _id: responseReview.userId._id,
        firstName: "Anonymous",
        lastName: "",
      };
    }

  if (!responseReview.isAnonymous) {
    logActivity(
      req.user,
      `${req.user.firstName} ${req.user.lastName} posted a review`,
      "You created a review with " + createdReview.description,
      false
    );
  } else {
    logActivity(
      req.user,
      `${req.user.firstName} ${req.user.lastName} posted a review`,
      "You created an anonymous review with " + createdReview.description,
      false
    );
  }

  return res.status(200).send(responseReview);
});

const deleteReview = catchAsyncError(async (req, res, next) => {
  const reviewId = req.params.id;
  const deletedReview = await deleteReviewById(reviewId);
  if (!deletedReview) {
    return next(new AppError("Review not found", 404));
  }
  const gem = await getGem(deletedReview.gemId);
  const gemTitle = gem.name;
  logActivity(
    req.user,
    `${req.user.firstName} ${req.user.lastName} deleted a review`,
    `${req.user.email} deleted a review on ` + gemTitle,
    false
  );
  return res.status(200).send(deletedReview);
});

const updateReview = catchAsyncError(async (req, res, next) => {
  const reviewId = req.params.id;
  const updatedReview = req.body;
  const withUpdatesReview = await updateReviewById(reviewId, updatedReview);
  if (!withUpdatesReview) {
    return next(new AppError("Review can not be found", 404));
  }
  logActivity(
    req.user,
    `${req.user.firstName} ${req.user.lastName} deleted a review`,
   ` ${req.user.email}user deleted a review with ` + withUpdatesReview.description,
    false
  );
  return res.status(201).send(withUpdatesReview);
});

export {
  getAllReviewsForAllGems,
  getAllReviewsByGemId,
  postReview,
  deleteReview,
  updateReview,
  getReviewByUserId
};

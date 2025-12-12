import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { AppError } from "../utils/AppError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import {
  getGemsPromise,
  getGemsQuery,
  getGem,
  createTheGem,
  updateTheGem,
  deleteTheGem,
  findGemByName,
  getGemsByUserId,
  getGemsByCategoryId,
  getSubscribedGemsQuery,
} from "../repository/gem.repo.js";
import { increaseUserPointsHelper } from "./user.controller.js";
import { createEmbeddings } from "../ai/createEmbeddings.js";
import { uploadToCloudinary } from "../middleware/cloudinaryConfig.js";

const getAllGems = catchAsyncError(async (req, res, next) => {
  const countQuery = new ApiFeatures(getGemsQuery(), req.query)
    .filter()
    .search();

  const totalItems = await countQuery.mongooseQuery.countDocuments();

  const apifeatures = new ApiFeatures(getGemsQuery(), req.query)
    .filter()
    .search()
    .sort()
    .fields()
    .paginate();

  const result = await apifeatures.mongooseQuery
    .populate("createdBy", "firstName lastName email")
    .populate("category", "categoryName categoryImage");

  const totalPages = Math.ceil(totalItems / apifeatures.limit);

  return res.status(200).json({
    message: "success",
    page: apifeatures.page,
    totalItems,
    totalPages,
    result,
  });
});
const getAllSubscribedGems = catchAsyncError(async (req, res, next) => {
  const countQuery = new ApiFeatures(getSubscribedGemsQuery(), req.query)
    .filter()
    .search();

  const totalItems = await countQuery.mongooseQuery.countDocuments();

  const apifeatures = new ApiFeatures(getSubscribedGemsQuery(), req.query)
    .filter()
    .search()
    .sort()
    .fields()
    .paginate();

  const result = await apifeatures.mongooseQuery
    .populate("createdBy", "firstName lastName email")
    .populate("category", "categoryName categoryImage");

  const totalPages = Math.ceil(totalItems / apifeatures.limit);

  return res.status(200).json({
    message: "success",
    page: apifeatures.page,
    totalItems,
    totalPages,
    result,
  });
});

const getGemById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  // console.log(id);

  let result = await getGem(id);
  //
  // console.log(result);
  if (!result) return next(new AppError(`Gem not found`, 404));
  res.status(200).json({ message: "success", result });
});

const getAllGemsForCategory = catchAsyncError(async (req, res, next) => {
  const { categoryId } = req.params;

  const countQuery = new ApiFeatures(getGemsByCategoryId(categoryId), req.query)
    .filter()
    .search();

  const totalItems = await countQuery.mongooseQuery.countDocuments();

  const apifeatures = new ApiFeatures(
    getGemsByCategoryId(categoryId),
    req.query
  )
    .filter()
    .search()
    .sort()
    .fields()
    .paginate();

  const result = await apifeatures.mongooseQuery
    .populate("createdBy", "firstName lastName email")
    .populate("category", "categoryName categoryImage");

  const totalPages = Math.ceil(totalItems / apifeatures.limit);

  return res.status(200).json({
    message: "success",
    page: apifeatures.page,
    totalItems,
    totalPages,
    result,
  });
});

const getAllGemsForUser = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
    return next(new AppError("You can only view your own gems", 403));
  }
  const countQuery = new ApiFeatures(getGemsByUserId(userId), req.query)
    .filter()
    .search();

  const totalItems = await countQuery.mongooseQuery.countDocuments();

  const apifeatures = new ApiFeatures(getGemsByUserId(userId), req.query)
    .filter()
    .search()
    .sort()
    .fields()
    .paginate();

  const result = await apifeatures.mongooseQuery
    .populate("createdBy", "firstName lastName email")
    .populate("category", "categoryName categoryImage");

  const totalPages = Math.ceil(totalItems / apifeatures.limit);

  return res.status(200).json({
    message: "success",
    page: apifeatures.page,
    totalItems,
    totalPages,
    result,
  });
});

const changeGemStatus = catchAsyncError(async (req, res, next) => {
  const { gemId } = req.params;
  const { status } = req.body;

  let result = await getGem(gemId);
  if (!result) return next(new AppError(`Gem not found`, 404));

  if (req.user.role !== "admin") {
    return next(new AppError("Only admins can change gem status", 403));
  }

    const userId = result.createdBy?._id
      ? result.createdBy._id
      : result.createdBy;
    if (status === "accepted" && result.status !== "accepted") {
      if (userId) {
        await increaseUserPointsHelper(userId, 10);
      }
    }

  const updatedGem = await updateTheGem(gemId, { status });
  res.status(200).json({
    message: `Gem status updated to ${status} successfully`,
    result: updatedGem,
  });
});

const createGem = catchAsyncError(async (req, res, next) => {
  let isExist = await findGemByName(req.body.name);
  if (isExist) return next(new AppError(`Gem already exists`, 400));

  let status = "pending";
  if (req.user.role === "admin") {
    status = "accepted";
  }

  let uploadedImages = [];
  if (req.files?.images && req.files.images.length > 0) {
    for (const file of req.files.images) {
      const cloudinaryResult = await uploadToCloudinary(file.buffer, "gems");
      uploadedImages.push(cloudinaryResult.secure_url);
    }
  }

  let gemData = {
    ...req.body,
    images: uploadedImages,
    status: status,
    createdBy: req.user._id,
  };


  let result = await createTheGem(gemData);
    const embeddingText = `
Name: ${result.name}
Location: ${result.gemLocation}
Description: ${result.description}
Discounts: Free ${result.discount}%, Gold ${result.discountGold}%, Platinum ${result.discountPlatinum}%
`;

  result.embeddings = await createEmbeddings(embeddingText);
  await result.save();

   if (status === "accepted") {
     await increaseUserPointsHelper(req.user._id, 10);
   }

  if (status === "accepted") {
    res.status(200).json({ message: "Gem created successfully", result });
  } else {
    res.status(200).json({
      message: "Gem created successfully, waiting for admin approval",
      result,
    });
  }
});
const updateGem = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await getGem(id);
  if (!result) return next(new AppError(`Gem not found`, 404));

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== result.createdBy?._id.toString()
  ) {
    return next(new AppError(`You are not allowed to update this gem`, 403));
  }

  const updateData = { ...req.body };

  let finalImages = [];

  if (req.body.oldImages) {
    finalImages = Array.isArray(req.body.oldImages)
      ? req.body.oldImages
      : [req.body.oldImages];
  }

  if (req.files?.images && req.files.images.length > 0) {
    for (const file of req.files.images) {
      const cloudinaryResult = await uploadToCloudinary(file.buffer, "gems");
      finalImages.push(cloudinaryResult.secure_url);
    }
  }

  if (finalImages.length > 0) {
    updateData.images = finalImages;
  }

  result = await updateTheGem(id, updateData);
  res.status(200).json({ message: "Gem updated successfully", result });
});
const deleteGem = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await getGem(id);
  if (!result) return next(new AppError(`Gem not found`, 404));
  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== result.createdBy?._id.toString()
  ) {
    return next(new AppError(`You are not allowed to delete this gem`, 403));
  }

  await deleteTheGem(id);
  res.status(200).json({ message: "Gem deleted successfully", result });
});

const generateAllEmbeddings = catchAsyncError(async (req, res, next) => {
  console.log(req);
  if (req.user.role !== "admin") {
    return next(new AppError("Only admins can regenerate embeddings", 403));
  }

  const gems = await getGemsPromise();
  if (!gems || gems.length === 0) {
    return next(new AppError("No gems found", 404));
  }

  let updatedCount = 0;

  for (const gem of gems) {
    const embeddingText = `
Name: ${gem.name}
Location: ${gem.gemLocation}
Description: ${gem.description}
Discounts: Free ${gem.discount}%, Gold ${gem.discountGold}%, Platinum ${gem.discountPlatinum}%
`;

    try {
      gem.embeddings = await createEmbeddings(embeddingText);
      await gem.save();
      updatedCount++;
    } catch (err) {
      console.error(`Failed embedding for gem ID ${gem._id}:`, err.message);
    }
  }

  return res.status(200).json({
    message: "Embeddings regenerated successfully",
    totalGems: gems.length,
    updatedEmbeddings: updatedCount,
  });
});


export {
  getAllGems,
  getGemById,
  getAllGemsForCategory,
  getAllGemsForUser,
  changeGemStatus,
  createGem,
  updateGem,
  deleteGem,
  getAllSubscribedGems,
  generateAllEmbeddings
};

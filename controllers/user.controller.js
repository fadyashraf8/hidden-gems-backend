import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { userModel } from "../models/user.js";
import { AppError } from "../utils/AppError.js";

import bcrypt from "bcrypt";
import { ApiFeatures } from "../utils/ApiFeatures.js";

const createUser = catchAsyncError(async (req, res, next) => {
  let isExist = await userModel.findOne({ email: req.body.email });
  if (isExist) return next(new AppError(`Email already exists`, 400));

  let hashedPassword = bcrypt.hashSync(
    req.body.password,
    Number(process.env.SALT_ROUNDS)
  );

  let result = new userModel({
    ...req.body,
    password: hashedPassword,
    image: req.file?.filename,
    verified: true,
  });

  await result.save();

  res.status(200).json({
    message: "User registered successfully.",
    result,
  });
});

const getUser = catchAsyncError(async (req, res, next) => {
  let result = await userModel.findById(req.params.id);

  if (!result) return next(new AppError(`User not found`, 404));

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== result._id.toString()
  ) {
    return next(new AppError(`You are not allowed to view this user`, 403));
  }
  res.status(200).json({
    message: "Success",
    result,
  });
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  let apifeatures = new ApiFeatures(userModel.find({}), req.query)
    .paginate()
    .sort()
    .fields()
    .filter()
    .search();
  let result = await apifeatures.mongooseQuery;
  res.status(200).json({ message: "success", page: apifeatures.page, result });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await userModel.findById(id);
  if (!result) return next(new AppError("User not found", 404));

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== result._id.toString()
  ) {
    return next(new AppError("You are not allowed to update this user", 403));
  }

  const allowedUpdates = ["firstName", "lastName", "email", "phoneNumber", "image"];

  for (let key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      user[key] = req.body[key];
    }
  }

  if (req.body.image) {
    result.image = req.file.filename;
  }

  await result.save();

  res.status(200).json({
    message: "success",
    result,
  });
});



const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await userModel.findById(id);
  if (!result) return next(new AppError(`User not found`, 404));

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== result._id.toString()
  ) {
    return next(new AppError(`You are not allowed to delete this user`, 403));
  }

  await userModel.findByIdAndDelete(id);

  res.status(200).json({ message: "User deleted successfully", result });
});

export { createUser, getUser, getAllUsers, deleteUser, updateUser };

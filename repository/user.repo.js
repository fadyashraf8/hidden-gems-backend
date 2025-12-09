import mongoose from "mongoose";
import { userModel } from "../models/user.js";
export const getUserById = async (userId) => {
    return await userModel.findById(userId);
}

export const getUserPoints = async (userId) => {
    return await userModel.findOne({_id: userId}, {points: 1}).lean();
}

export const updateUserPointsById = async (userId, pointsUsed) => {
    return await userModel.findByIdAndUpdate(userId, {$inc: {points: -pointsUsed}}, {new: true});
}
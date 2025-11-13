import mongoose, { Mongoose } from "mongoose";
const reviewSchem = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User" 
    },
    description: {
        type: String,
        required: true
    },
    gemId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Gem"
    },
    images: {
        type: [String],
    }
})

export const reviewModel = mongoose.model("Review", reviewSchem)
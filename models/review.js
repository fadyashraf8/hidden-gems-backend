import mongoose, { Mongoose } from "mongoose";
const reviewSchem = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user" 
    },
    description: {
        type: String,
        required: true
    },
    gemId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "gem"
    },
    images: {
        type: [String],    
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export const reviewModel = mongoose.model("review", reviewSchem)
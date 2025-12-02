import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  gemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gem",
    required: true,
  }
},
    { timestamps: true }
);

//to ensure a user can't add the same gem twice
wishlistSchema.index({ userId: 1, gemId: 1 }, { unique: true });

export const wishlistModel = mongoose.model("wishlist", wishlistSchema);

import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  gem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gem",
    require: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
});

export const ratingModel = mongoose.model("rating", ratingSchema);

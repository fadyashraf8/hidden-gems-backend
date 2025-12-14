import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
    },
    text: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

export const activityModel = mongoose.model("activity", activitySchema);

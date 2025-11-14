import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
          unique: [true, "Category Name must be unique"],

    },
    categoryImage: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    }
})

export const categoryModel = mongoose.model("category", categorySchema);

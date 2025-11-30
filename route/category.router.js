import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { allowedTo, protectedRoutes } from "../controllers/auth.controller.js";
import upload from "../middleware/fileUpload.js";
const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    upload.single("categoryImage"),
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

categoryRouter
  .route("/:id")
  .get(protectedRoutes, allowedTo("admin"), categoryController.getCategory)
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    categoryController.deleteCategory
  )
  .put(
    protectedRoutes,
    upload.single("categoryImage"),
    categoryController.updateCategory
  );

export default categoryRouter;

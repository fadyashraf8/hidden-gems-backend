
import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { allowedTo, protectedRoutes } from "../controllers/auth.controller.js";
import { uploadSingleFile } from "../middleware/fileUpload.js";
const categoryRouter=express.Router();


categoryRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),uploadSingleFile("categoryImage","category"),categoryController.createCategory)
.get(protectedRoutes,categoryController.getAllCategories)



categoryRouter.route('/:id')
.get(protectedRoutes,allowedTo('admin'),categoryController.getCategory)
.delete(protectedRoutes,allowedTo('admin'),categoryController.deleteCategory)
.put(protectedRoutes,uploadSingleFile("categoryImage","category"),categoryController.updateCategory)





export default categoryRouter;
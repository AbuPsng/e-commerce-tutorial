import express, { Router } from "express"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js"
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js"
const router = express.Router()

//Routes
//Create Category
router.route("/create_category").post(requireSignIn, isAdmin, createCategoryController)

//Update Category
router.route("/update_category/:id").put(requireSignIn, isAdmin, updateCategoryController)

//Get All Category
router.route("/get_all_category").get(categoryController)

//Get Single Category
router.route("/get_single_category/:slug").get(singleCategoryController)

//Delete Single Category
router.route("/delete_single_category/:id").delete(requireSignIn, isAdmin, deleteCategoryController)

export default router
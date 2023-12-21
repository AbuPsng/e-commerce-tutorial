import express from "express"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js"
import { brainTreeTokenController, brianTreePaymentController, createProductController, deleteSingleProductController, getAllOrderController, getAllProductController, getOrdersController, getSingleProductController, orderStatusController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateSingleProductController } from "../controllers/productController.js"
import formidableMiddleware from "express-formidable"

const router = express.Router()

//Routes 

//Create Product
router.route("/create_product").post(requireSignIn, isAdmin, formidableMiddleware(), createProductController)

//Get All  Product
router.route("/get_all_product").get(getAllProductController)

//Get Single  Product
router.route("/get_single_product/:slug").get(getSingleProductController)

//Get Single  Product Photo
router.route("/product_photo/:pid").get(productPhotoController)

//Delete Single  Product
router.route("/delete_product/:id").delete(requireSignIn, isAdmin, deleteSingleProductController)

//Update Single  Product
router.route("/update_product/:id").patch(requireSignIn, isAdmin, formidableMiddleware(), updateSingleProductController)

//Filter Product
router.route("/product_filters").post(productFiltersController)

//Product Count
router.route("/product_count").get(productCountController)

//Product Per Page
router.route("/product_list/:page").get(productListController)

//Search Product
router.route("/search/:keyword").get(searchProductController)

//Search Product
router.route("/related_product/:pid/:cid").get(relatedProductController)

//Search Product by category wise
router.route("/product_category/:slug").get(productCategoryController)

//Payments routes
//token
router.route("/brain_tree/token").get(brainTreeTokenController)

//Payments
router.route("/brain_tree/payment").post(requireSignIn, brianTreePaymentController)

//Orders
router.route("/orders").get(requireSignIn, getOrdersController)

//All Orders
router.route("/all_orders").get(requireSignIn, isAdmin, getAllOrderController)

//Status Update
router.route("/orders_status/:orderId").put(requireSignIn, isAdmin, orderStatusController)


export default router
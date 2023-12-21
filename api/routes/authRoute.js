import express from "express";
import { forgotPasswordController, loginController, registerController, testController, updateProfileController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

//router object
const router = express.Router()


//routing

// REGISTER & POST METHOD
router.route("/register").post(registerController)

// LOGIN & POST METHOD
router.route("/login").post(loginController)

// FORGOT PASSWORD || POST
router.route("/forgot_password").post(forgotPasswordController)

//TEST ROUTE
router.route("/test").get(requireSignIn, isAdmin, testController)

//PROTECTED USER ROUTE AUTH
router.route("/user_auth").get(requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

//PROTECTED ADMIN ROUTE AUTH
router.route("/admin_auth").get(requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

//UPDATE PROFILE
router.route("/profile").put(requireSignIn, updateProfileController)

export default router;
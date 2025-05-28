import { Router } from "express";
import {
  registerUser,
  sendEmailVerificationOTP,
  loginUser,
  updateIncome,
  getIncome,
  verifyEmail,
  updatePassword,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/sendemailverificationotp").post(sendEmailVerificationOTP);
router.route("/updateincome").put(verifyToken, updateIncome);
router.route("/getincome").get(verifyToken, getIncome);
router.route("/verifyemail").post(verifyEmail);
router.route("/updatepassword").put(updatePassword);

export default router;
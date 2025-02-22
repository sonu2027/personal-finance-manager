import { Router } from "express";
import {
  registerUser,
  sendEmailVerificationOTP,
  loginUser,
  updateIncome,
  getIncome
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/sendemailverificationotp").post(sendEmailVerificationOTP);
router.route("/updateincome").put(verifyToken, updateIncome);
router.route("/getincome").get(verifyToken, getIncome);

export default router;
import { Router } from "express";
import {
  fetchBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/fetchbudget").get(verifyToken, fetchBudget);
router.route("/createbudget").post(verifyToken, createBudget);
router.route("/updatebudget").put(verifyToken, updateBudget);
router.route("/deletebudget/:budgetId").delete(verifyToken, deleteBudget);

export default router;

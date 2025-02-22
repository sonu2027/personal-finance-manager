import { Router } from "express";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/fetchtransaction").get(verifyToken, fetchTransactions);
router.route("/createtransaction").post(verifyToken, createTransaction);
router.route("/updatetransaction").put(verifyToken, updateTransaction);
router
  .route("/deleteTransaction/:transactionId")
  .delete(verifyToken, deleteTransaction);

export default router;

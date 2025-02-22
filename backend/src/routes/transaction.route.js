import { Router } from "express";
import { fetchTransactions } from "../controllers/transaction.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/fetchtransaction").get(verifyToken, fetchTransactions);

export default router;

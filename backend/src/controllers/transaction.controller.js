import { Transaction } from "../models/transaction.model.js";

const fetchTransactions = async (req, res) => {
  console.log("req.user: ", req.user);
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export { fetchTransactions };
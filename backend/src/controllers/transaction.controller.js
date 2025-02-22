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

const createTransaction = async (req, res) => {
  console.log("createTransaction: ", req.body);
  const { description, amount, type, category, date } = req.body;
  try {
    const response = await Transaction.insertOne({
      description,
      category,
      amount,
      type,
      user: req.user.id,
      date,
    });
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error creating new transaction:", error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

const updateTransaction = async (req, res) => {
  const { transactionId, description, amount, type, category, date } = req.body;

  if (
    !transactionId ||
    !category ||
    !amount ||
    !type ||
    !date ||
    !description
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { category, amount, type, date, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      data: { transaction: updatedTransaction },
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user.id;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const remainingTransaction = await Transaction.find({ user: userId });

    res.status(200).json({
      message: "transaction deleted successfully",
      data: { transaction: remainingTransaction },
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

export {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

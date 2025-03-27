import { Budget } from "../models/budget.model.js";
import { Transaction } from "../models/transaction.model.js";

const fetchBudget = async (req, res) => {
  console.log("req.user: ", req.user);
  try {
    const budget = await Budget.find({ user: req.user.id });
    console.log("budget fetched is: ", budget);

    res.status(200).json({ budget });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ message: "Failed to fetch budget" });
  }
};

const createBudget = async (req, res) => {
  console.log("createBudget: ", req.body);
  const { category, amount } = req.body;
  try {
    const response = await Budget.insertOne({
      category,
      amount,
      user: req.user.id,
    });
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error creating new budget:", error);
    res.status(500).json({ message: "Failed to create budget" });
  }
};

const updateBudget = async (req, res) => {
  const { budgetId, category, amount, oldCategoryName } = req.body;

  // Validate input
  if (!budgetId || !category || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      { category, amount },
      { new: true }
    );

    const transaction = await Transaction.updateMany(
      { category: oldCategoryName },
      { $set: { category: category } }
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({
      message: "Budget updated successfully",
      data: { budget: updatedBudget },
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Failed to update budget" });
  }
};

const deleteBudget = async (req, res) => {
  const { budgetId } = req.params;
  const userId = req.user.id;

  try {
    const deletedBudget = await Budget.findByIdAndDelete(budgetId);

    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const remainingBudgets = await Budget.find({ user: userId });

    res.status(200).json({
      message: "Budget deleted successfully",
      data: { budgets: remainingBudgets },
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Failed to delete budget" });
  }
};

export { fetchBudget, createBudget, updateBudget, deleteBudget };

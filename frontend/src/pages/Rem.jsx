// import React, { useEffect, useMemo, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import updateIncome from "../databaseCall/updateIncome";
// import { getIncome } from "../databaseCall/getIncome";
// import Navbar from "../component/Navbar";
// import toast from 'react-hot-toast';

// function Dashboard() {
//   const [income, setIncome] = useState(0);

//   const navigate = useNavigate();

//   // Calculate current time only once when the component mounts
//   const currentTime = useMemo(() => Date.now() / 1000, []);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const decoded = jwtDecode(token);

//       if (decoded.exp < currentTime) {
//         localStorage.removeItem("authToken");
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Invalid token:", error);
//       navigate("/login");
//     }
//   }, [navigate, currentTime]);

//   const handleSaveIncome = () => {
//     updateIncome(income)
//       .then((res) => {
//         toast.success("Income updated successfully")
//       })
//       .catch((error) => {
//         toast.success("Income updation failed, please try again")
//       })
//   };

//   useEffect(() => {
//     getIncome()
//       .then((res) => {
//         setIncome(res.income)
//       })
//       .catch((error) => {

//       })
//   }, [])


//   return (
//     <>
//       <Navbar />

//       <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
//         <h2 className="text-lg font-semibold mb-2">Set Your Monthly Income</h2>
//         <input
//           type="number"
//           placeholder="Enter your monthly income"
//           value={income}
//           onChange={(e) => setIncome(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         />
//         <button
//           onClick={handleSaveIncome}
//           className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           Save Income
//         </button>
//       </div>

//     </>
//   )
// }

// export default Dashboard;

















import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { fetchTransactions } from '../databaseCall/fetchTransactions';
import { fetchBudget } from '../databaseCall/fetchBudget';
import { createTransaction } from '../databaseCall/createTransaction';
import { createBudget } from '../databaseCall/createBudget';
import { updateTransaction } from '../databaseCall/updateTransaction';
import { updateBudget } from '../databaseCall/updateBudget';
import { deleteTransaction } from '../databaseCall/deleteTransaction';
import { deleteBudget } from '../databaseCall/deleteBudget';
import { SlOptionsVertical } from "react-icons/sl";
import Navbar from "../component/Navbar.jsx"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [editTransaction, setEditTransaction] = useState(null);
  const [editBudget, setEditBudget] = useState(null);
  const [optionId, setOptionId] = useState("");
  const [loading, setLoading] = useState(true);

  //  Calculate current time only once when the component mounts
  const currentTime = useMemo(() => Date.now() / 1000, []);

  const navigate = useNavigate()

  // Fetch transactions and budgets on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsData = await fetchTransactions();
        const budgetsData = await fetchBudget();
        setTransactions(transactionsData || []);
        setBudgets(budgetsData || []);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
  
      if (decoded.exp < currentTime) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("authToken"); 
      navigate("/login");
    }
  }, [currentTime, navigate]); 

  // Handle input change for transaction and budget forms
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'transaction') {
      if (editTransaction) {
        setEditTransaction({ ...editTransaction, [name]: value });
      } else {
        setNewTransaction({ ...newTransaction, [name]: value });
      }
    } else if (formType === 'budget') {
      if (editBudget) {
        setEditBudget({ ...editBudget, [name]: value });
      } else {
        setNewBudget({ ...newBudget, [name]: value });
      }
    }
  };

  // Handle form submission for transactions
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTransaction) {
        const updatedTransaction = await updateTransaction({
          transactionId: editTransaction._id,
          ...editTransaction,
        });
        setTransactions(transactions.map((t) => (t._id === updatedTransaction._id ? updatedTransaction : t)));
        toast.success('Transaction updated successfully!');
      } else {
        const createdTransaction = await createTransaction(newTransaction);
        setTransactions([...transactions, createdTransaction]);
        toast.success('Transaction added successfully!');
      }
      setIsTransactionModalOpen(false);
      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
      setEditTransaction(null);
    } catch (error) {
      toast.error('Failed to save transaction');
    }
  };

  // Handle form submission for budgets
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBudget) {
        const updatedBudget = await updateBudget({
          budgetId: editBudget._id,
          ...editBudget,
        });
        setBudgets(budgets.map((b) => (b._id === updatedBudget._id ? updatedBudget : b)));
        toast.success('Budget updated successfully!');
      } else {
        const createdBudget = await createBudget(newBudget);
        setBudgets([...budgets, createdBudget]);
        toast.success('Budget added successfully!');
      }
      setIsBudgetModalOpen(false);
      setNewBudget({ category: '', amount: '' });
      setEditBudget(null);
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  // Handle delete for transactions and budgets
  const handleDelete = async (id, type) => {
    try {
      if (type === 'transaction') {
        await deleteTransaction(id);
        setTransactions(transactions.filter((t) => t._id !== id));
        toast.success('Transaction deleted successfully!');
      } else if (type === 'budget') {
        await deleteBudget(id);
        setBudgets(budgets.filter((b) => b._id !== id));
        toast.success('Budget deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Prepare data for charts
  const spendingByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const chartData = Object.keys(spendingByCategory).map((category) => ({
    name: category,
    value: spendingByCategory[category],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Total Income</h2>
            <p className="text-2xl font-bold text-green-600">${totalIncome}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Total Expenses</h2>
            <p className="text-2xl font-bold text-red-600">${totalExpenses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Net Balance</h2>
            <p className="text-2xl font-bold text-blue-600">${totalIncome - totalExpenses}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Spending by Category</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Income vs Expenses vs Net balance</h2>
            <BarChart width={400} height={300} data={[{ name: 'Income', value: totalIncome }, { name: 'Expenses', value: totalExpenses }, { name: 'Net balance', value: totalIncome - totalExpenses }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        {/* Transactions Section */}
        {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h2>
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Transaction
        </button>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{transaction.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">${transaction.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{transaction.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <SlOptionsVertical
                      onClick={(e) => {
                        e.stopPropagation();
                        setOptionId(transaction._id);
                      }}
                    />
                    {optionId === transaction._id && (
                      <div className="relative right-[70px] bottom-4 z-10">
                        <div className="flex flex-col bg-white border-solid border-2 border-gray-200 absolute items-start gap-y-2 rounded-md">
                          <button
                            onClick={() => {
                              setEditTransaction(transaction);
                              setIsTransactionModalOpen(true);
                            }}
                            className="py-1 pl-2 pr-4 text-blue-600 hover:text-blue-800 hover:bg-gray-400 hover:rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(transaction._id, 'transaction')}
                            className="text-red-600 py-1 pl-2 pr-4 hover:text-red-800 hover:bg-gray-400 hover:rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

        {/* Budgets Section */}
        {/* <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Budgets</h2>
        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Budget
        </button>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {budgets.map((budget) => (
                <tr key={budget._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{budget.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">${budget.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <SlOptionsVertical
                      onClick={(e) => {
                        e.stopPropagation();
                        setOptionId(budget._id);
                      }}
                    />
                    {optionId === budget._id && (
                      <div className="relative right-[70px] bottom-4 z-10">
                        <div className="flex flex-col bg-white border-solid border-2 border-gray-200 absolute items-start gap-y-2 rounded-md">
                          <button
                            onClick={() => {
                              setEditBudget(budget);
                              setIsBudgetModalOpen(true);
                            }}
                            className="py-1 pl-2 pr-4 text-blue-600 hover:text-blue-800 hover:bg-gray-400 hover:rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(budget._id, 'budget')}
                            className="text-red-600 py-1 pl-2 pr-4 hover:text-red-800 hover:bg-gray-400 hover:rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

        {/* Transaction Modal */}
        {/* {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={editTransaction ? editTransaction.description : newTransaction.description}
                onChange={(e) => handleInputChange(e, 'transaction')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={editTransaction ? editTransaction.amount : newTransaction.amount}
                onChange={(e) => handleInputChange(e, 'transaction')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                name="type"
                value={editTransaction ? editTransaction.type : newTransaction.type}
                onChange={(e) => handleInputChange(e, 'transaction')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={editTransaction ? editTransaction.category : newTransaction.category}
                onChange={(e) => handleInputChange(e, 'transaction')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="date"
                name="date"
                value={editTransaction ? editTransaction.date : newTransaction.date}
                onChange={(e) => handleInputChange(e, 'transaction')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsTransactionModalOpen(false);
                    setEditTransaction(null);
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editTransaction ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

        {/* Budget Modal */}
        {/* {isBudgetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editBudget ? 'Edit Budget' : 'Add Budget'}
            </h2>
            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={editBudget ? editBudget.category : newBudget.category}
                onChange={(e) => handleInputChange(e, 'budget')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={editBudget ? editBudget.amount : newBudget.amount}
                onChange={(e) => handleInputChange(e, 'budget')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsBudgetModalOpen(false);
                    setEditBudget(null);
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editBudget ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      </div>
    </div>
  );
};

export default Dashboard;
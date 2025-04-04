import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchTransactions } from '../databaseCall/fetchTransactions';
import { createTransaction } from '../databaseCall/createTransaction';
import { updateTransaction } from '../databaseCall/updateTransaction';
import { deleteTransaction } from '../databaseCall/deleteTransaction';
import { SlOptionsVertical } from "react-icons/sl";
import { fetchBudget } from '../databaseCall/fetchBudget';
import { FaFileExcel } from "react-icons/fa";

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: 0,
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [editTransaction, setEditTransaction] = useState(null);
    const [optionId, setOptionId] = useState("");
    const [category, setCategory] = useState([])

    useEffect(() => {
        fetchTransactions()
            .then((res) => {
                setTransactions(res);
                return fetchBudget()
            })
            .then((res) => {
                setBudgets(res);
            })
            .catch((error) => {
                toast.error('Failed to fetch transactions');
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (editTransaction) {
            setEditTransaction({ ...editTransaction, [name]: value });
        } else {
            setNewTransaction({ ...newTransaction, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editTransaction) {

            if (editTransaction.description.length > 200) {
                toast.error("Description should be in less than 200 character")
                return
            }

            if (editTransaction.amount < 1) {
                toast.error('Transaction amount should be a valid number greater than 0');
                return;
            }

            updateTransaction({
                transactionId: editTransaction._id,
                description: editTransaction.description,
                amount: editTransaction.amount,
                type: editTransaction.type,
                category: editTransaction.category,
                date: editTransaction.date,
            })
                .then((res) => {
                    setTransactions(
                        transactions.map((transaction) =>
                            transaction._id === editTransaction._id ? res : transaction
                        )
                    );
                    toast.success('Transaction updated successfully!');
                })
                .catch((error) => {
                    toast.error('Transaction updation failed!');
                });
        } else {

            if (newTransaction.description.length > 200) {
                toast.error("Description should be in less than 200 character")
                return
            }

            console.log(typeof newTransaction.amount);

            if (newTransaction.amount < 1) {
                toast.error('Transaction amount should be a valid number greater than 0');
                return;
            }

            if (newTransaction.category == "") {
                newTransaction.category = category[0]
            }

            createTransaction({ ...newTransaction })
                .then((res) => {
                    setTransactions([...transactions, res]);
                    toast.success('Transaction added successfully!');

                    let tempTransaction = [...transactions, res]
                    let transaction = 0
                    let budget = 0

                    tempTransaction.map((e) => {
                        if (e.category == newTransaction.category) {
                            transaction += e.amount
                        }
                    })

                    budgets.map((e) => {
                        if (e.category == newTransaction.category) {
                            budget += e.amount
                        }
                    })

                    let transactionLimit = (budget * 80) / 100

                    if (transactionLimit < transaction) {
                        alert("You are spending near the budget!")
                    }

                })
                .catch((error) => {
                    toast.error('Transaction not added, please try again');
                });
        }

        setIsModalOpen(false);
        setNewTransaction({
            description: '',
            amount: '',
            type: 'expense',
            category: '',
            date: new Date().toISOString().split('T')[0],
        });
        setEditTransaction(null);
    };

    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        deleteTransaction(id)
            .then((res) => {
                setTransactions(transactions.filter((transaction) => transaction._id !== id));
                toast.success('Transaction deleted successfully!');
            })
            .catch((error) => {
                toast.error('Failed to delete transaction');
            });
    };

    window.addEventListener("click", (e) => {
        e.stopPropagation();
        if (optionId.length > 0) {
            setOptionId("");
        }
    });

    useEffect(() => {
        fetchBudget()
            .then((res) => {
                let tempCategory = []
                res.map((e) => {
                    tempCategory.push(e.category)
                })
                setCategory([...tempCategory]);
            })
            .catch((error) => {
                toast.error('Failed to fetch budget');
            })
    }, []);

    const exportToCSV = () => {
        console.log("transactions: ", transactions);

        let heading = ["Description", "Amount", "Type", "Category", "Date"]
        let temp = transactions.map((e) => {
            e.date = new Date(e.date).toLocaleDateString()
        })
        temp = transactions.map((e) => Object.values(e).slice(1, 6))
        let data = [heading, ...temp]

        let csvContent = "data:text/csv;charset=utf-8,"
            + data.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "exported_data.csv");
        document.body.appendChild(link);
        link.click();
    };



    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className='flex justify-between'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Transaction
                </button>

                <button onClick={exportToCSV} className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex gap-x-1 justify-center items-center">
                    <FaFileExcel className='text-emerald-500'/>
                    <span>Export</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Description</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Amount</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Type</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Category</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Date</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">{transaction.description}</td>
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">${transaction.amount}</td>
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.type === 'income'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {transaction.type}
                                    </span>
                                </td>
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">{transaction.category}</td>
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">
                                    {optionId === transaction._id && (
                                        <div className="relative right-[70px] bottom-4 z-10">
                                            <div className="flex flex-col bg-white border-solid border-2 border-gray-200 absolute items-start gap-y-2 rounded-md">
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="py-1 pl-2 pr-4 text-blue-600 hover:text-blue-800 hover:bg-gray-400 hover:rounded-md"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction._id)}
                                                    className="text-red-600 py-1 pl-2 pr-4 hover:text-red-800 hover:bg-gray-400 hover:rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <SlOptionsVertical
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOptionId(transaction._id);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={editTransaction ? editTransaction.description : newTransaction.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={editTransaction ? editTransaction.amount : newTransaction.amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <select
                                name="type"
                                value={editTransaction ? editTransaction.type : newTransaction.type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <select
                                name="category"
                                value={editTransaction ? editTransaction.category : newTransaction.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                {
                                    category.map((e) => <option key={e} value={e}>{e}</option>)
                                }
                            </select>

                            <input
                                type="date"
                                name="date"
                                value={editTransaction ? editTransaction.date : newTransaction.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
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
            )}
        </div>
    );
};

export default TransactionTable;
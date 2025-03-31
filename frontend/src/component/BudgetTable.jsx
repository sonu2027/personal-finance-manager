import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchBudget } from '../databaseCall/fetchBudget';
import { createBudget } from '../databaseCall/createBudget';
import { updateBudget } from '../databaseCall/updateBudget';
import { deleteBudget } from '../databaseCall/deleteBudget';
import { SlOptionsVertical } from "react-icons/sl";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

const BudgetTable = () => {
    const [budgets, setBudgets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
    const [editBudget, setEditBudget] = useState(null);
    const [optionId, setOptionId] = useState("")
    const [oldCategoryName, setOldCategoryName] = useState('')

    useEffect(() => {
        fetchBudget()
            .then((res) => {
                setBudgets(res);
            })
            .catch((error) => {
                toast.error('Failed to fetch budget');
            })
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editBudget) {
            setEditBudget({ ...editBudget, [name]: value });
        } else {
            setNewBudget({ ...newBudget, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editBudget) {

            if (editBudget.category.length > 30) {
                toast.error("Category should be have less than 30 character")
                return
            }

            if (editBudget.amount < 1) {
                toast.error('Transaction amount should be a valid number greater than 0');
                return;
            }

            updateBudget({ budgetId: editBudget._id, category: editBudget.category, amount: editBudget.amount, oldCategoryName })
                .then((res) => {
                    setBudgets(
                        budgets.map((budget) =>
                            budget._id === editBudget._id ? res : budget
                        )
                    );
                    toast.success('Budget updated successfully!');
                })
                .catch((error) => {
                    toast.error('Budget updation failed!');
                })
        } else {

            if (newBudget.category.length > 30) {
                toast.error("Category should be have less than 30 character")
                return
            }

            if (newBudget.amount < 1) {
                toast.error('Budget amount should be a valid number greater than 0');
                return;
            }

            createBudget({ ...newBudget })
                .then((res) => {
                    setBudgets([...budgets, res]);
                    toast.success('Budget added successfully!');
                })
                .catch((error) => {
                    toast.error('Budget not added, please try again');
                })
        }

        setIsModalOpen(false);
        setNewBudget({ category: '', amount: '' });
        setEditBudget(null);
    };

    // Handle edit button click
    const handleEdit = (budget) => {
        setEditBudget(budget);
        setIsModalOpen(true);
        setOldCategoryName(budget.category)
    };

    const handleDelete = async (id) => {
        deleteBudget(id)
            .then((res) => {
                setBudgets(budgets.filter((budget) => budget._id !== id));
                toast.success('Budget deleted successfully!');
            })
            .catch((error) => {
                toast.error('Failed to delete budget');
            })
    };

    window.addEventListener("click", (e) => {
        e.stopPropagation()
        if (optionId.length > 0) {
            setOptionId("")
        }
    })

    const exportToExcel = () => {
        let data = budgets
        data.map((e) => {
            e.updatedAt = new Date(e.updatedAt).toLocaleDateString()
            e.createdAt = new Date(e.createdAt).toLocaleDateString()
        })

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "exported_data.xlsx");
    };


    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* Add Budget Button */}
            <div className='flex justify-between'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Budget
                </button>
                <button onClick={exportToExcel}
                    className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex gap-x-1 justify-center items-center">
                    <FaFileExcel className='text-emerald-500'/>
                    <span>Export </span>
                </button>
            </div>

            {/* Budget Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Category</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Amount</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-sm font-medium uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {budgets.map((budget) => (
                            <tr key={budget._id} className="hover:bg-gray-50">
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">{budget.category}</td>
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">${budget.amount}</td>
                                <td className="px-2 sm:px-6 py-4 text-sm text-gray-800">
                                    {
                                        optionId === budget._id &&
                                        <div className='relative right-[70px] bottom-4 z-10'>
                                            <div className='flex flex-col bg-white border-solid border-2 border-gray-200 absolute items-start gap-y-2 rounded-md'>
                                                <button
                                                    onClick={() => handleEdit(budget)}
                                                    className="py-1 pl-2 pr-4 text-blue-600 hover:text-blue-800 hover:bg-gray-400 hover:rounded-md"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(budget._id)}
                                                    className="text-red-600 py-1 pl-2 pr-4 hover:text-red-800 hover:bg-gray-400 hover:rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    }
                                    <SlOptionsVertical onClick={(e) => {
                                        e.stopPropagation()
                                        setOptionId(budget._id)
                                    }} />

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Budget Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editBudget ? 'Edit Budget' : 'Add Budget'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={editBudget ? editBudget.category : newBudget.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={editBudget ? editBudget.amount : newBudget.amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
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
            )}
        </div>
    );
};

export default BudgetTable;
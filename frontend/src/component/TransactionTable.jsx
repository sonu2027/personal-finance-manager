// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { fetchTransaction } from '../databaseCall/fetchTransaction';

// const TransactionTable = () => {
//     const [transactions, setTransactions] = useState([]);

//     useEffect(() => {
//         fetchTransaction()
//             .then((res) => {
//                 setTransactions(res);
//             })
//             .catch((error) => {
//                 console.error('Error fetching transactions:', error);
//                 toast.error('Failed to fetch transactions');
//             })
//     }, []);

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h2>
//             <div className="overflow-x-auto bg-white rounded-lg shadow-md">
//                 <table className="min-w-full">
//                     <thead className="bg-blue-600 text-white">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-sm font-medium uppercase">Description</th>
//                             <th className="px-6 py-3 text-left text-sm font-medium uppercase">Amount</th>
//                             <th className="px-6 py-3 text-left text-sm font-medium uppercase">Type</th>
//                             <th className="px-6 py-3 text-left text-sm font-medium uppercase">Category</th>
//                             <th className="px-6 py-3 text-left text-sm font-medium uppercase">Date</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                         {transactions.map((transaction) => (
//                             <tr key={transaction._id} className="hover:bg-gray-50">
//                                 <td className="px-6 py-4 text-sm text-gray-800">{transaction.description}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-800">${transaction.amount}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-800">
//                                     <span
//                                         className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.type === 'income'
//                                             ? 'bg-green-100 text-green-800'
//                                             : 'bg-red-100 text-red-800'
//                                             }`}
//                                     >
//                                         {transaction.type}
//                                     </span>
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-gray-800">{transaction.category}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-800">
//                                     {new Date(transaction.date).toLocaleDateString()}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default TransactionTable;
























import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchTransaction } from '../databaseCall/fetchTransaction';

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchTransaction()
            .then((res) => {
                setTransactions(res);
            })
            .catch((error) => {
                console.error('Error fetching transactions:', error);
                toast.error('Failed to fetch transactions');
            })
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTransaction({ ...newTransaction, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     const token = localStorage.getItem('authToken');
        //     const response = await axios.post(
        //         '/api/transactions',
        //         { ...newTransaction, user: '64f1a2b3c8e9f0a1b2c3d4e6' },
        //         { headers: { Authorization: `Bearer ${token}` } }
        //     );
        //     setTransactions([...transactions, response.data.transaction]);
        //     toast.success('Transaction added successfully!');
        //     setIsModalOpen(false);
        //     setNewTransaction({
        //         description: '',
        //         amount: '',
        //         type: 'expense',
        //         category: '',
        //         date: new Date().toISOString().split('T')[0],
        //     });
        // } catch (error) {
        //     console.error('Error adding transaction:', error);
        //     toast.error('Failed to add transaction');
        // }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h2>

            {/* Add Transaction Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Add Transaction
            </button>

            {/* Transaction Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Date</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Add Transaction</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={newTransaction.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={newTransaction.amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <select
                                name="type"
                                value={newTransaction.type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <select
                                name="category"
                                value={newTransaction.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="income">Grocery</option>
                                <option value="expense">Entertainment</option>
                                <option value="expense">Travel</option>
                            </select>

                            {/* <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={newTransaction.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            /> */}

                            <input
                                type="date"
                                name="date"
                                value={newTransaction.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Add
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
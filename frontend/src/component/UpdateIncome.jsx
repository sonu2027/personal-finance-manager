import React from 'react'
import updateIncome from '../databaseCall/updateIncome';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getIncome } from '../databaseCall/getIncome';

function UpdateIncome({ setOpenIncomeUpdate }) {

    const [monthlyIncome, setMonthlyIncome] = useState(0)

    const handleSaveIncome = () => {

        if (monthlyIncome < 10000) {
            toast.error("Income should be greater than 10000")
            return
        }

        updateIncome(monthlyIncome)
            .then((res) => {
                toast.success("Income updated successfully")
                setOpenIncomeUpdate(false)
            })
            .catch((error) => {
                toast.success("Income updation failed, please try again")
            })
    };

    useEffect(() => {
        getIncome()
            .then((res) => {
                setMonthlyIncome(res.income)
            })
            .catch((error) => {

            })
    }, [])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Set Your Monthly Income
                </h2>
                <input
                    type="number"
                    placeholder="Enter monthly income"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                    onClick={handleSaveIncome}
                    className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300"
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default UpdateIncome
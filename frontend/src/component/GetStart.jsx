import React, { useState } from 'react';
import updateIncome from "../databaseCall/updateIncome.js"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const IncomeModal = ({ income, setIncome }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [monthlyIncome, setMonthlyIncome] = useState(0)

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navigate = useNavigate()

    const handleSaveIncome = () => {
        if(monthlyIncome<1 || monthlyIncome>10000000){
            toast.error("Income should be between 1 and 10000000")
            return
        }
        updateIncome(monthlyIncome)
            .then((res) => {
                setIncome(monthlyIncome)
                toast.success("Income updated successfully")
                navigate("/dashboard")
            })
            .catch((error) => {
                toast.success("Income updation failed, please try again")
            })
    };

    return (
        <div>
            {!isModalOpen && (
                <div>
                    <h1 className='text-center text-2xl text-slate-800 mt-8'>Welcome to the Personal finance manager</h1>
                    <div className='h-52 flex justify-center items-center'>
                        <button
                            onClick={openModal}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
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
            )}
        </div>
    );
};

export default IncomeModal;
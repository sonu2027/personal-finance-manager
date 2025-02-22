import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import updateIncome from "../databaseCall/updateIncome";
import { getIncome } from "../databaseCall/getIncome";
import Navbar from "../component/Navbar";
import toast from 'react-hot-toast';

function Dashboard() {
  const [income, setIncome] = useState(0);

  const navigate = useNavigate();

  // Calculate current time only once when the component mounts
  const currentTime = useMemo(() => Date.now() / 1000, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp < currentTime) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }
  }, [navigate, currentTime]);

  const handleSaveIncome = () => {
    updateIncome(income)
      .then((res) => {
        toast.success("Income updated successfully")
      })
      .catch((error) => {
        toast.success("Income updation failed, please try again")
      })
  };

  useEffect(() => {
    getIncome()
      .then((res) => {
        setIncome(res.income)
      })
      .catch((error) => {

      })
  }, [])


  return (
    <>
      <Navbar />

      <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Set Your Monthly Income</h2>
        <input
          type="number"
          placeholder="Enter your monthly income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSaveIncome}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Income
        </button>
      </div>

    </>
  )
}

export default Dashboard;
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { fetchTransactions } from '../databaseCall/fetchTransactions';
import { fetchBudget } from '../databaseCall/fetchBudget';
import Navbar from "../component/Navbar.jsx"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getIncome } from "../databaseCall/getIncome.js"
import GetStart from "../component/GetStart.jsx"
import UpdateIncome from '../component/UpdateIncome.jsx';
import Loader from '../component/Loader.jsx';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [openIncomeUpdate, setOpenIncomeUpdate] = useState(false)

  //  Calculating current time only once when the component mounts
  const currentTime = useMemo(() => Date.now() / 1000, []);

  const navigate = useNavigate()

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

  useEffect(() => {
    getIncome()
      .then((res) => {
        setIncome(res.income)
      })
      .catch((error) => {

      })
  }, [openIncomeUpdate])

  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      console.log("window.innerWidth: ", window.innerWidth);
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleaning up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculating total income and expenses
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


  const COLORS = [
    "#FF5733", // Vibrant orange
    "#33FF57", // Bright lime green
    "#3357FF", // Deep blue
    "#FF33A1", // Hot pink
    "#33FFF5", // Cyan-like blue
    "#F5FF33", // Bright yellow
    "#8A33FF", // Rich purple
    "#33FF8A", // Mint green
    "#FF338A", // Magenta pink
    "#33A1FF", // Sky blue
    "#FF8A33", // Warm orange
    "#8AFF33", // Neon green
    "#338AFF", // Medium blue
    "#FF33F5", // Vivid pink
    "#33FF33", // Pure green
    "#F533FF", // Bright purple
    "#33F5FF", // Light teal
    "#FF3333", // Bold red
    "#3333FF", // Classic blue
    "#FFFF33", // Lemon yellow
  ];

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      {
        income == 0 ?
          <GetStart income={income} setIncome={setIncome} />
          :
          <div>
            <Navbar setOpenIncomeUpdate={setOpenIncomeUpdate} />
            {
              openIncomeUpdate && <UpdateIncome setOpenIncomeUpdate={setOpenIncomeUpdate} />
            }
            <div className="p-6 bg-gray-100 min-h-screen">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700">Total Income</h2>
                  <p className="text-2xl font-bold text-green-600">₹{totalIncome}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700">Total Expenses</h2>
                  <p className="text-2xl font-bold text-red-600">₹{totalExpenses}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700">Net Balance</h2>
                  <p className="text-2xl font-bold text-blue-600">₹{income + totalIncome - totalExpenses}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700">Monthly salary</h2>
                  <p className="text-2xl font-bold text-blue-600">₹{income}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Spending by Category</h2>
                  <div className='flex justify-center items-center'>
                    {
                      chartData.length > 0 ?
                        <PieChart width={400} height={screenWidth > 450 ? 350 : 300}>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={screenWidth > 450 ? 125 : 100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            layout="horizontal" // Display legend items horizontally
                            wrapperStyle={{
                              display: 'flex', // Use flexbox for layout
                              flexWrap: 'wrap', // Allow wrapping of legend items
                              justifyContent: 'center', // Center the legend items
                              width: '100%', // Ensure the legend takes full width
                              maxWidth: '300px', // Limit the maximum width of the legend
                              margin: '0 auto', // Center the legend horizontally
                            }}
                            formatter={(value, entry, index) => (
                              <span style={{ width: '33%', textAlign: 'center' }}>
                                {value} {/* Display the legend item */}
                              </span>
                            )}
                          />
                        </PieChart>
                        :
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                          <div className="text-gray-500 text-lg mb-2">
                            No spending data available yet
                          </div>
                          <div className="text-gray-400 text-sm">
                            Start adding your expenses to see the breakdown here
                          </div>
                          <svg
                            className="w-20 h-20 mt-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                    }
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Income vs Expenses vs Net balance</h2>
                  <BarChart width={screenWidth > 450 ? 400 : screenWidth - 100} height={300} data={[{ name: 'Income', value: totalIncome }, { name: 'Expense', value: totalExpenses }, { name: 'Net balance', value: income + totalIncome - totalExpenses }]} >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" barSize={40} />
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
};

export default Dashboard;
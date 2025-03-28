import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

const Navbar = ({ setOpenIncomeUpdate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate()

    const toggleMenu = (e) => {
        e.stopPropagation()
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = (e) => {
        localStorage.removeItem("authToken");
        navigate("/login")
    }

    window.addEventListener("click", (e) => {
        setIsMenuOpen(false)
    })

    return (
        <nav className="bg-blue-600 p-4 shadow-lg sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-white text-2xl font-bold">
                    Personal Finance Manager
                </Link>

                {
                    !isMenuOpen && <RxHamburgerMenu onClick={toggleMenu} className="text-white text-2xl lg:hidden hover:cursor-pointer" />
                }

                {/* Desktop Menu */}
                <div className="hidden lg:flex space-x-6">
                    <Link to="/dashboard" className="text-white font-medium hover:text-blue-200">
                        Dashboard
                    </Link>
                    <Link to="/transaction" className="text-white font-medium hover:text-blue-200">
                        Transactions
                    </Link>
                    <Link to="/budget" className="text-white font-medium hover:text-blue-200">
                        Budgets
                    </Link>
                    <button onClick={() => setOpenIncomeUpdate(true)} className="block text-white font-medium px-4 hover:text-blue-200">Update salary</button>
                    <button onClick={() => handleLogout()} className="block text-white font-medium px-4 hover:text-blue-200">Logout</button>
                </div>
            </div>

            <div onClick={(e) => e.stopPropagation()} className={`lg:hidden fixed top-0 left-0  transition-all duration-600 ease-in-out transform ${isMenuOpen ? 'translate-x-0 bg-slate-900 h-[100vh] w-[15rem] sm:w-[20rem]' : '-translate-x-100 w-0 h-0'}`}>
                <button className='w-full flex justify-end pt-4 pb-2 px-3'>
                    <RxCross2 onClick={toggleMenu} className="text-white text-3xl hover:cursor-pointer hover:text-blue-600 font-medium" />
                </button>
                <Link
                    to="/dashboard"
                    className="block text-white mt-2 mx-2 font-medium py-2 px-4  rounded-sm hover:bg-blue-500"
                    onClick={toggleMenu}
                >
                    Dashboard
                </Link>
                <Link
                    to="/transaction"
                    className="block text-white rounded-sm font-medium mx-2 py-2 px-4 hover:bg-blue-500"
                    onClick={toggleMenu}
                >
                    Transactions
                </Link>
                <Link
                    to="/budget"
                    className="block text-white rounded-sm font-medium mx-2 py-2 px-4 hover:bg-blue-500"
                    onClick={toggleMenu}
                >
                    Budgets
                </Link>
                <div onClick={() => setOpenIncomeUpdate(true)} className="block text-white font-medium  px-4 py-2 mx-2 rounded-sm hover:bg-blue-500 text-left hover:cursor-pointer">Update salary</div>
                <div onClick={() => handleLogout()} className="block text-white font-medium py-2 px-4 mx-2 hover:bg-blue-500 rounded-sm text-left hover:cursor-pointer">Logout</div>
            </div>
        </nav>
    );
};

export default Navbar;
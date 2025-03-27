import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

const Navbar = ({ setOpenIncomeUpdate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = (e) => {
        localStorage.removeItem("authToken");
        navigate("/login")
    }

    return (
        <nav className="bg-blue-600 p-4 shadow-lg sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-white text-2xl font-bold">
                    Personal Finance Manager
                </Link>

                {
                    !isMenuOpen ? <RxHamburgerMenu onClick={toggleMenu} className="text-white text-2xl lg:hidden hover:cursor-pointer" /> : <RxCross2 onClick={toggleMenu} className="text-white text-2xl lg:hidden hover:cursor-pointer" />
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
                    <button onClick={() => setOpenIncomeUpdate(true)} className="block text-white font-medium px-4 hover:bg-blue-500">Update salary</button>
                    <button onClick={() => handleLogout()} className="block text-white font-medium px-4 hover:bg-blue-500">Logout</button>
                </div>
            </div>

            <div className={`lg:hidden mt-4 transition-all duration-600 ease-in-out transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-100 h-0'}`}>
                <Link
                    to="/dashboard"
                    className="block text-white font-medium py-2 px-4 hover:bg-blue-500"
                    onClick={toggleMenu}
                >
                    Dashboard
                </Link>
                <Link
                    to="/transaction"
                    className="block text-white font-medium py-2 px-4 hover:bg-blue-500"
                    onClick={toggleMenu}
                >
                    Transactions
                </Link>
                <Link
                    to="/budget"
                    className="block text-white font-medium py-2 px-4 hover:bg-blue-500"
                    onClick={toggleMenu}
                >
                    Budgets
                </Link>
                <button onClick={() => setOpenIncomeUpdate(true)} className="block text-white font-medium px-4 py-2 hover:bg-blue-500 w-full text-left hover:cursor-pointer">Update salary</button>
                <button onClick={() => handleLogout()} className="block text-white font-medium py-2 px-4 hover:bg-blue-500 w-full text-left hover:cursor-pointer">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
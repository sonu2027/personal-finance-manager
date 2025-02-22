import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
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
        <nav className="bg-blue-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo/Brand */}
                <Link to="/dashboard" className="text-white text-2xl font-bold">
                    Personal Finance Manager
                </Link>

                {/* Hamburger Menu (Mobile) */}
                <button
                    onClick={toggleMenu}
                    className="text-white focus:outline-none lg:hidden"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden lg:flex space-x-6">
                    <Link to="/dashboard" className="text-white hover:text-blue-200">
                        Dashboard
                    </Link>
                    <Link to="/transaction" className="text-white hover:text-blue-200">
                        Transactions
                    </Link>
                    <Link to="/budget" className="text-white hover:text-blue-200">
                        Budgets
                    </Link>
                    <button onClick={() => handleLogout()} className="block text-white py-2 px-4 hover:bg-blue-500">Logout</button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden mt-4">
                    <Link
                        to="/dashboard"
                        className="block text-white py-2 px-4 hover:bg-blue-500"
                        onClick={toggleMenu}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/transaction"
                        className="block text-white py-2 px-4 hover:bg-blue-500"
                        onClick={toggleMenu}
                    >
                        Transactions
                    </Link>
                    <Link
                        to="/budget"
                        className="block text-white py-2 px-4 hover:bg-blue-500"
                        onClick={toggleMenu}
                    >
                        Budgets
                    </Link>
                    <button onClick={() => handleLogout()} className="block text-white py-2 px-4 hover:bg-blue-500">Logout</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
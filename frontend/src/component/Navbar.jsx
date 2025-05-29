import React, { use, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

const Navbar = ({ setOpenIncomeUpdate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigate = useNavigate()
    const location = useLocation();
    const routeRef = useRef([])
    console.log(location.pathname);

    useEffect(() => {
        if (location.pathname === "/dashboard") {
            routeRef.current[0].style.textDecoration = "underline";
            routeRef.current[0].style.fontSize = "1.2rem";
            routeRef.current[3].style.background = "blue";
        }
        else if (location.pathname === "/transaction") {
            routeRef.current[1].style.textDecoration = "underline";
             routeRef.current[1].style.fontSize = "1.2rem";
            routeRef.current[4].style.background = "blue";
        }
        else if (location.pathname === "/budget") {
            routeRef.current[2].style.textDecoration = "underline";
             routeRef.current[2].style.fontSize = "1.2rem";
            routeRef.current[5].style.background = "blue";
        }
        else if( location.pathname === "/recoverpassword") {
             routeRef.current[6].style.background = "blue";
        }
    }, [])


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
        setIsProfileOpen(false);
    })

    const handleOpenProfile = (e) => {
        e.stopPropagation();
        setIsProfileOpen(!isProfileOpen);
    }

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
                <div className="hidden lg:flex space-x-10">
                    <Link ref={(e) => routeRef.current[0] = e} to="/dashboard" className="text-white font-medium hover:text-blue-200">
                        Dashboard
                    </Link>
                    <Link ref={(e) => routeRef.current[1] = e} to="/transaction" className="text-white font-medium hover:text-blue-200">
                        Transactions
                    </Link>
                    <Link ref={(e) => routeRef.current[2] = e} to="/budget" className="text-white font-medium hover:text-blue-200">
                        Budgets
                    </Link>

                    <div className='flex justify-center items-center text-gray-50'>
                        <CgProfile onClick={handleOpenProfile} className='text-3xl' />
                        {
                            isProfileOpen && (
                                <div className='absolute top-14 right-6 bg-white text-black p-2 rounded shadow-lg flex flex-col gap-2 items-start'>
                                    <button onClick={() => navigate("/recoverpassword")} className="text-blue-600 font-medium px-4 hover:text-blue-200">
                                        Change Password
                                    </button>
                                    <button onClick={() => setOpenIncomeUpdate(true)} className="block text-blue-600 font-medium px-4 hover:text-blue-200">Update salary</button>
                                    <button onClick={() => handleLogout()} className="block text-blue-500 font-medium px-4 hover:text-blue-200">Logout</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            <div onClick={(e) => e.stopPropagation()} className={`lg:hidden fixed top-0 left-0  transition-all duration-600 ease-in-out transform ${isMenuOpen ? 'translate-x-0 bg-slate-900 h-[100vh] w-[15rem] sm:w-[20rem]' : '-translate-x-100 w-0 h-0'}`}>
                <button className='w-full flex justify-end pt-4 pb-2 px-3'>
                    <RxCross2 onClick={toggleMenu} className="text-white text-3xl hover:cursor-pointer hover:text-blue-600 font-medium" />
                </button>
                <Link
                    ref={(e) => routeRef.current[3] = e}
                    to="/dashboard"
                    className="block text-white mt-2 font-medium py-2 px-4 hover:bg-blue-500 border-y-[1px] border-solid border-gray-700"
                    onClick={toggleMenu}
                >
                    Dashboard
                </Link>
                <Link
                    ref={(e) => routeRef.current[4] = e}
                    to="/transaction"
                    className="block text-white font-medium py-2 px-4 hover:bg-blue-500 border-b-[1px] border-solid border-gray-700"
                    onClick={toggleMenu}
                >
                    Transactions
                </Link>
                <Link
                    ref={(e) => routeRef.current[5] = e}
                    to="/budget"
                    className="block text-white font-medium py-2 px-4 hover:bg-blue-500 border-b-[1px] border-solid border-gray-700"
                    onClick={toggleMenu}
                >
                    Budgets
                </Link>
                <Link
                ref={(e) => routeRef.current[6] = e}
                    to="/recoverpassword"
                    className="block text-white font-medium py-2 px-4 hover:bg-blue-500 border-b-[1px] border-solid border-gray-700"
                    onClick={toggleMenu}
                >
                    Update Password
                </Link>
                <div onClick={() => setOpenIncomeUpdate(true)} className="block text-white font-medium  px-4 py-2 hover:bg-blue-500 text-left hover:cursor-pointer border-b-[1px] border-solid border-gray-700">Update salary</div>
                <div onClick={() => handleLogout()} className="block text-white font-medium py-2 px-4 hover:bg-blue-500 text-left hover:cursor-pointer border-b-[1px] border-solid border-gray-700">Logout</div>
            </div>
        </nav>
    );
};

export default Navbar;
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from './pages/Dashboard.jsx'
import Transaction from './pages/Transaction.jsx'
import Budget from './pages/Budget.jsx'

function Routing() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/transaction' element={<Transaction />} />
            <Route path='/budget' element={<Budget />} />
        </Routes>
    )
}

export default Routing
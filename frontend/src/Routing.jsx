import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './component/Login.jsx'

function Routing() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
        </Routes>
    )
}

export default Routing
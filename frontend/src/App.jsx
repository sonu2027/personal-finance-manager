import React from 'react'
import Routing from './Routing.jsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {

  const navigate=useNavigate()

  useEffect(()=>{
    navigate("/login")
  }, [])

  return (
    <Routing />
  )
}

export default App
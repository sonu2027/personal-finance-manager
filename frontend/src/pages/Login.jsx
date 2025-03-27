import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import loginUser from '../databaseCall/loginUser';
import toast from 'react-hot-toast';

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const [loader, setLoader] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard")
    }
  }, [])


  const handleSubmit = (e) => {
    setLoader(!loader)
    e.preventDefault();
    loginUser(email, password)
      .then((res) => {
        if (res.message == "Email not found") {
          toast.error("Email not found")
        }
        else if (res.message == "Incorrect password") {
          toast.error("Incorrect password")
        }
        else if (res.token) {
          localStorage.setItem('authToken', res.token);
          console.log("Token stored in localStorage: ", res.token);
          navigate("/dashboard")
        }
      })
      .catch((error) => {
        setLoader(!loader)
        toast.error("Something went wrong")
      })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Personal Finance Manager
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              value={password}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          {
            !loader ?
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </button>
              :
              <div
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center"
              >
                <div className='h-6 w-6 rounded-full border-4 border-solid border-y-white border-r-white border-l-violet-950 animate-spin'></div>
              </div>
          }
          <div className='mt-6'>
            <div className='flex gap-x-2'>
              <div>Don't have an account?</div>
              <button className='text-blue-700 font-medium hover:cursor-pointer' onClick={() => navigate("/register")}>Register</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
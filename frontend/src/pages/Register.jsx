import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import registerUser from '../databaseCall/registerUser';
import sendEmailVerificationOTP from '../databaseCall/sendEmailVerificationOTP';

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [OTP, setOTP] = useState("")
  const [otp, setotp] = useState("")

  const handleChange = (e) => {
    if (OTP.length == 4) {
      return
    }
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password should be atleast 8 character');
      return;
    }
    sendEmailVerificationOTP(formData.email)
      .then((OTP) => {
        console.log("OTP is: ", OTP);
        toast.success("OTP successfully sent to your email")
        const newOtp = String(OTP)
        setOTP(newOtp)
      })
      .catch((error) => {
        console.log("Error while sending otp: ", error)
        toast.error("Error while sending otp!")
      })
  };

  useEffect(() => {
    if (otp.length == 4 && otp == OTP) {
      registerUser({ fullName: formData.fullName, email: formData.email, password: formData.password })
        .then((res) => {
          toast.success("Registartion successfull")
          setTimeout(() => {
            navigate("/login")
          }, 2000)
        })
        .catch((error) => {
          console.log("Error while Registartion is: ", error)
          toast.error("Registartion failed")
        })
    }
  }, [otp])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Personal Finance Manager
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {
            OTP.length == 4 && <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              {/* <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setotp(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              /> */}
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  // Ensure the value is exactly 4 characters long
                  if (value.length <= 4) {
                    setotp(value);
                  }
                }}
                maxLength={4} // Ensures the input cannot exceed 4 characters
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          }
          <div className='mb-6'>
            <div className='flex gap-x-2'>
              <div>Have an account?</div>
              <button className='text-blue-700 font-medium' onClick={() => navigate("/login")}>Login</button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
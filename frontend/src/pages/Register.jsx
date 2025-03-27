import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import registerUser from '../databaseCall/registerUser';
import sendEmailVerificationOTP from '../databaseCall/sendEmailVerificationOTP';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [OTP, setOTP] = useState('');
  const [otp, setOtp] = useState('');
  const [loader, setLoader] = useState(false)

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full Name is required')
      .min(3, 'Full Name must be at least 3 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setLoader(true)
    e.preventDefault();

    try {
      // Validate the form data
      await validationSchema.validate(formData, { abortEarly: false });

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setLoader(false)
        return;
      }

      const generatedOTP = await sendEmailVerificationOTP(formData.email);
      toast.success('OTP successfully sent to your email');
      setOTP(String(generatedOTP));
      setLoader(false)
    } catch (error) {
      setLoader(false)
      if (error.inner) {
        error.inner.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error('Error while sending OTP');
      }
    }
  };

  useEffect(() => {
    if (otp.length === 4 && otp === OTP) {
      registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      })
        .then(() => {
          toast.success('Registration successful');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        })
        .catch((error) => {
          console.error('Error during registration:', error);
          toast.error('Registration failed');
        });
    }
  }, [otp, OTP, formData, navigate]);

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

          {OTP.length === 4 && (
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 4) {
                    setOtp(value);
                  }
                }}
                maxLength={4}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {
            !loader ?
              <button disabled={OTP.length == 4}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register
              </button>
              :
              <div
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center"
              >
                <div className='h-6 w-6 rounded-full border-4 border-solid border-y-white border-r-white border-l-violet-950 animate-spin'></div>
              </div>
          }

          <div className="mt-6">
            <div className="flex gap-x-2">
              <div>Have an account?</div>
              <button
                type="button"
                className="text-blue-700 font-medium hover:cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
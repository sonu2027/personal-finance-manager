import React, { useState } from 'react';
import sendEmailVerificationOTP from '../databaseCall/sendEmailVerificationOTP';
import toast from 'react-hot-toast';
import { verifyEmail } from '../databaseCall/verifyEmail.js';
import { updatePassword } from '../databaseCall/updatePassword.js';
import { useNavigate } from 'react-router-dom';

function RecoverPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate()

    const generateOtp = () => {
        setLoader(true);
        sendEmailVerificationOTP(email)
            .then((otp) => {
                toast.success(`OTP sent to ${email}`);
                setOtp(otp);
                setStep(2);
                setLoader(false);
            })
            .catch((error) => {
                console.error('Failed to send OTP');
                toast.error('Failed to send OTP. Please try again.');
                return;
            })
    };

    const handleEmailKeyPress = (e) => {
        if (e.key === 'Enter') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            verifyEmail(email)
                .then(() => {
                    generateOtp();
                })
                .catch((error) => {
                    console.log("Error is: ", error);
                    toast.error('Email verification failed. Please try again.');
                })
        }
    };


    const handleVerifyOtp = () => {
        if (Number(enteredOtp) === otp) {
            setError('');
            setStep(3);
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    const validatePassword = (pwd) => {
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        const hasNumber = /\d/.test(pwd);
        const hasUppercase = /[A-Z]/.test(pwd);
        const hasLowercase = /[a-z]/.test(pwd);
        const isLongEnough = pwd.length >= 8;

        return hasSpecialChar && hasNumber && hasUppercase && hasLowercase && isLongEnough;
    };

    const handleUpdatePassword = () => {
        if (password !== rePassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            setError(
                'Password should include at least one special character, one number, one uppercase letter, one lowercase letter and must be at least 8 characters long.'
            );
            return;
        }

        setError('');
        updatePassword(email, password)
            .then((message) => {
                toast.success('Password updated successfully!');
                console.log("message: ", message);
                navigate(-1);
            })
            .catch((error) => {
                toast.error('Failed to update password. Please try again.');
                setError('Failed to update password. Please try again.');
            })
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
                {step === 1 && (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Enter your email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleEmailKeyPress}
                        />
                        {
                            loader && <div className='flex justify-center items-center mt-4'>
                                <div className='h-8 w-8 rounded-full animate-spin border-2 border-solid border-y-blue-600 border-t-blue-600 font-bold text-4xl'>.</div>
                            </div>
                        }
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Enter OTP sent to your email</label>
                        <input
                            type="text"
                            maxLength={4}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter 4-digit OTP"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        <button
                            className="w-full bg-blue-500 text-white p-2 mt-3 rounded hover:bg-blue-600"
                            onClick={handleVerifyOtp}
                        >
                            Verify OTP
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-3">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Enter Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Re-enter Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            onClick={handleUpdatePassword}
                        >
                            Update Password
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecoverPassword;

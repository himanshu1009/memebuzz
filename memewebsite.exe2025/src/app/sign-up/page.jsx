'use client'

import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CustomSidebar from '@/components/SideBar';
import toast from 'react-hot-toast';
import { set } from 'date-fns';
import { Eye, EyeOff } from "lucide-react"; // Icons for show/hide
import Image from 'next/image';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isotpsending, setIsOtpSending] = useState(false);
  const [isotpsend, setIsOtpSend] = useState(false);
  const [otp, setOtp] = useState('');
  const [isoptverified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        email: email.toLowerCase(),
        password,
        otp,
      });
      console.log('User registered successfully:', response.data);
      toast.success('User registered successfully');
      // Redirect to the sign-in page
      router.push('/sign-in');
    } catch (error) {
      console.log('Error verifying OTP:', error);
      setError(error.response.data.message);
    }
  };
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validate password
    if (!passwordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters, include a letter, a number, and a special character.");
    } else {
      setError("");
    }
  };
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      toast.error('Email and password are required')
      return;
    }
    if (!email.includes('@')) {
      setError('Invalid email');
      toast.error('Invalid email')
      return;
    }
    setIsOtpSending(true);
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup/send-otp`, {
      email: email.toLowerCase(),
    }).then((response) => {
      console.log('OTP sent successfully:', response.data);
      setIsOtpSending(false);
      setIsOtpSend(true);
      toast.success('OTP sent successfully');
      setError('');
      // Redirect to the OTP verification page
    }).catch((error) => {
      setIsOtpSending(false);
      console.log('Error requesting OTP:', error);
      toast.error(error?.response?.data?.error);
    });

  };

  return (<>    {isMobile&&<header className="fixed inset-0  w-full bg-black text-white text-center py-4">
      <div className="flex justify-between mx-2 md:mx-4 lg:mx-16"> 

      <Image src="/exe.png" alt="logo" width={25} height={25} />
      <h1 className="text-2xl mx-auto text-center justify-center  font-bold">MemeWebsite</h1>
      <Image src="/exe.png" alt="logo" width={25} height={25} />
      </div>
    </header>}
    <div className="flex">

      <div className="flex-1 flex items-center justify-center min-h-screen bg-black">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-white">Sign Up</h1>
          {error && <p className="text-red-500">{error}</p>}
          {isotpsend && !isoptverified ? <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <p className='text-sm text-yellow-500'>Please Check Your Spam Folder Also!</p>
              <label className="block text-gray-300">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white bg-opacity-20 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-400 hover:to-purple-600"
            >
              Verify OTP
            </button>
          </form> :

            <form onSubmit={handleRequestOtp}>
              <div className="mb-4">
                <label className="block text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white bg-opacity-20 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Password</label>
                <div className='flex gap-1'>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white bg-opacity-20 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className=" text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isotpsending || error} // Disabled if OTP is sending or error exists
                className="w-full p-2 rounded-lg bg-gradient-to-r disabled:bg-slate-600 from-purple-500 to-purple-700 text-white hover:from-purple-400 hover:to-purple-600"
              >
                {isotpsending ? <h1>Requesting OTP</h1> : <h1>Request OTP</h1>}
              </button>
            </form>}
          <hr className="my-4 border-gray-300" />
          <p className="text-center text-gray-300">
            Already have an account?{' '}
            <a href="/sign-in" className="text-purple-500">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div></>
  );
}

export default SignUpPage;
'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CustomSidebar from '@/components/SideBar';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { Eye, EyeOff } from "lucide-react"; // Icons for show/hide

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
      email: email.toLowerCase(),
      password,
    }).then((response) => {
      toast.success('User signed in successfully');
      console.log('User signed in successfully:', response.data);
      // Save the token in localStorage or cookies
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', (response.data.data.user._id));
      router.push('/');

    }).catch((error) => {
      console.log('Error signing in user:', error);
      toast.error(error?.response?.data?.error?.explanation || error?.response?.data?.error || 'An error occurred');

    });

    // Redirect to the home page or another protected page


  };

  return (
    <>    {isMobile && <header className="fixed inset-0  w-full bg-black text-white text-center py-4">
      <div className="flex justify-between mx-2 md:mx-4 lg:mx-16">

        <Image src="/exe.png" alt="logo" width={25} height={25} />
        <h1 className="text-2xl mx-auto text-center justify-center  font-bold">MemeWebsite</h1>
        <Image src="/exe.png" alt="logo" width={25} height={25} />
      </div>
    </header>}
      <div className="flex">
        {/* <CustomSidebar /> */}
        <div className="flex-1 flex items-center justify-center min-h-screen bg-black">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center text-white">Sign In</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white bg-opacity-20 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Password</label>
                <div className='flex gap-1'>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                className="w-full mt-5 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-400 hover:to-purple-600"
              >
                Sign In
              </button>
            </form>

            <hr className="my-4 border-gray-300" />
            <div className="text-center mt-4 flex items-center justify-center">
              <p className="text-gray-300">Don't have an account?</p>
              <a href="/sign-up" className="text-purple-500 hover:text-purple-300">Sign Up</a>
            </div>
          </div>
        </div >
      </div ></>
  );
}

export default SignInPage;
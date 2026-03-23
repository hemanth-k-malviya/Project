"use client"
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice';

export default function Login() {
    const [registerLoading, setRegisterLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [show, setShow] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const register = (e) => {
        e.preventDefault();
        setRegisterLoading(true);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, e.target)
            .then((result) => {
                if (result.data._status === true) {
                    toast.success(result.data._message);
                    setRegisterLoading(false);
                    Cookies.set('user_login', result.data._token);
                    dispatch(setToken(result.data._token));
                    router.push('/');
                } else {
                    if (result.data._error && result.data._error.email) {
                        toast.error(result.data._error.email);
                        setRegisterLoading(false);
                    } else {
                        toast.error(result.data._message);
                        setRegisterLoading(false);
                    }

                }

            })
            .catch(() => {
                toast.error('Something went wrong!')
                setRegisterLoading(false);
            })
    }
    const login = (e) => {
        e.preventDefault();
        setLoginLoading(true);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, e.target)
            .then((result) => {
                if (result.data._status === true) {
                    toast.success(result.data._message);
                    setLoginLoading(false);
                    Cookies.set('user_login', result.data._token);
                    dispatch(setToken(result.data._token));
                    router.push('/');
                } else {
                    toast.error(result.data._message);
                    setLoginLoading(false);
                }

            })
            .catch(() => {
                toast.error('Something went wrong!')
                setLoginLoading(false);
            })
    }

    return (
        <>
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                <p className='text-[28px] sm:text-[34px] md:text-[40px] font-bold text-center'> My Account</p>
                <div className='flex justify-center' >
                    <Link href={'/'}><p className="text-[16px] hover:text-[#C09578]"> Home </p></Link>  
                    <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
                    <p className="text-[16px] text-[#C09578]">My Account</p>
                </div>

                {/* border */}
                <div className='border border-gray-200 m-8'></div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-6 my-13">
                    <div className="border border-gray-300 rounded p-6">
                        <p className='text-[28px] text-center mb-4 font-bold'>Login</p>
                        <form onSubmit={login} className="max-w-sm mx-auto">
                            <div className="mb-4">
                                <label className='block text-sm font-medium mb-1'>Email *</label>
                                <input type="email" placeholder='Email Address' name='email' required className='block w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#C09578]' />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Password *
                                </label>

                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        placeholder="Password"
                                        name="password"
                                        required
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#C09578]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {show ? <BiHide size={20} /> : <BiShow size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button type="submit" className='bg-[#C09578] hover:bg-[#ad8060] text-white rounded px-6 py-2 
                               ' disabled={
                                        loginLoading
                                            ?
                                            'disabled'
                                            :
                                            ''
                                    }>
                                    {
                                        loginLoading
                                            ?
                                            'Loading...'
                                            :
                                            'Login'
                                    }
                                </button>
                                <Link href={'/forgot-password'} className='text-sm text-gray-600 hover:underline'>Forgot Password?</Link>
                            </div>
                        </form>
                    </div>

                    {/* Register */}
                    <div className="border border-gray-300 rounded p-6">
                        <p className='text-[28px] text-center mb-4 font-bold'>Register</p>
                        <form onSubmit={register} className="max-w-sm mx-auto">
                            <div className="mb-4">
                                <label className='block text-sm font-medium mb-1'>Email *</label>
                                <input type="email" placeholder='Email Address' name='email' required className='block w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#C09578]' />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Password *
                                </label>

                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        placeholder="Password"
                                        name="password"
                                        required
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#C09578]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {show ? <BiHide size={20} /> : <BiShow size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                <button type="submit" className='bg-[#C09578] hover:bg-[#ad8060] text-white rounded px-6 py-2 
                               ' disabled={
                                        registerLoading
                                            ?
                                            'disabled'
                                            :
                                            ''
                                    }>
                                    {
                                        registerLoading
                                            ?
                                            'Loading...'
                                            :
                                            'Register'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 my-3"></div>
        </>
    )
}

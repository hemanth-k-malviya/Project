'use client'
import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [resetLoading, setResetLoading] = useState(false);
    const [shownew, setShowNew] = useState(false);
    const [show, setShow] = useState(false);
    const router = useRouter()

    const params = useParams();
    const token = params?.token;

    const handleResetPassword = (e) => {
        e.preventDefault();
        setResetLoading(true);

        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/reset-password`, e.target)
            .then((result) => {
                if (result.data._status === true) {
                    toast.success(result.data._message);
                    setResetLoading(false);
                    e.target.reset();
                    // Redirect to login page after successful reset
                    setTimeout(() => {
                        router.push('/login-register');
                    }, 2000);
                } else {
                    toast.error(result.data._message);
                    setResetLoading(false);
                }
            })
            .catch((error) => {
                toast.error('Something went wrong!');
                setResetLoading(false);
            })
    }

    return (
        <>
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                <p className='text-[40px] font-bold text-center'>Reset Password</p>
                <div className='flex justify-center' >
                    <p className="text-[16px] hover:text-[#C09578]"> Home </p>
                    <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
                    <p className="text-[16px] text-[#C09578]">Reset Password</p>
                </div>

                {/* border */}
                <div className='border border-gray-200 m-8'></div>

                <div className="grid md:grid-cols-1 grid-cols-1 gap-6 my-13">
                    <div className="border border-gray-300 rounded p-6">
                        <p className='text-[28px] text-center mb-4 font-bold'>Reset Password</p>
                        <form onSubmit={handleResetPassword} className="max-w-sm mx-auto">
                            <input type="hidden" name='token' value={token || ''} />

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    New Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={shownew ? "text" : "password"}
                                        placeholder="Enter new password"
                                        name="new_password"
                                        required
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#C09578]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!shownew)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {shownew ? <BiHide size={20} /> : <BiShow size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        name="confirm_password"
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
                                <button
                                    type="submit"
                                    className='bg-[#C09578] hover:bg-[#ad8060] text-white rounded px-6 py-2'
                                    disabled={
                                        resetLoading
                                            ?
                                            'disabled'
                                            :
                                            ''
                                    }
                                >
                                    {
                                        resetLoading
                                            ?
                                            'Loading...'
                                            :
                                            'Reset Password'
                                    }
                                </button>
                                <Link href="/login-register" className='text-sm text-gray-600 hover:underline'>Back to Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 my-3"></div>
        </>
    )
}

'use client'
import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ForgotPassword() {
    const [forgotLoading, setforgotLoading] = useState(false);

    const ForgotPassword = (e) => {
        e.preventDefault();
        setforgotLoading(true);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`, e.target)
            .then((result) => {
                if (result.data._status === true) {
                    toast.success(result.data._message);
                    setforgotLoading(false);
                    e.target.reset()
                } else {
                    if (result.data._error && result.data._error.email) {
                        toast.error(result.data._message);
                        setforgotLoading(false);
                    } else {
                        toast.error(result.data._message);
                        setforgotLoading(false);
                    }
                }
            })
            .catch(() => {
                toast.error('Something went wrong!')
                setforgotLoading(false);
            })
    }
    return (
        <>
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                <p className='text-[28px] sm:text-[34px] md:text-[40px] font-bold text-center'>Forgot Password</p>
                <div className='flex justify-center' >
                  <Link href={'/'}> <p className="text-[16px] hover:text-[#C09578]"> Home </p></Link>   
                    <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
                    <p className="text-[16px] text-[#C09578]">Forgot Password</p>
                </div>

                {/* border */}
                <div className='border border-gray-200 m-8'></div>

                <div className="grid md:grid-cols-1 grid-cols-1 gap-6 my-13">
                    <div className="border border-gray-300 rounded p-6">
                        <p className='text-[28px] text-center mb-4 font-bold'>Forgot Password</p>
                        <form onSubmit={ForgotPassword} className="max-w-sm mx-auto">
                            <div className="mb-4 ">
                                <label className='block text-sm font-medium mb-1'>Email *</label>
                                <input type="email" placeholder='Email Address' name='email' required className='block w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#C09578]' />
                            </div>

                            <div className="flex items-center justify-between">
                                <button type="submit" className='bg-[#C09578] hover:bg-[#ad8060] text-white rounded px-6 py-2 
                                   ' disabled={
                                        forgotLoading
                                            ?
                                            'disabled'
                                            :
                                            ''
                                    }>
                                    {
                                        forgotLoading
                                            ?
                                            'Loading...'
                                            :
                                            'Forgot Password'
                                    }
                                </button>
                                <a href="#" className='text-sm text-gray-600 hover:underline'>Forgot Password?</a>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

            <div className="border border-gray-200 my-3"></div>
        </>
    )
}

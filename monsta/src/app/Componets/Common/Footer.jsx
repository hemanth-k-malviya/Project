"use client"
import Link from 'next/link';
import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";

export default function Footer() {
    return (
        <>
            <div className='shadow  w-full '>
                <div className='grid lg:grid-cols-[30%_20%_20%_30%] p-[45px] max-w-[1450px] justify-center   mx-auto  gap-[20px]'>


                    <ul className='leading-[30px] text-[rgb(90,90,90)] text-[15px]  '>
                        <li className='font-bold text-[18px] pb-[15px] text-black'>Contact Us</li>


                        <li>Address: Claritas est etiam processus dynamicus</li >

                        <li>  Phone: 9781234560</li>

                        <li>  Email: furniture@gmail.com</li>


                        <li className='grid grid-cols-6 max-w-[80%] mt-[5px] opacity-[0.6]'>
                            <FaFacebookF className='text-[35px] p-[5px] border rounded-[20px] ' />
                            <FaInstagram className='text-[35px] p-[5px] border rounded-[20px] ' />
                            <FaTwitter className='text-[35px] p-[5px] border rounded-[20px] ' />
                            <FaLinkedinIn className='text-[35px] p-[5px] border rounded-[20px] ' />
                            <FaYoutube className='text-[35px] p-[5px] border rounded-[20px] ' />
                            <FaTelegram className='text-[35px] p-[5px] border rounded-[20px] ' />
                        </li>
                    </ul>


                    <ul className='leading-[30px] text-[rgb(90,90,90)]  pl-[25px]'>
                        <li className='font-bold text-[18px] pb-[15px] text-black'>Information</li>
                        <li><Link href={'/about-us'}>About us</Link></li>
                        <li><Link href={'/contact-us'}>Contact us</Link></li>
                        <li><Link href={'/frequently-questions'}>Frequently Questions</Link></li>
                    </ul>

                    <ul className='leading-[30px] text-[rgb(90,90,90)]  pl-[25px]'>
                        <li className='font-bold text-[18px] pb-[15px] text-black'>My Account</li>
                        <li> <Link href={'/my-dashboard'}>My Dashboard</Link></li>
                        <li>  <Link href={'/wishlist'}>Wishlist</Link></li>
                        <li> <Link href={'/cart'}>Cart</Link></li>
                        <li> <Link href={'/checkout'}>Checkout</Link></li>
                    </ul>


                    <ul className='leading-[30px] text-[rgb(90,90,90)]  pl-[25px]'>
                        <li className='font-bold text-[18px] pb-[15px] text-black'>Top Rated Products</li>
                        <Link href={'/categories'}>
                            <li className='flex items-center'>
                                <img src="https://wscubetech.co/Assignments/furniture/storage/app/public/uploads/images/products/1617816851291Calina%20Swing%20Jhula__.jpg" className='w-[110px]' alt="Wooden Jhula" />
                                <div className='p-[15px_10px] text-[14px] font-semibold leading-[20px]'>
                                    <p className='mt-1'>Wooden Jhula</p>
                                    <p className='mt-1'>Calina Swing Jhula</p>
                                    <p className='text-[#C09578] mt-1'><span className='line-through text-gray-600'>Rs.65.000</span> Rs.58,000</p>
                                </div>
                            </li>
                        </Link>
                        <li>
                            <hr className='text-[rgb(90,90,90)] shadow' />
                        </li>
                        <Link href={'/categories'}>
                            <li className='flex items-center'>
                                <img src="https://wscubetech.co/Assignments/furniture/storage/app/public/uploads/images/products/1663411513681Group%201.jpg" className='w-[110px]' alt="1 Seater Sofa" />
                                <div className='p-[15px_10px] text-[14px] font-semibold leading-[20px]'>
                                    <p className='mt-1'>1 Seater Sofa</p>
                                    <p className='mt-1'>Yuvi sheesham wood sofa set</p>
                                    <p className='text-[#C09578] mt-1'><span className='line-through text-gray-600'>Rs. 10,000</span> Rs. 7,600</p>
                                </div>
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className='border border-gray-200 m-1'></div>
                <div className=' shadow'>
                    <ul className='flex flex-wrap sm:flex-nowrap max-w-[500px] px-4 sm:px-5 py-4 sm:py-5 text-[rgb(90,90,90)] mx-auto justify-center sm:justify-evenly gap-x-5 gap-y-2 text-[14px] sm:text-[15px]'>
                        <li><Link href={'/'}>Home</Link></li>
                        <li><Link href={'/online-store'}>Online Store</Link></li>
                        <li><Link href={'/privacy-policy'}>Privacy Policy</Link></li>
                        <li><Link href={'/term-of-use'}>Terms of Use</Link></li>
                    </ul>
                </div>


                <div className='shadow  '>
                    <div className='max-w-[500px]  text-center mx-auto'>
                        <p className='p-[5px] text-[15px] text-[rgb(90,90,90)]'>All Rights Reserved By Furniture | © 2026</p>
                        <p className='p-[5px] ml-[30%]'><img src="https://wscubetech.co/Assignments/furniture/public/frontend/img/icon/papyel2.png" /></p>
                    </div>
                </div>
            </div>
        </>
    )
}

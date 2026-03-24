'use client'
import React, { useEffect, useState } from 'react'
import Silder from './Common/Silder';
import Image from '../../../public/images/imgi_3_124ad5ba-005d-4b47-a707-a9a87033833a-1670180400.webp';
import ProductCard from './ProductCard';
import { CiHeart } from 'react-icons/ci';
import { BiWorld } from "react-icons/bi";
import { BsCheck2Circle } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import Testomonials from './Common/Testomonials';
import axios from 'axios';
import { toast } from 'react-toastify';
import BestSellingProducts from './BestSellingProducts';


export default function Home() {
    const [activeTab, setActiveTab] = useState('featured'); // featured | new_arrival | onsale
    return (
        <>
            <Silder />

            {/* Chair Collection */}

            <div className="w-full mt-4 sm:mt-6">
                <div className="max-w-[1280px] w-full mx-auto px-4">
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>

                        <div className='image w-full h-[200px] sm:h-[210px] overflow-hidden relative rounded-md'>
                            <img src='./images/imgi_3_124ad5ba-005d-4b47-a707-a9a87033833a-1670180400.webp' alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 block' />

                            <div className='absolute top-1/2 -translate-y-1/2 left-4 sm:left-5'>
                                <p className='font-medium text-[14px]'>Design Creative</p>
                                <p className='font-bold text-[18px]'>Chair Collection</p>
                            </div>
                        </div>

                        <div className='image w-full h-[200px] sm:h-[210px] overflow-hidden relative rounded-md'>
                            <img src='./images/imgi_4_0d588bec-d9a0-4645-8e7a-b49ef67b34be-1670180400.webp' alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 block' />

                            <div className='absolute top-1/2 -translate-y-1/2 left-4 sm:left-5'>
                                <p className='font-medium text-[14px]'>Bestselling Products</p>
                                <p className='font-bold text-[18px]'>Chair Collection</p>
                            </div>
                        </div>

                        <div className='image w-full h-[200px] sm:h-[210px] overflow-hidden relative rounded-md sm:col-span-2 lg:col-span-1'>
                            <img src='./images/imgi_3_124ad5ba-005d-4b47-a707-a9a87033833a-1670180400.webp' alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 block' />

                            <div className='absolute top-1/2 -translate-y-1/2 left-4 sm:left-5'>
                                <p className='font-medium text-[14px]'>Onsale Products</p>
                                <p className='font-bold text-[18px]'>Chair Collection</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='border border-gray-200 my-6 sm:my-8 mx-4'></div>
            {/* Chair Collection end */}
            <div className="max-w-[1280px] w-full mx-auto px-4">
                <div className="flex justify-center mt-6 sm:mt-8">
                    <div className="w-full sm:max-w-3xl mx-auto">
                        <div className="w-full grid grid-cols-3 border border-gray-200 rounded-md">
                            <div
                                onClick={() => setActiveTab('featured')}
                                className={`px-2 sm:px-8 lg:px-12 py-2.5 text-center text-sm sm:text-lg font-medium border-r border-gray-300 hover:text-[#C09578] cursor-pointer transition-colors ${activeTab === 'featured' ? 'text-[#C09578] bg-[#C09578]/5' : 'text-black'}`} >
                                Featured
                            </div>
                            <div
                                onClick={() => setActiveTab('new_arrival')}
                                className={`px-2 sm:px-8 lg:px-12 py-2.5 text-center text-sm sm:text-lg font-medium border-r border-gray-300 hover:text-[#C09578] cursor-pointer transition-colors ${activeTab === 'new_arrival' ? 'text-[#C09578] bg-[#C09578]/5' : 'text-black'}`}>
                                New Arrivals
                            </div>
                            <div
                                onClick={() => setActiveTab('onsale')}
                                className={`px-2 sm:px-8 lg:px-12 py-2.5 text-center text-sm sm:text-lg font-medium hover:text-[#C09578] cursor-pointer transition-colors ${activeTab === 'onsale' ? 'text-[#C09578] bg-[#C09578]/5' : 'text-black'}`}>
                                On Sale
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 sm:mt-6">
                <ProductCard activeTab={activeTab}/>
            </div>

            {/* New Trending Collection */}
            <div className="w-full my-10 sm:my-12 bg-cover bg-center bg-[url('/images/imgi_37_e9234fa4-3ff6-4a6e-a00e-0c9ff26e7b20-1670180400.jpg')] min-h-[320px] sm:min-h-[420px] md:min-h-[500px] relative">
                <div className="max-w-[1280px] w-full mx-auto px-4 min-h-[320px] sm:min-h-[420px] md:min-h-[500px] flex items-center">
                    <div className='ml-5 sm:ml-10 md:ml-20 transition-transform duration-300 hover:scale-110'>
                        <p className='text-[28px] sm:text-[40px] font-bold leading-tight'>New Trending Collection</p>
                        <p className='text-[14px] sm:text-[18px] text-gray-600'>We Believe That Good Design is Always in Season</p>
                        <button className='border-2 border-[#bf9070] text-[13px] sm:text-[14px] text-[#bf9070] py-3 px-5 mt-4'>SHOPPING NOW</button>
                    </div>
                </div>
            </div>

            {/* Bestselling Products */}
            <BestSellingProducts />
            {/* policy */}
            <div className="w-full mx-auto border border-gray-200 bg-gray-200 mt-10 py-10">
                <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                    <div className='flex flex-col md:flex-row md:justify-evenly gap-8 md:gap-4'>

                        <div className="w-full md:w-[220px]">
                            <div className="border rounded-[25px] w-[50px] h-[50px] mx-auto hover:text-[#C09578]">
                                <BiWorld className='text-[22px] m-[13.5px_13.5px]' />
                            </div>
                            <p className='text-[15px] font-bold mt-3 text-center'>Free Shipping</p>
                            <p className='text-[15px] text-gray-600 mt-1 text-center'>Free shipping on all order</p>
                        </div>

                        <div className="w-full md:w-[220px]">
                            <div className="border rounded-[25px] w-[50px] h-[50px] mx-auto hover:text-[#C09578]">
                                <BsCheck2Circle className='text-[22px] m-[13.5px_13.5px]' />
                            </div>
                            <p className='text-[15px] font-bold mt-3 text-center'>Money Return</p>
                            <p className='text-[15px] text-gray-600 mt-1 text-center'>Back guarantee under 7 days</p>
                        </div>

                        <div className="w-full md:w-[220px]">
                            <div className="border rounded-[25px] w-[50px] h-[50px] mx-auto hover:text-[#C09578]">
                                <IoTimeOutline className='text-[22px] m-[13.5px_13.5px]' />
                            </div>
                            <p className='text-[15px] font-bold mt-3 text-center'>Online Support</p>
                            <p className='text-[15px] text-gray-600 mt-1 text-center'>Support online 24 hours a day</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial */}
            <Testomonials />

            {/* Our Newsletter */}
            <div className="w-full mx-auto border border-gray-200 bg-gray-200 mt-10 py-12">
                <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Our Newsletter</h2>
                    <p className='text-[14px] sm:text-[15px] text-gray-600 text-center mt-2'>Get E-mail updates about our latest shop and special offers.</p>
                    <div className="mt-8 max-w-xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder='Email Address....'
                                required
                                className='border w-full h-11 px-4 border-gray-400 text-gray-600 outline-none rounded-md'
                            />
                            <button className='h-11 px-8 bg-[#C09578] text-white hover:bg-black rounded-md'>Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}


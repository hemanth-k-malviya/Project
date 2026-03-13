'use client'
import React, { useEffect, useState } from 'react'
import Silder from './Common/Silder';
import Image from '../../../public/images/imgi_3_124ad5ba-005d-4b47-a707-a9a87033833a-1670180400.webp';
import ProductCard from './ProductCard';
import BestSellingProducts from './BestSellingProducts';
import { CiHeart } from 'react-icons/ci';
import { BiWorld } from "react-icons/bi";
import { BsCheck2Circle } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import Testomonials from './Common/Testomonials';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function Home() {
    const [activeTab, setActiveTab] = useState('featured'); // featured | new_arrival | onsale
    return (
        <>
            <Silder />

            {/* Chair Collection */}

            <div className="w-full ">
                <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                    <div className='flex justify-center gap-8'>

                        <div className='image w-[300px] h-[200px] overflow-hidden relative'>
                            <img src='./images/imgi_3_124ad5ba-005d-4b47-a707-a9a87033833a-1670180400.webp' alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 block' />

                            <div className='absolute bottom-30 left-5'>
                                <p className='font-medium text-[14px]'>Design Creative</p>
                                <p className='font-bold text-[18px]'>Chair Collection</p>
                            </div>
                        </div>

                        <div className='image w-[300px] h-[200px] overflow-hidden relative'>
                            <img src='./images/imgi_4_0d588bec-d9a0-4645-8e7a-b49ef67b34be-1670180400.webp' alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 block' />

                            <div className='absolute bottom-30 left-5'>
                                <p className='font-medium text-[14px]'>Bestselling Products</p>
                                <p className='font-bold text-[18px]'>Chair Collection</p>
                            </div>
                        </div>

                        <div className='image w-[300px] h-[200px] overflow-hidden relative'>
                            <img src='./images/imgi_3_124ad5ba-005d-4b47-a707-a9a87033833a-1670180400.webp' alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 block' />

                            <div className='absolute bottom-30 left-5'>
                                <p className='font-medium text-[14px]'>Onsale Products</p>
                                <p className='font-bold text-[18px]'>Chair Collection</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='border border-gray-200 m-5'></div>
            {/* Chair Collection end */}
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                <div className="flex justify-center mt-10">
                    <div className="flex border border-gray-200 ">
                        <div
                            onClick={() => setActiveTab('featured')}
                            className={`px-12 py-2 text-lg font-medium border-r border-gray-300 hover:text-[#C09578] ${activeTab === 'featured' ? 'text-[#C09578]' : 'text-black'}`} >
                            Featured
                        </div>
                        <div
                            onClick={() => setActiveTab('new_arrival')}
                            className={`px-12 py-2 text-lg font-medium -m-px hover:text-[#C09578] ${activeTab === 'new_arrival' ? 'text-[#C09578]' : 'text-black'}`}>
                            New Arrivals
                        </div>
                        <div
                            onClick={() => setActiveTab('onsale')}
                            className={`px-12 py-2 text-lg font-medium border-l border-gray-300 hover:text-[#C09578] ${activeTab === 'onsale' ? 'text-[#C09578]' : 'text-black'}`}>
                            Onsale
                        </div>
                    </div>
                </div>
            </div>
            <ProductCard activeTab={activeTab} />

            {/* New Trending Collection */}
            <div className="w-full h-[500px] my-15 bg-cover bg-center bg-[url('/images/imgi_37_e9234fa4-3ff6-4a6e-a00e-0c9ff26e7b20-1670180400.jpg')]  ">
                <div className="max-w-[1280px] w-full mx-auto my-1 relative ">
                    <div className='absolute top-40 left-20 transition-transform duration-300 hover:scale-110 '>
                        <p className='text-[40px] font-bold'>New Trending Collection</p>
                        <p className='text-[18px] text-[gray]'>We Believe That Good Design is Always in Season</p>
                        <button className='border-2 border-[#bf9070] text-[14px] text-[#bf9070] py-3 px-5 mt-17'>SHOPPING NOW</button>
                    </div>
                </div>
            </div>

            {/* Bestselling Products (dynamic from API) */}
            <BestSellingProducts />

            {/* policy */}
            <div className=" w-full mx-auto border border-gray-200 h-[270px] bg-gray-200 mt-10">
                <div className="max-w-[1280px] w-full mx-auto my-1 ">
                    <div className='flex justify-evenly '>

                        <div className="w-[220px] mt-25">

                            <div className="border rounded-[25px] w-[50px] h-[50px] ml-18 hover:text-[#C09578] ">
                                <BiWorld className='text-[22px] m-[13.5px_13.5px]' />
                            </div>

                            <p className='text-[15px] font-bold mt-3 ml-12'>Free Shipping</p>
                            <p className='text-[15px] text-gray-600  mt-1 ml-2'>Free shipping on all order</p>
                        </div>

                        <div className="w-[220px] mt-25">

                            <div className="border rounded-[25px] w-[50px] h-[50px] ml-18 hover:text-[#C09578]">
                                <BsCheck2Circle className='text-[22px] m-[13.5px_13.5px] ' />
                            </div>

                            <p className='text-[15px] font-bold mt-3  ml-12'>Money Return</p>
                            <p className='text-[15px] text-gray-600 mt-1 ml-2'>Back guarantee under 7 days</p>
                        </div>

                        <div className="w-[220px] mt-25 ">

                            <div className="border rounded-[25px] w-[50px] h-[50px] ml-18 hover:text-[#C09578]">
                                <IoTimeOutline className='text-[22px] m-[13.5px_13.5px]' />
                            </div>
                            <p className='text-[15px] font-bold mt-3 ml-12'>Online Support</p>
                            <p className='text-[15px] text-gray-600 mt-1 ml-1 '>Support online 24 hours a day</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Testimonial */}
            <Testomonials />

            {/* Our Newsletter */}
            <div className=" w-full mx-auto border border-gray-200 h-[270px] bg-gray-200 mt-10">
                <div className="max-w-[1280px] w-full mx-auto my-1 ">
                    <h2 className="text-4xl font-bold text-center mt-20">Our Newsletter </h2>
                    <p className='text-[15px] text-gray-600 text-center mt-2'>Get E-mail updates about our latest shop and special offers.</p>
                    <div className="mx-79 mt-8">
                        <input type="text" placeholder='Email Address....' required className='border w-120 h-10 px-4 border border-gray-400 text-gray-600  outline-none' />
                        <button className=' h-10 px-10 mx-2 bg-[#C09578] text-white hover:bg-black'>Subscribe</button>
                    </div>
                </div>
            </div>

        </>
    );
}


"use client";
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"

export default function Testomonials() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: true,
                    arrows: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    dots: true,
                    arrows: false
                }
            }
        ]
    };

    return (
        <div className="w-full bg-gray-50 py-8 sm:py-10">
            <div className="max-w-[1280px] w-full mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">What Our Custumers Say ?</h2>
                <div className="relative slider-container bg-white rounded-lg shadow-lg p-3 sm:p-5 md:p-8">
                    <Slider {...settings}>
                        <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                            <p className='text-[14px] sm:text-[16px] md:text-[18px] text-gray-700 mb-5 sm:mb-6 leading-relaxed'>"These guys have been absolutely outstanding. Perfect Themes and the best of all that you have many options to choose! Best Support team ever! Very fast responding! Thank you very much! I highly recommend this theme and these people!"</p>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                    <img src="/images/imgi_28_3023f95a-ce85-434c-b9c5-2b0943b865e2-1670161621.jpg" alt="John Doe" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <p className='font-bold text-[14px] sm:text-[16px]'>John Doe</p>
                                    <p className='text-gray-500 text-[12px] sm:text-[14px]'>CEO, Tech Company</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                            <p className='text-[14px] sm:text-[16px] md:text-[18px] text-gray-700 mb-5 sm:mb-6 leading-relaxed'>"Amazing experience! The quality and attention to detail is outstanding. Highly recommend to anyone looking for professional service!"</p>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                    <img src="/images/imgi_27_35b5a0a0-e80f-4038-a75a-2811de92118b-1670161614.png" alt="Jane Smith" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <p className='font-bold text-[14px] sm:text-[16px]'>Jane Smith</p>
                                    <p className='text-gray-500 text-[12px] sm:text-[14px]'>Founder, Design Studio</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                            <p className='text-[14px] sm:text-[16px] md:text-[18px] text-gray-700 mb-5 sm:mb-6 leading-relaxed'>"Exceptional quality and customer support. They went above and beyond to meet our requirements. Will definitely work with them again!"</p>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                    <img src="/images/imgi_26_c6381687-5a5e-4914-9373-9cbec4937be6-1670161604.jpg" alt="Mike Johnson" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <p className='font-bold text-[14px] sm:text-[16px]'>Mike Johnson</p>
                                    <p className='text-gray-500 text-[12px] sm:text-[14px]'>Product Manager</p>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        </div>
    )
}

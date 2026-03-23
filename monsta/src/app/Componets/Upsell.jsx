'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function Upsell() {
    const [products, setProducts] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const sliderRef = useRef(null);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_APIS_URL || '').trim();
        if (!baseUrl) {
            setError(true);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(false);

        axios.post(`${baseUrl}/products/view`, { page: 1, is_upsell: 1 })
            .then((result) => {
                if (result.data._status === true) {
                    setProducts(Array.isArray(result.data._data) ? result.data._data : []);
                    setImageUrl(result.data.image_path || '');
                } else {
                    setProducts([]);
                }
            })
            .catch(() => {
                toast.error('Something went wrong !!');
                setError(true);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        try {
            const user = Cookies.get('user_login');
            const loggedIn = !!user;
            setIsLoggedIn(loggedIn);
            if (!loggedIn) {
                setWishlistIds([]);
                return;
            }
            const stored = Cookies.get('wishlist');
            const parsed = stored ? JSON.parse(stored) : [];
            const ids = Array.isArray(parsed) ? parsed.map((item) => item._id || item.id) : [];
            setWishlistIds(ids);
        } catch {
            setWishlistIds([]);
            setIsLoggedIn(false);
        }
    }, []);

    const handlePrevSlide = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft -= 320;
        }
    };

    const handleNextSlide = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft += 320;
        }
    };

    const handleAddToWishlist = (event, product) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            if (!isLoggedIn) {
                toast.info('Please login to use wishlist');
                return;
            }
            const productId = product._id || product.id;
            const stored = Cookies.get('wishlist');
            const wishlist = stored ? JSON.parse(stored) : [];
            const exists = Array.isArray(wishlist) && wishlist.some((item) => (item._id || item.id) === productId);
            if (exists) {
                toast.info('Product already in wishlist');
                return;
            }
            const newItem = {
                _id: productId,
                name: product.name,
                actual_price: product.actual_price,
                sale_price: product.sale_price,
                image: product.image,
                parent_category: product.parent_category?.name
                    ? { name: product.parent_category.name }
                    : null,
                imagePath: imageUrl,
            };
            const updated = Array.isArray(wishlist) ? [...wishlist, newItem] : [newItem];
            Cookies.set('wishlist', JSON.stringify(updated), { expires: 7 });
            setWishlistIds(updated.map((item) => item._id || item.id));
            toast.success('Added to wishlist');
        } catch (e) {
            console.error('Failed to update wishlist', e);
            toast.error('Failed to update wishlist');
        }
    };

    return (
        <div className="max-w-[1280px] w-full mx-auto my-5 px-4">
            <div className='flex items-end gap-3 my-8'>
                <p className='text-[24px] sm:text-[30px] font-bold whitespace-nowrap'>Upsell Products</p>
                <div className='flex-1 border-b border-gray-300 mb-2'></div>
            </div>

            {/* Slider Container */}
            <div className="relative">
                {/* Previous Button */}
                <button
                    onClick={handlePrevSlide}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white p-3 rounded-full hover:shadow-lg transition-all hover:-translate-x-5 group"
                    aria-label="Previous products"
                >
                    <IoChevronBackOutline size={24} className="group-hover:scale-110 transition" />
                </button>

                {/* Slider Content - Horizontal Scroll */}
                <div
                    ref={sliderRef}
                    className="products-slider overflow-x-auto scrollbar-hidden scroll-smooth"
                >
                    <div className="flex gap-3 sm:gap-4 w-max">
                        {loading
                            ? (
                                <div className="flex items-center justify-center gap-4 py-12 w-full">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C09578]" />
                                    <span className="text-gray-500"> Loading bestselling products...</span>
                                </div>
                            )
                            : error
                                ? (
                                    <div className="flex flex-col items-center justify-center py-12 w-full text-gray-500">
                                        <p>No bestselling products found.</p>
                                    </div>
                                )
                                : products.length > 0
                                    ? products.map((v, i) => {
                                        const productId = v._id || v.id;
                                        const isInWishlist = wishlistIds.includes(productId);
                                        return (
                                            <div key={productId || i} className="flex-shrink-0 w-[260px] sm:w-[300px] lg:w-80">
                                                <Link href={`/products-details/${productId}`}>
                                                    <div className="w-full min-h-[360px] sm:min-h-[400px] h-auto border-2 border-gray-200 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white group flex flex-col">
                                                        {/* Image Container */}
                                                        <div className="relative w-full h-[180px] sm:h-[220px] lg:h-[240px] bg-gray-100 rounded-t-lg overflow-hidden">
                                                            {v.image
                                                                ? <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' alt={v.name} src={`${imageUrl}${v.image}`} />
                                                                : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                            }
                                                            {/* Wishlist Button */}
                                                            <button
                                                                onClick={(e) => handleAddToWishlist(e, v)}
                                                                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-[#C09578] hover:text-white transition-all duration-300 transform hover:scale-110"
                                                            >
                                                                <CiHeart size={24} className={isInWishlist ? 'text-red-500' : ''} />
                                                            </button>
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="p-2 sm:p-3 flex flex-col flex-1">
                                                            <div className="text-center p-1">
                                                                <p className='py-1 text-gray-600 text-xs sm:text-sm'>{v?.parent_category?.name || 'Product'}</p>
                                                                <h4 className='py-1 font-semibold line-clamp-2 min-h-[48px]'>{v.name}</h4>
                                                                <p className='py-1 text-sm'><del className='text-gray-400'>Rs. {v.actual_price}</del> <span className='text-[#C09578] font-bold'>Rs.{v.sale_price}</span></p>
                                                            </div>

                                                            {/* Add to Cart Button */}
                                                            <button className='mt-auto w-full text-sm bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold hover:from-[#B0825D] hover:to-[#C09578]'>
                                                                Add To Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })
                                    : (
                                        <div className="flex flex-col items-center justify-center py-12 w-full text-gray-500">
                                            <p>No products found.</p>
                                        </div>
                                    )
                        }
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNextSlide}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-[#D9A588] to-[#C09578] text-white p-3 rounded-full hover:shadow-lg transition-all hover:translate-x-5 group"
                    aria-label="Next products"
                >
                    <IoChevronForwardOutline size={24} className="group-hover:scale-110 transition" />
                </button>
            </div>
        </div>
    );
}


'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { CiHeart } from "react-icons/ci";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useRouter } from 'next/navigation';

export default function ProductCard({ activeTab = 'featured' }) {
    const [products, setProducts] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_APIS_URL || '').trim();
        if (!baseUrl) {
            setError(true);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(false);

        const payload = { page: currentPage };
        if (activeTab === 'featured') {
            payload.is_featured = 1;
        } else if (activeTab === 'new_arrival') {
            payload.is_new_arrival = 1;
        } else if (activeTab === 'onsale') {
            payload.is_onsale = 1;
        }

        axios.post(`${baseUrl}/products/view`, payload)
            .then((result) => {
                if (result.data._status === true) {
                    setProducts(Array.isArray(result.data._data) ? result.data._data : []);
                    setImageUrl(result.data.image_path || '');
                    setTotalPage(result.data._paginate?.total_page || 1);
                    setSliderIndex(0);
                } else {
                    setProducts([]);
                    setTotalPage(1);
                }
            })
            .catch(() => {
                toast.error('Something went wrong !!');
                setError(true);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [currentPage, activeTab])
    
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
        const slider = document.querySelector('.products-slider');
        if (slider) {
            slider.scrollLeft -= 320;
        }
    };

    const handleNextSlide = () => {
        const slider = document.querySelector('.products-slider');
        if (slider) {
            slider.scrollLeft += 320;
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
                sub_category: product.sub_category?.name
                    ? { name: product.sub_category.name }
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

    const handleAddToCart = (event, product) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch(addToCart({ ...product, imagePath: imageUrl }));
        toast.success('Added to cart');
    };

    return (
        <>
            <div className="w-full py-8">
                <div className="max-w-[1280px] w-full mx-auto px-4">
                    {/* Slider Container */}
                    <div className="relative">
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white p-3 rounded-full hover:shadow-lg transition-all hover:-translate-x-5 group"
                            aria-label="Previous products"
                        >
                            <IoChevronBackOutline size={24} className="group-hover:scale-110 transition" />
                        </button>

                        {/* Slider Content - Horizontal Scroll */}
                        <div className="products-slider overflow-x-auto scrollbar-hidden scroll-smooth">
                            <div className="flex gap-4 w-min">
                                {loading
                                    ? (
                                        <div className="flex items-center justify-center gap-4 py-12 w-full">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C09578]" />
                                            <span className="text-gray-500">Loading products...</span>
                                        </div>
                                    )
                                    : error
                                        ? (
                                            <div className="flex flex-col items-center justify-center py-12 w-full text-gray-500">
                                                <p>Failed to load products.</p>
                                                <p className="text-sm mt-1">Check that the API is running and NEXT_PUBLIC_APIS_URL is set in .env</p>
                                            </div>
                                        )
                                        : products.length > 0
                                            ? products.map((v, i) => {
                                                const productId = v._id || v.id;
                                                const isInWishlist = wishlistIds.includes(productId);
                                                return (
                                                    <div key={productId || i} className="flex-shrink-0 w-80">
                                                        <Link href={`/products-details/${productId}`}>
                                                            <div className="w-full h-[420px] border-2 border-gray-200 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white group">
                                                                {/* Image Container */}
                                                                <div className="relative w-full h-[240px] bg-gray-100 rounded-t-lg overflow-hidden">
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
                                                        <div className="p-1 flex flex-col h-[180px]">
                                                            <div className="text-center p-1">
                                                                <p className='py-2 text-gray-600 text-sm'>{v?.sub_category?.name || 'Product'}</p>
                                                                <h4 className='py-2 font-semibold'>{v.name}</h4>
                                                                <p className='py-2'><del className='text-gray-400'>Rs. {v.actual_price}</del> <span className='text-[#C09578] font-bold'>Rs.{v.sale_price}</span></p>
                                                            </div>

                                                            {/* Add to Cart Button */}
                                                            <button
                                                                onClick={(e) => handleAddToCart(e, v)}
                                                                className='w-full text-sm bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold hover:from-[#B0825D] hover:to-[#C09578]'
                                                            >
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
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-[#D9A588] to-[#C09578] text-white p-3 rounded-full hover:shadow-lg transition-all hover:translate-x-5 group"
                            aria-label="Next products"
                        >
                            <IoChevronForwardOutline size={24} className="group-hover:scale-110 transition" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}


 "use client"
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken, setToken } from '../../store/authSlice';

export default function Header() {

    // const userLogin = Cookies.get('user_login')
    // const router = useRouter()

    // const logout = () => {
    //     Cookies.remove('user_login')
    //     router.push('/')
    //    }
    const router = useRouter();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const { totalQuantity, totalAmount } = useSelector((state) => state.cart);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const cookieToken = Cookies.get("user_login") || null;
        if (cookieToken && !token) {
            dispatch(setToken(cookieToken));
        }
    }, [dispatch, token]);

    const logout = () => {
        Cookies.remove("user_login");
        Cookies.remove("wishlist");
        dispatch(clearToken());
        router.push("/");
    };

    return (
        <>
            <ToastContainer />
            <header className="w-full ">

                {/* Top Bar */}
                <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                    <div className="hidden sm:flex justify-between items-center py-2 w-full ">
                        <div className="text-sm">
                            <p> Contact us 24/7 : +91-98745612330 / furnitureinfo@gmail.com</p>
                        </div>
                        <div className="text-sm flex items-center gap-5">
                            {token ? (
                                <>
                                    <Link
                                        href="/my-dashboard"
                                        className="hover:text-[#C09578] transition-colors">
                                        My Dashboard
                                    </Link>

                                    <button
                                        onClick={logout}
                                        className="hover:text-[#C09578] transition-colors cursor-pointer">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login-register"
                                    className="hover:text-[#C09578] transition-colors">
                                    Login / Register
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
                <div className='border border-gray-200 m-1'></div>
                {/* Middle Part */}
                <div className="max-w-[1280px] mx-auto py-4 sm:py-5 w-full px-4 sm:px-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        {/* Logo + icons row (mobile) */}
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                            <Link href={'/'} aria-label="Home">
                                <img
                                    src="/images/logo.png"
                                    alt="logo"
                                    className="w-[120px] sm:w-[150px]"
                                />
                            </Link>

                            <div className="flex items-center gap-2">
                                <Link href="/wishlist" aria-label="Wishlist">
                                    <div className="text-sm flex border border-gray-200 p-2 cursor-pointer hover:text-[#C09578] transition-colors">
                                        <FaHeart className='text-[22px] hover:text-[#C09578]' />
                                    </div>
                                </Link>

                                <Link href="/cart" aria-label="Cart">
                                    <div className="relative text-sm flex items-center gap-2 border border-gray-200 p-2 hover:text-[#C09578] cursor-pointer transition-colors">
                                        <div className='w-[23px] h-[23px] rounded-full bg-[#C09578] absolute -top-2 -left-1 flex items-center justify-center'>
                                            <p className="text-[13px] text-white font-semibold">{totalQuantity || 0}</p>
                                        </div>
                                        <IoCart className='text-[22px]' />
                                        <span className="hidden sm:inline text-[15px] font-semibold">
                                            Rs. {(totalAmount || 0).toFixed()}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Search row */}
                        <div className="w-full sm:flex-1 flex justify-center">
                            <div className="w-full sm:max-w-[520px] text-sm flex border border-gray-200 p-1 rounded-lg">
                                <input
                                    type="text"
                                    placeholder='Search product...'
                                    className='flex-1 p-2 sm:p-[5px_25px] outline-none bg-transparent'
                                />
                                <IoIosSearch className='text-[22px] mt-1 mr-2 sm:mr-4' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='border border-gray-200 m-1'></div>
            </header>

            <div className="max-w-[1280px] mx-auto w-full px-4 font-semibold my-5">
                {/* Mobile menu toggle */}
                <div className="lg:hidden flex items-center justify-between">
                    <p className="text-[15px] text-gray-600">Menu</p>
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                        className="px-3 py-2 border border-gray-200 rounded-md hover:border-[#C09578] transition-colors"
                    >
                        {isMobileMenuOpen ? 'Close' : 'Open'}
                    </button>
                </div>

                {/* Mobile menu content */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="flex flex-col gap-3 text-[15px]">
                            <Link href="/" className="hover:text-[#C09578] transition-colors">
                                HOME
                            </Link>
                            <Link href="/categories" className="hover:text-[#C09578] transition-colors">
                                LIVING
                            </Link>
                            <Link href="/categories" className="hover:text-[#C09578] transition-colors">
                                SOFA
                            </Link>
                            <Link href="/about-us" className="hover:text-[#C09578] transition-colors">
                                ABOUT US
                            </Link>
                            <Link href="/faqs" className="hover:text-[#C09578] transition-colors">
                                FAQS
                            </Link>
                            <Link href="/contact-us" className="hover:text-[#C09578] transition-colors">
                                CONTACT US
                            </Link>
                        </div>
                    </div>
                )}

                {/* Desktop menu */}
                <div className='hidden lg:flex justify-center gap-8 text-[15px]'>
                    <div className='flex  '>
                        <p className=' text-[#C09578]'> HOME</p>
                    </div>

                    <div className='group relative'>
                        <div className="flex hover:text-[#C09578]">
                            <p> LIVING</p>
                            <IoIosArrowDown className='m-[3px]' />
                        </div>
                        <div className="absolute top-full left-0 w-[90vw] max-w-[480px] bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out pt-2 z-50 grid grid-cols-3 gap-2">
                            <div className="">
                                <Link href={'/categories'}>
                                    <p className='hover:text-[#C09578] text-center mt-4 mb-3'>Tables</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>Side and End Tables</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>Nest Of Tables</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>Coffee Table Sets</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>Coffee Tables</p>
                                </Link>
                            </div>
                            <div className="">
                                <Link href={'/categories'}>
                                    <p className='hover:text-[#C09578] text-center mt-4  mb-3'>Mirror</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center text-gray-400 mb-3 hover:text-[#C09578]'>Wooden Mirrors</p>
                                </Link>
                            </div>
                            <div className="mx-1 ">
                                <Link href={'/categories'}>
                                    <p className='hover:text-[#C09578] mx-2 mt-4 mb-3'>Living <br /> Storage/collections</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-left hover:text-[#C09578] text-gray-400 mb-3'>Prayer Units</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-left hover:text-[#C09578] text-gray-400 mb-3'>Display Unit</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-left hover:text-[#C09578] text-gray-400 mb-3'>Shoe Racks</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-left hover:text-[#C09578] text-gray-400 mb-3'>Chest Of Drawers</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-left hover:text-[#C09578] text-gray-400 mb-3'>Cabinets and Sideboard</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-left hover:text-[#C09578] text-gray-400 mb-3'> Bookshelves</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-left hover:text-[#C09578] text-gray-400 mb-3'> Tv Units</p>
                                </Link>
                            </div>
                        </div>

                    </div>

                    <div className=' group relative'>
                        <div className='flex hover:text-[#C09578]'> 
                            SOFA
                            <IoIosArrowDown className='m-[3px]' />
                        </div>
                        <div className="absolute top-full left-0 w-[90vw] max-w-[500px] bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out pt-2 z-50 grid grid-cols-3 gap-2">
                            <div className="">
                                <Link href={'/categories'}>
                                    <p className='hover:text-[#C09578] text-center mt-4 mb-3'> Sofa Cum Bed</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center text-gray-400 mb-3 hover:text-[#C09578]'> Wooden Sofa Cum Bed</p>
                                </Link>
                            </div>

                            <div className="">
                                <Link href={'/categories'}>
                                    <p className='hover:text-[#C09578] text-center mt-4  mb-3'>Sofa Sets</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>Sofa Cover</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>L Shape Sofa</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>1 Seater Sofa</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>2 Seater Sofa</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>3 Seater Sofa</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>Wooden Sofa Sets</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center hover:text-[#C09578] text-gray-400 mb-3'>Normal</p>
                                </Link>

                            </div>
                            <div className="">
                                <Link href={'/categories'}>
                                    <p className='hover:text-[#C09578]  text-center mx-6 mt-4 mb-3'>Swing Jhula</p>
                                </Link>
                                <Link href={'/categories'}>
                                    <p className='text-[13px] text-center text-gray-400 mb-3 hover:text-[#C09578]'>Wooden Jhula</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='group relative'>
                        <div className='flex hover:text-[#C09578] cursor-pointer'>
                            PAGES
                            <IoIosArrowDown className='m-[3px]' />
                        </div>

                        <div className="absolute top-full left-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out pt-2 z-50">
                            <Link href={'/about-us'}><p className='text-[13px] text-left text-gray-400 mb-3 mx-5 hover:text-[#C09578]'>About Us</p></Link>
                            <Link href={'/'}><p className='text-[13px] text-left text-gray-400 mb-3 mx-5 hover:text-[#C09578]'>Cart</p></Link>
                            <Link href={'/'}><p className='text-[13px] text-left text-gray-400 mb-3 mx-5  hover:text-[#C09578]'>Checkout</p></Link>
                            <Link href={'/faqs'}><p className='text-[13px] text-left text-gray-400 mb-3 mx-5 hover:text-[#C09578]'>Frequently Questions</p></Link>
                        </div>
                    </div>

                    <div className='flex hover:text-[#C09578]'>
                        <Link href={'/contact-us'}> CONTACT US</Link>
                    </div>
                </div>
            </div>
        </>
    )
}



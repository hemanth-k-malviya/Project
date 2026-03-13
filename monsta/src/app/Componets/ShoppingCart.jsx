'use client';

import Link from 'next/link'
import React, { useEffect } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { MdDeleteOutline } from 'react-icons/md'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { BiCart } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseQuantity, removeFromCart } from '../store/cartSlice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ShoppingCart() {

    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

    useEffect(() => {
        const cookieToken = Cookies.get('user_login');
        if (!token && !cookieToken) {
            router.replace('/login-register');
        }
    }, [token, router]);

    const handleDecrease = (id) => {
        dispatch(decreaseQuantity(id));
    };

    const handleIncrease = (item) => {
        dispatch(addToCart(item));
    };

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + (Number(item.sale_price || 0) * (item.quantity || 0)),
        0
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const cookieToken = typeof window !== 'undefined' ? Cookies.get('user_login') : null;
    const isLoggedIn = !!token || !!cookieToken;

    if (!isLoggedIn) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50 to-slate-50 py-12">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
                    <BiCart className="text-5xl text-[#C09578] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Login to view cart</h2>
                    <p className="text-gray-600 mb-6">Please sign in to see your cart and checkout.</p>
                    <Link href="/login-register" className="inline-block bg-[#C09578] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ad8060] transition">
                        Login / Register
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full bg-gradient-to-br from-slate-50 via-amber-50 to-slate-50 py-12">
                <div className="max-w-[1280px] w-full mx-auto px-4">
                    {/* Attractive Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center justify-center gap-3 mb-4 bg-white rounded-full px-6 py-2 shadow-sm">
                            <BiCart className='text-[#C09578] text-2xl' />
                            <span className="text-sm font-semibold text-[#C09578]">Shopping Cart</span>
                        </div>
                        <h1 className='text-5xl font-bold text-center mb-4 bg-gradient-to-r from-gray-800 via-[#C09578] to-gray-800 bg-clip-text text-transparent'>Your Shopping Cart</h1>
                        <p className="text-gray-600 text-lg mb-6">Review your items and proceed to checkout</p>
                        <div className='flex justify-center items-center gap-2 text-sm'>
                            <Link href="/" className="text-gray-600 hover:text-[#C09578] transition font-medium">Home</Link>
                            <IoIosArrowForward className='text-[#C09578]' />
                            <p className="text-[#C09578] font-semibold">Shopping Cart</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2">
                            {cartItems.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                                    <BiCart className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg mb-4 font-medium">Your cart is empty</p>
                                    <Link href="/online-store" className="inline-block bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white px-8 py-3 rounded-full hover:shadow-lg transition font-semibold">
                                        Continue Shopping →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Cart Items */}
                                    {cartItems.map((item) => {
                                        const id = item._id || item.id;
                                        const imgSrc = item.image ? `${item.imagePath || ''}${item.image}` : null;
                                        return (
                                            <div key={id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#C09578] group">
                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 items-center">
                                                    {/* Product Image & Info */}
                                                    <div className="md:col-span-2 flex gap-4">
                                                        <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 overflow-hidden shadow-md group-hover:shadow-lg transition">
                                                            {imgSrc ? (
                                                                <img src={imgSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <Link href={`/products-details/${id}`} className="font-bold text-gray-800 hover:text-[#C09578] transition text-sm md:text-base">
                                                                {item.name}
                                                            </Link>
                                                            <p className="text-xs text-gray-500 mt-2">{item?.sub_category?.name || 'Product'}</p>
                                                            <p className="text-xs text-gray-500 mt-2">{item.dimension}</p>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-gray-700">
                                                        <p className="font-bold text-base md:text-lg">Rs. {Number(item.sale_price || 0).toFixed(2)}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Each</p>
                                                    </div>

                                                    {/* Quantity Control */}
                                                    <div className="flex items-center justify-center">
                                                        <div className="flex items-center gap-2 border-2 border-gray-200 rounded-full p-1 bg-gray-50 hover:border-[#C09578] transition">
                                                            <button
                                                                onClick={() => handleDecrease(id)}
                                                                className="p-2 hover:bg-[#C09578] hover:text-white rounded-full transition"
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <AiOutlineMinus size={14} />
                                                            </button>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                readOnly
                                                                className="w-10 text-center border-0 outline-none bg-transparent font-semibold"
                                                            />
                                                            <button
                                                                onClick={() => handleIncrease(item)}
                                                                className="p-2 hover:bg-[#C09578] hover:text-white rounded-full transition"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <AiOutlinePlus size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Total & Remove */}
                                                    <div className="flex justify-between md:justify-end gap-4 items-center">
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-800 text-base md:text-lg">
                                                                Rs. {(Number(item.sale_price || 0) * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemove(id)}
                                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-3 rounded-full transition"
                                                            aria-label="Remove item"
                                                        >
                                                            <MdDeleteOutline size={22} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Promo Code */}
                                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span className="text-lg">🎁</span> Have a Promo Code?
                                        </h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter promo code"
                                                className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#C09578] transition"
                                            />
                                            <button className="bg-[#C09578] text-white px-6 py-2 rounded-lg hover:bg-[#B0825D] transition font-semibold">Apply</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Continue Shopping */}
                            {cartItems.length > 0 && (
                                <div className="mt-6">
                                    <Link href="/online-store" className="text-[#C09578] hover:text-[#B0825D] font-bold inline-flex items-center gap-2 group">
                                        <span className="group-hover:translate-x-[-4px] transition">←</span> Continue Shopping
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-[80px] border-t-4 border-[#C09578]">
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">Order Summary</h3>
                                <p className="text-sm text-gray-500 mb-6">Review your items</p>

                                {/* Price Breakdown */}
                                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                                    <div className="flex justify-between text-gray-700 hover:text-[#C09578] transition">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 hover:text-[#C09578] transition">
                                        <span className="font-medium">Shipping</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? (
                                                <span className="text-green-600 font-bold">Free</span>
                                            ) : (
                                                `Rs. ${shipping.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 hover:text-[#C09578] transition">
                                        <span className="font-medium">Tax (10%)</span>
                                        <span className="font-semibold">Rs. {tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Free Shipping Alert */}
                                {shipping === 0 && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 mb-6">
                                        <p className="text-green-700 text-sm font-bold flex items-center gap-2">
                                            <span>✓</span> You qualify for FREE shipping!
                                        </p>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-3xl font-bold bg-gradient-to-r from-[#C09578] to-[#D9A588] bg-clip-text text-transparent">Rs. {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Buttons */}
                                {cartItems.length > 0 && (
                                    <div className="space-y-3 mb-6">
                                        <Link href={'/checkout'}>
                                            <button className="w-full bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white py-3 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all font-bold text-lg">
                                                Proceed to Checkout
                                            </button>
                                        </Link>

                                        {/* <button className="w-full border-2 border-[#C09578] text-[#C09578] py-3 rounded-lg hover:bg-amber-50 transition font-bold">
                                            Save for Later
                                        </button> */}
                                    </div>
                                )}

                                {/* Trust & Info */}
                                <div className="space-y-3 pt-6 border-t-2 border-gray-200">
                                    <div className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded transition">
                                        <span className="text-xl">🔒</span>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Secure Checkout</p>
                                            <p className="text-xs text-gray-600">256-bit encrypted payment</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded transition">
                                        <span className="text-xl">🚚</span>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Free Shipping</p>
                                            <p className="text-xs text-gray-600">On orders above Rs. 100</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded transition">
                                        <span className="text-xl">↩️</span>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Easy Returns</p>
                                            <p className="text-xs text-gray-600">30-day return policy</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


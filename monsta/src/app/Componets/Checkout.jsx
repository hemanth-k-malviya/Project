'use client';
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'
import { FaCreditCard, FaPaypal, FaTruck, FaLock } from 'react-icons/fa'
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';

export default function Checkout() {
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [buttonLoading, setButtonLoading] = useState(false)
    const { error, isLoading, Razorpay } = useRazorpay();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile_number: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        order_note: '',
    });

    const cartItems = useSelector((state) => state.cart.items);

    const subtotal = cartItems.reduce((sum, item) => sum + ((Number(item.sale_price) || 0) * (item.quantity || 0)), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const palceOrder = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setButtonLoading(true);

        const product_info = cartItems.map((item) => ({
            id: item._id || item.id,
            name: item.name,
            description: item.description || '',
            image: item.image,
            price: Number(item.sale_price || 0),
            quantity: item.quantity || 0,
            dimension : item.dimension || '',
        }));

        let orderSave = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            mobile_number: formData.mobile_number,
            shipping_address: {
                firstName: formData.first_name,
                lastName: formData.last_name,
                email: formData.email,
                mobile_number: formData.mobile_number,
                address: formData.address,
                country: formData.country,
                state: formData.state,
                city: formData.city,
            },
            order_note: formData.order_note,
            product_info,
            total_amount: subtotal,
            discount_amount: 0,
            final_amount: total,
            payment_type: 'Online',
        }
        console.log(orderSave)

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/place-order`, orderSave, {
            headers: {
                Authorization: `Bearer ${Cookies.get('user_login')}`
            }
        })
            .then(async (result) => {
                console.log(result.data);
                setButtonLoading(false);
                PaymentComponent(result.data._data)
            })
            .catch((error) => {
                console.log(error)
                toast.error('Something went wrong !')
                setButtonLoading(false);
            })
    }

    const PaymentComponent = (orderInfo) => {

        console.log(orderInfo);

        const options = {
            key: `${process.env.NEXT_PUBLIC_YOUR_RAZORPAY_KEY}`,
            amount: orderInfo.final_amount * 100, // Amount in paise
            currency: "INR",
            name: "Mosta PVT LTD",
            description: "Test Transaction",
            order_id: orderInfo.order_id, // Generated order_id from server
            handler: (response) => {
                console.log(response);

                const paymentResponse = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                };

                orderStatusUpdate(paymentResponse);
                toast.success("Payment Successful!");
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#F37254",
            },
        };

        const razorpayInstance = new Razorpay(options);

        razorpayInstance.on("payment.failed", function (response) {
            toast.error('Payment Failed !!')
            console.log(response);

            const paymentResponse = {
                razorpay_order_id: response.error.metadata.order_id,
                razorpay_payment_id: response.error.metadata.payment_id
            };

            orderStatusUpdate(paymentResponse);
        });

        razorpayInstance.open();
    }

    const orderStatusUpdate = (paymentResponse) => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/order-status`, paymentResponse, {
            headers: {
                Authorization: `Bearer ${Cookies.get('user_login')}`
            }
        })
            .then(async (result) => {
                console.log(result.data);
                setButtonLoading(false);

                // Clear cart after backend confirms payment status update
                dispatch(clearCart());
            })
            .catch((error) => {
                console.log(error)
                // toast.error('Something went wrong !')
                setButtonLoading(false);
            })
    }




    const steps = [
        { number: 1, title: 'Shipping', icon: '📦' },
        { number: 2, title: 'Payment', icon: '💳' },
        { number: 3, title: 'Review', icon: '✓' },
    ];

    return (
        <>
            <div className="w-full bg-gradient-to-br from-slate-50 via-amber-50 to-slate-50 py-12 min-h-screen">
                <div className="max-w-[1280px] w-full mx-auto px-4">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className='text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-[#C09578] to-gray-800 bg-clip-text text-transparent'>Checkout</h1>
                        <div className='flex justify-center items-center gap-2 text-sm'>
                            <Link href="/" className="text-gray-600 hover:text-[#C09578] transition font-medium">Home</Link>
                            <IoIosArrowForward className='text-[#C09578]' />
                            <Link href="/cart" className="text-gray-600 hover:text-[#C09578] transition font-medium">Cart</Link>
                            <IoIosArrowForward className='text-[#C09578]' />
                            <p className="text-[#C09578] font-semibold">Checkout</p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center max-w-2xl mx-auto">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold transition-all mb-2 ${currentStep >= step.number
                                            ? 'bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {currentStep > step.number ? '✓' : step.number}
                                        </div>
                                        <p className={`text-sm font-semibold ${currentStep >= step.number ? 'text-[#C09578]' : 'text-gray-500'}`}>
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 flex-1 mx-2 mb-8 transition-all ${currentStep > step.number ? 'bg-[#C09578]' : 'bg-gray-300'
                                            }`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            {/* Step 1: Shipping */}
                            {currentStep === 1 && (
                                <form className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100" onSubmit={palceOrder}>
                                    <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                                        <FaTruck className="text-[#C09578] text-2xl" />
                                        Shipping Information
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Name Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    // value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="John"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    // value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Doe"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                        </div>

                                        {/* Email & Phone */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    // value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="john@example.com"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="mobile_number"
                                                    // value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                                            <input
                                                type="text"
                                                name="address"
                                                // value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="123 Main Street"
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                            />
                                        </div>

                                        {/* City, State, Zip */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    // value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Mumbai"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    // value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="Maharashtra"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    // value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    placeholder="400001"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                        </div>

                                        {/* Country */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                                            <select
                                                name="country"
                                                // value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                            >
                                                <option value="">Select Country</option>
                                                <option value="USA">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="Australia">Australia</option>
                                                <option value="India">India</option>
                                            </select>
                                        </div>

                                        {/* Order Note */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Order Note (optional)</label>
                                            <textarea
                                                name="order_note"
                                                // value={formData.order_note}
                                                onChange={handleInputChange}
                                                placeholder="Notes about your order..."
                                                rows={3}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition resize-none"
                                            />
                                        </div>

                                        {/* Shipping Method */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">Shipping Method</label>
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#C09578] transition">
                                                    <input type="radio" name="shipping" defaultChecked className="w-4 h-4" />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Standard Shipping</p>
                                                        <p className="text-sm text-gray-600">Delivery in 5-7 business days</p>
                                                    </div>
                                                    <span className="ml-auto font-bold text-[#C09578]">Free</span>
                                                </label>
                                                <label className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#C09578] transition">
                                                    <input type="radio" name="shipping" className="w-4 h-4" />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Express Shipping</p>
                                                        <p className="text-sm text-gray-600">Delivery in 2-3 business days</p>
                                                    </div>
                                                    <span className="ml-auto font-bold text-gray-800">Rs. 25</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 mt-8 pt-8 border-t">
                                        <Link href="/cart" className="flex-1 border-2 border-gray-300 text-gray-800 py-3 rounded-lg hover:border-[#C09578] hover:text-[#C09578] transition font-bold text-center inline-block">
                                            Back to Cart
                                        </Link>
                                        <button
                                            className="flex-1 bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white py-3 rounded-lg hover:shadow-lg font-bold transition"
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                        >
                                            {
                                                buttonLoading
                                                    ?
                                                    'Loading.....'
                                                    :
                                                    'Continue to Payment'
                                            }
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 2 && (
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                                        <FaCreditCard className="text-[#C09578] text-2xl" />
                                        Payment Method
                                    </h2>

                                    <div className="space-y-4 mb-8">
                                        {/* Credit Card Option */}
                                        <div
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-6 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'card' ? 'border-[#C09578] bg-amber-50' : 'border-gray-300 hover:border-[#C09578]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {paymentMethod === 'card' ? (
                                                    <MdCheckCircle className="text-[#C09578] text-2xl flex-shrink-0" />
                                                ) : (
                                                    <MdRadioButtonUnchecked className="text-gray-400 text-2xl flex-shrink-0" />
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800 mb-1">Credit/Debit Card</p>
                                                    <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PayPal Option */}
                                        <div
                                            onClick={() => setPaymentMethod('paypal')}
                                            className={`p-6 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'paypal' ? 'border-[#C09578] bg-amber-50' : 'border-gray-300 hover:border-[#C09578]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {paymentMethod === 'paypal' ? (
                                                    <MdCheckCircle className="text-[#C09578] text-2xl flex-shrink-0" />
                                                ) : (
                                                    <MdRadioButtonUnchecked className="text-gray-400 text-2xl flex-shrink-0" />
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800 mb-1">PayPal</p>
                                                    <p className="text-sm text-gray-600">Safe and secure payment with PayPal</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bank Transfer Option */}
                                        <div
                                            onClick={() => setPaymentMethod('bank')}
                                            className={`p-6 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'bank' ? 'border-[#C09578] bg-amber-50' : 'border-gray-300 hover:border-[#C09578]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {paymentMethod === 'bank' ? (
                                                    <MdCheckCircle className="text-[#C09578] text-2xl flex-shrink-0" />
                                                ) : (
                                                    <MdRadioButtonUnchecked className="text-gray-400 text-2xl flex-shrink-0" />
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800 mb-1">Bank Transfer</p>
                                                    <p className="text-sm text-gray-600">Direct bank transfer to our account</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Details (shown when card is selected) */}
                                    {/* {paymentMethod === 'card' && (
                                        <div className="space-y-4 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#C09578] transition"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )} */}

                                    {/* Security Note */}
                                    <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-8">
                                        <FaLock className="text-green-600 text-xl flex-shrink-0 mt-1" />
                                        <p className="text-sm text-green-700"><strong>Secure:</strong> Your payment information is encrypted and secure.</p>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 pt-8 border-t">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="flex-1 border-2 border-gray-300 text-gray-800 py-3 rounded-lg hover:border-[#C09578] hover:text-[#C09578] transition font-bold"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep(3)}
                                            className="flex-1 bg-gradient-to-r from-[#C09578] to-[#D9A588] text-white py-3 rounded-lg hover:shadow-lg font-bold transition"
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <h2 className="text-2xl font-bold mb-8 text-gray-800">Order Review</h2>

                                    {/* Shipping Details */}
                                    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>📦</span> Shipping Address
                                        </h3>
                                        <p className="text-gray-700">
                                            {formData.first_name} {formData.last_name}<br />
                                            {formData.email && <>{formData.email}<br /></>}
                                            {formData.mobile_number && <>{formData.mobile_number}<br /></>}
                                            {formData.address}<br />
                                            {formData.city}{formData.city && formData.state && ', '}{formData.state} {formData.zipCode}<br />
                                            {formData.country}
                                         
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            className="text-[#C09578] hover:text-[#B0825D] font-semibold text-sm mt-4"
                                        >
                                            Edit Shipping
                                        </button>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>🛒</span> Order Items
                                        </h3>
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                                <div key={item._id || item.id} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0">
                                                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                                        {item.image ? (
                                                            <img src={`${item.imagePath || ''}${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                                                        <p className="text-sm text-gray-600">Qty: {item.quantity} × Rs. {Number(item.sale_price || 0).toFixed(2)}</p>
                                                    </div>
                                                    <p className="font-semibold text-gray-800">Rs. {(item.quantity * Number(item.sale_price || 0)).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>💳</span> Payment Method
                                        </h3>
                                        <p className="text-gray-700 capitalize">
                                            {paymentMethod === 'card' && 'Credit/Debit Card'}
                                            {paymentMethod === 'paypal' && 'PayPal'}
                                            {paymentMethod === 'bank' && 'Bank Transfer'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                            className="text-[#C09578] hover:text-[#B0825D] font-semibold text-sm mt-4"
                                        >
                                            Edit Payment
                                        </button>
                                    </div>

                                    {/* Terms Checkbox */}
                                    <div className="flex gap-3 mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                        <input type="checkbox" id="terms" className="w-4 h-4 mt-1" />
                                        <label htmlFor="terms" className="text-sm text-gray-700">
                                            I agree to the <a href="#" className="text-[#C09578] font-semibold hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#C09578] font-semibold hover:underline">Privacy Policy</a>
                                        </label>
                                    </div>

                                    {/* Place Order Button */}
                                    <div className="flex gap-4 pt-8 border-t">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                            className="flex-1 border-2 border-gray-300 text-gray-800 py-3 rounded-lg hover:border-[#C09578] hover:text-[#C09578] transition font-bold"
                                        >
                                            Back
                                        </button>
                                        <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg font-bold transition text-lg"
                                             onClick={palceOrder}
                                           disabled=
                                            {
                                                buttonLoading
                                                    ?
                                                    'disabled'
                                                    :
                                                    ''
                                            }
                                        >
                                            {
                                                buttonLoading
                                                    ?
                                                    'Loading.....'
                                                    :
                                                    'Place Order'
                                            }

                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-[80px] border-t-4 border-[#C09578]">
                                <h3 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h3>

                                {/* Items */}
                                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200 max-h-64 overflow-y-auto scrollbar-custom">
                                    {cartItems.map((item) => {
                                        const imgSrc = item.image ? `${item.imagePath || ''}${item.image}` : null;
                                        return (
                                            <div key={item._id || item.id} className="flex gap-3 text-sm">
                                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                    {imgSrc ? (
                                                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold text-gray-800 flex-shrink-0">Rs. {(Number(item.sale_price || 0) * item.quantity).toFixed(2)}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-green-600">{shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax (10%)</span>
                                        <span className="font-semibold">Rs. {tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-3xl font-bold bg-gradient-to-r from-[#C09578] to-[#D9A588] bg-clip-text text-transparent">Rs. {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Trust Info */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex gap-2 items-start">
                                        <span>🔒</span>
                                        <p className="text-gray-600"><strong>Secure:</strong> 256-bit encrypted</p>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                        <span>✓</span>
                                        <p className="text-gray-600"><strong>30-day</strong> return policy</p>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                        <span>🚚</span>
                                        <p className="text-gray-600"><strong>Fast</strong> shipping worldwide</p>
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

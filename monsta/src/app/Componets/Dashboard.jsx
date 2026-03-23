"use client"
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userProfile, setUserProfile] = useState('')
    const [userEmail, setUserEmail] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [updateProfile, setUpadateProfile] = useState(true)
    const [isLoading, setisLoading] = useState(false);
    const router = useRouter();

    const logout = () => {
        Cookies.remove("user_login");
        router.push("/");
    };

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/view-profile`, {}, {
            headers: {
                Authorization: `Bearer ${Cookies.get('user_login')}`
            }
        })
            .then((result) => {
                if (result.data._status === true) {
                    setUserProfile(result.data._data);
                    setUserEmail(result.data._data.email);
                    setSelectedTitle(result.data._data.gender)
                } else {
                    toast.error(result.data._message)
                }
            })
            .catch(() => {
                toast.error("Something went wrong !")
            })
    }, [updateProfile])

    const updateProfileHandling = (e) => {
        e.preventDefault()
        setisLoading(true)
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`, e.target, {
            headers: {
                Authorization: `Bearer ${Cookies.get('user_login')}`
            }
        })
            .then((result) => {
                if (result.data._status === true) {
                    setUserProfile(result.data._data);
                    toast.success(result.data._message)
                    setUpadateProfile(!updateProfile)
                    setisLoading(false)
                } else {
                    toast.error(result.data._message)
                    setisLoading(false)
                }
            })
            .catch(() => {
                toast.error("Something went wrong !")
                setisLoading(false)
            })
    }


    const changePassword = (e) => {
        e.preventDefault();
        setisLoading(true);

        const formData = new FormData(e.target);

        const currentPassword = formData.get("current_password");
        const newPassword = formData.get("new_password");
        const confirmPassword = formData.get("confirm_password");

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            setisLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            setisLoading(false);
            return;
        }

        axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/user/change-password`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get("user_login")}`,
                    // ❗ Do NOT set Content-Type manually for FormData
                },
            }
        )
            .then((result) => {
                if (result.data._status === true) {
                    toast.success(result.data._message);
                    e.target.reset(); // clear form
                    setisLoading(false);
                } else {
                    toast.error(result.data._message);
                    setisLoading(false);
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Something went wrong!");
                setisLoading(false);
            })
    };

    return (
        <>
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                <p className='text-[28px] sm:text-[34px] md:text-[40px] font-bold text-center'> My Dashboard</p>
                <div className='flex justify-center' >
                   <Link href={'/'}> <p className="text-[16px] hover:text-[#C09578]"> Home </p></Link>  
                    <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
                    <p className="text-[16px] text-[#C09578]">My Account</p>
                </div>

                {/* border */}
                <div className='border border-gray-200 m-8'></div>
            </div>

            <div className="py-10 border-b">
                <div className="max-w-[1280px] mx-auto px-4">

                    <div className="grid grid-cols-12 gap-8">

                        {/* LEFT SIDEBAR */}
                        <div className="col-span-12 lg:col-span-3">
                            <ul className="border border-gray-200 rounded-md overflow-hidden">
                                {[
                                    { key: "dashboard", label: "My Dashboard" },
                                    { key: "orders", label: "Orders" },
                                    { key: "address", label: "Address" },
                                    { key: "profile", label: "My Profile" },
                                    { key: "password", label: "Change Password" },
                                ].map((item) => (
                                    <li
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={`px-5 py-3 cursor-pointer border-b last:border-b-0
                            ${activeTab === item.key
                                                ? "bg-[#C09578] text-white"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {item.label}
                                    </li>
                                ))}

                                <li
                                    onClick={logout}
                                    className="px-5 py-3 cursor-pointer hover:bg-gray-100"
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="col-span-12 lg:col-span-9">

                            {/* DASHBOARD */}
                            {activeTab === "dashboard" && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">My Dashboard</h3>
                                    <p className="text-gray-600">
                                        From your account dashboard, you can easily check & view
                                        your recent orders, manage shipping and billing addresses,
                                        and edit your account details.
                                    </p>
                                </div>
                            )}

                            {/* ORDERS */}
                            {activeTab === "orders" && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Orders</h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full border border-gray-200 text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border p-3">Order</th>
                                                    <th className="border p-3">Date</th>
                                                    <th className="border p-3">Status</th>
                                                    <th className="border p-3">Total</th>
                                                    <th className="border p-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="text-center">
                                                    <td className="border p-3">1</td>
                                                    <td className="border p-3">May 10, 2018</td>
                                                    <td className="border p-3 text-green-600">Completed</td>
                                                    <td className="border p-3">Rs. 25.00</td>
                                                    <td className="border p-3">
                                                        <Link href="/product-details/your_product_name" className="text-[#C09578]">
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* profile */}
                            {activeTab === "profile" && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-6">My Profile</h3>

                                    <form
                                        onSubmit={updateProfileHandling}
                                        autoComplete="off"
                                        className="max-w-xl space-y-5"
                                    >
                                        {/* Gender */}
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Male"
                                                    name="gender"
                                                    checked={selectedTitle === 'Male'}
                                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                                />
                                                Male
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Female"
                                                    name="gender"
                                                    checked={selectedTitle === 'Female'}
                                                    onChange={(e) => setSelectedTitle(e.target.value)}

                                                />
                                                Female
                                            </label>
                                        </div>

                                        {/* Name */}
                                        <div>
                                            <label className="block mb-1 font-medium">Name*</label>
                                            <input
                                                type="text"
                                                name='name'
                                                defaultValue={userProfile.name}
                                                className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-[#C09578]"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block mb-1 font-medium">Email*</label>
                                            <input
                                                type="text"
                                                name='email'
                                                value={userProfile.email}
                                                readOnly
                                                className="w-full border border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Mobile */}
                                        <div>
                                            <label className="block mb-1 font-medium">Mobile Number*</label>
                                            <input
                                                type="text"
                                                name='mobile_number'
                                                defaultValue={userProfile.mobile_number}
                                                maxLength="15"
                                                className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-[#C09578]"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label className="block mb-1 font-medium">Address*</label>
                                            <input
                                                type="text"
                                                name='address'
                                                defaultValue={userProfile.address}
                                                className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-[#C09578]"
                                            />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`px-6 py-2 text-white rounded 
                                       ${isLoading ? "bg-gray-400" : "bg-[#C09578] hover:bg-[#a57f64]"} `}
                                        >

                                            {isLoading ? "Loading..." : "Update"}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Change password */}
                            {activeTab === "password" && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-6">Change Password</h3>

                                    <form onSubmit={changePassword} className="max-w-md space-y-5" autoComplete="off">
                                        <div>
                                            <label className="block mb-1 font-medium">Current Password</label>
                                            <input
                                                name='current_password'
                                                type="password"
                                                className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-[#C09578]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 font-medium">New Password</label>
                                            <input
                                                type="password"
                                                name='new_password'
                                                className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-[#C09578]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 font-medium">Confirm Password</label>
                                            <input
                                                name='confirm_password'
                                                type="password"
                                                className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-[#C09578]"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`px-6 py-2 text-white rounded
                                              ${isLoading
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-[#C09578] hover:bg-[#a57f64]"
                                                }`}
                                        >
                                            {isLoading ? "Updating..." : "Change Password"}
                                        </button>
                                    </form>
                                </div>
                            )}



                            {/* ADDRESS */}
                            {activeTab === "address" && (
                                <div>
                                    <p className="mb-6 text-gray-600">
                                        The following addresses will be used on the checkout page by default.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                        {/* BILLING */}
                                        <div>
                                            <h4 className="text-lg font-semibold mb-4">Billing Address</h4>
                                            <form className="space-y-4">
                                                <input className="w-full border p-2" placeholder="Billing Name" />
                                                <input className="w-full border p-2" placeholder="Billing Email" />
                                                <input className="w-full border p-2" placeholder="Billing Mobile" />
                                                <input className="w-full border p-2" placeholder="Billing Address" />
                                                <select className="w-full border p-2">
                                                    <option>Select Country</option>
                                                    <option>India</option>
                                                </select>
                                                <input className="w-full border p-2" placeholder="State" />
                                                <input className="w-full border p-2" placeholder="City" />
                                                <button className="bg-[#C09578] text-white px-6 py-2">
                                                    Update
                                                </button>
                                            </form>
                                        </div>

                                        {/* SHIPPING */}
                                        <div>
                                            <h4 className="text-lg font-semibold mb-4">Shipping Address</h4>
                                            <form className="space-y-4">
                                                <input className="w-full border p-2" placeholder="Shipping Name" />
                                                <input className="w-full border p-2" placeholder="Shipping Email" />
                                                <input className="w-full border p-2" placeholder="Shipping Mobile" />
                                                <input className="w-full border p-2" placeholder="Shipping Address" />
                                                <select className="w-full border p-2">
                                                    <option>Select Country</option>
                                                    <option>India</option>
                                                </select>
                                                <input className="w-full border p-2" placeholder="State" />
                                                <input className="w-full border p-2" placeholder="City" />
                                                <button className="bg-[#C09578] text-white px-6 py-2">
                                                    Update
                                                </button>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* PROFILE & PASSWORD */}
                            {/* Keep your existing forms – only replace container classes similarly */}

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

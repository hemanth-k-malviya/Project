import React from 'react'
import { FaBars } from "react-icons/fa";
import { RiProfileFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div  className='h-[90px] flex justify-between p-[25px_30px] shadow-xl'>
        <div className='flex mt-[10px] text-[20px] '>
            <FaBars className='mt-[6px]'/>
            <h3 className='ml-[10px] text-black'>Dashbord</h3>
        </div>
        <figure className='relative group w-12 h-12 cursor-pointer rounded-full'>
        <img src='https://i.pinimg.com/736x/bc/b2/3c/bcb23cb2c58aa5604164303f0a9194a1.jpg' className='w-[50px] h-[50px] rounded-[50%]'/>
        <HeadDropDown/>
    </figure>
    </div>
  )
}
function HeadDropDown() {
    return (
        <div className="absolute z-50 right-1 top-7 mt-2 hidden group-hover:block p-4">


            <div className="w-48 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-2xl ">

                <Link to={"/profile"} >
                    <button type="button" className="relative inline-flex items-center w-full px-4 py-1.5 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
                        <svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                        Profile
                    </button>
                </Link>
                <Link to={"/company-profile"}>
                    <button type="button" className="relative inline-flex items-center w-full px-4 py-1.5 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
                        <RiProfileFill className='mr-[10px] font-bold' />
                        Company Profile
                    </button>
                </Link>

                <button type="button" className="relative inline-flex items-center w-full px-4 py-3 text-sm font-medium border-t border-black rounded-b-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
                    <svg fill="currentColor" className="w-4 h-4 me-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" /></svg>
                    Logout 
                </button>
            </div>

        </div>
    )
}
import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { GoMail } from "react-icons/go";



export default function ContactUs() {
  return (
    <>
      <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
        <p className='text-[40px] font-bold text-center'> Contact Us</p>
        <div className='flex justify-center' >
          <Link href={'/'}><p className="text-[16px] hover:text-[#C09578]"> Home </p></Link>  
          <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
          <p className="text-[16px] text-[#C09578]">Contact Us </p>
        </div>

        {/* border */}
        <div className='border border-gray-200 m-8'></div>

        {/* Image */}
        <div className='mb-5'>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.203130927924!2d73.00688287552729!3d26.27822137698317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418db2e058c3db%3A0xa39539c73dd83e38!2sLaxmi%20Dairy%20%26%20Provision%20Store!5e0!3m2!1sen!2sin!4v1717396822666!5m2!1sen!2sin"

            className='w-full h-[450px]'
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>




        <div className="grid grid-cols-2 gap-4 my-5">
          <div className="">

            <p className="text-[20px] mt-2 font-bold mx-4">Contact Us </p>
            <div className='border border-gray-200 m-2'></div>

            <div className="flex my-2 mx-4">
              <FaRegAddressCard className='mt-3' />
              <p className='text-[15px] text-gray-600  m-2'> Address : Claritas est etiam processus dynamicus</p>
            </div>
            <div className='border border-gray-200 m-2'></div>

            <div className="flex my-2 mx-4">
              <IoIosCall className='mt-3' />
              <p className='text-[15px] text-gray-600  m-2'>9874561230</p>
            </div>
            <div className='border border-gray-200 m-2'></div>

            <div className="flex my-2 mx-4">
              <GoMail className='mt-3' />
              <p className='text-[15px] text-gray-600  m-2'>monsta@gmail.com</p>
            </div>

          </div>

          <div className="">
            <p className="text-[20px] mt-2 mb-4 font-bold mx-4">Tell us your question</p>
            <div className=" my-2 mx-4">
              <p className='text-[14px] text-gray-700 font-bold  m-2'>Your Name (required)</p>
              <input type="text" placeholder='Name' required className='w-full px-4 py-2 border border-gray-200 text-gray-600  outline-none' />
            </div>

            <div className=" my-2 mx-4">
              <p className='text-[14px] text-gray-700 font-bold  m-2'>Your Email (required)</p>
              <input type="text" placeholder='Email' required className='w-full px-4 py-2 border border-gray-200 text-gray-600  outline-none' />
            </div>

            <div className=" my-2 mx-4">
              <p className='text-[14px] text-gray-700 font-bold  m-2'>Your Mobile Number (required)</p>
              <input type="number" placeholder='Mobile Number' required className='w-full px-4 py-2 border border-gray-200 text-gray-600  outline-none' />
            </div>

            <div className=" my-2 mx-4">
              <p className='text-[14px] text-gray-700 font-bold  m-2'>Subject</p>
              <input type="text" placeholder='Subject' required className='w-full px-4 py-2 border border-gray-200 text-gray-600  outline-none' />
            </div>

            <div className=" my-2 mx-4">
              <p className='text-[14px] text-gray-700 font-bold  m-2'>Your Message (required)</p>
              <textarea placeholder='Message' required className='w-full h-30 px-4 pt-2 border border-gray-200 text-gray-600 outline-none resize-none' />
            </div>

              <button className='border bg-black rounded-[12px] text-white text-[15px] px-5 py-2 mx-4'> Send </button>
          </div>
        </div>
      </div>



    </>
  )
}

import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import Testomonials from './Common/Testomonials';



export default function AboutUs() {
  return (
    <>
      <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
        <p className='text-[40px] font-bold text-center'> AboutUs</p>
        <div className='flex justify-center' >
           <Link href={'/'}><p className="text-[16px] hover:text-[#C09578]"> Home </p></Link> 
          <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
          <p className="text-[16px] text-[#C09578]">About Us </p>
        </div>

        {/* border */}
        <div className='border border-gray-200 m-8'></div>

        {/* Image */}
        <div className='mb-5'>
          <img src="/images/983cc349-1718-4290-b7cd-c8eb20459536-1671213069.jpg" className='w-[1280px]' alt="" />
        </div>

        <div>
          <p className='text-[25px] font-bold text-center'> Welcome to Monsta!</p>
          <p className='text-[15px] text-gray-600 text-center m-2'> Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam, est usus legentis in iis qui facit eorum claritatem.</p>
          <p className='text-[15px] text-[#C09578] text-center m-4'>“There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.”</p>
        </div>

        {/* Why chose us */}
        <div>
          <p className='text-[40px] font-bold text-center'> Why chose us?</p>
          <div className="grid grid-cols-3 gap-2 my-5">
            <div className="mt-25">
              <IoHomeOutline className="text-[40px] text-[#C09578] mx-45 my-3" />
              <p className="text-[16px] font-bold text-center">100% Money Back Guarantee</p>
              <p className='text-[15px] text-gray-600 text-center m-2'>Erat metus sodales eget dolor consectetuer, porta ut purus at et alias, nulla ornare velit amet enim</p>
            </div>

            <div className="mt-25">
              <IoPeopleOutline className="text-[40px] text-[#C09578] mx-45 my-3" />
              <p className="text-[16px] font-bold text-center">Online Support 24/7</p>
              <p className='text-[15px] text-gray-600 text-center m-2'>Erat metus sodales eget dolor consectetuer, porta ut purus at et alias, nulla ornare velit amet enim</p>
            </div>

            <div className="">
              <img src="/images/d86a55b7-bbd1-4565-86ad-b3463e728fdc-1760712425.jpg" alt="" />
              <p className="text-[16px] font-bold text-center">Creative-Design</p>
              <p className='text-[15px] text-gray-600 text-center m-2'>Erat metus sodales eget dolor consectetuer, porta ut purus at et alias, nulla ornare velit amet enim God has created everything like air,water,tree and metal</p>
            </div>

          </div>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-2 my-5">
            <div className="">
               <img src="/images/dbfbc372-1550-40ef-a372-19566e1776b2-1671213170.jpg" alt="" />
              <p className="text-[15px] mt-2 font-bold text-center">What Do We Do? </p>
              <p className='text-[15px] text-gray-600 text-center m-2'>Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima.</p>
            </div>

            <div className="">
               <img src="/images/0eb1dffc-23c4-4a66-bb02-f5028e3658d3-1671213170.jpg" alt="" />
              <p className="text-[15px] mt-2 font-bold text-center">Our Mission</p>
              <p className='text-[15px] text-gray-600 text-center m-2'>Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima.</p>
            </div>

            <div className="">
              <img src="/images/028a3c98-0fb9-4fc0-8e7c-0076d254de41-1671213170.jpg" alt="" />
              <p className="text-[15px] mt-2 font-bold text-center">History Of Us</p>
              <p className='text-[15px] text-gray-600 text-center m-2'>Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima.</p>
            </div>

          </div>
        </div>

        {/* Testomonials */}
        <Testomonials/>

      </div>
    </>
  )
}

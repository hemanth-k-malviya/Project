import React from 'react'
import Header from '../Comman/Header'
import Left from '../leftside/Left'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function Layout() {
  return (
    <>
    <ToastContainer/>
      <div className='grid grid-cols-[17%_auto] w-[full]  '>
        <div className=''><Left /></div>
        <div className=''><Header />
          <Outlet />
        </div>
      </div>
    </>

  )
}


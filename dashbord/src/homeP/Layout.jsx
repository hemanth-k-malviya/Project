import React from 'react'
import Header from '../Comman/Header'
import Left from '../leftside/Left'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* ✅ Sidebar fixed */}
      <div className="w-[280px] fixed h-screen shadow-lg bg-[#0e2135]">
        <Left />
      </div>

      {/* ✅ Main Content pushed to the right */}
      <div className="ml-[280px] min-h-screen">  

        {/* Header */}
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <Header />
        </div>

        {/* Page Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  )
}

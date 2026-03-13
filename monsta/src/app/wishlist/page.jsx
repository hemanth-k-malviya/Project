'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import Cookies from 'js-cookie';
import { IoIosArrowForward } from 'react-icons/io';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const user = Cookies.get('user_login');
      const loggedIn = !!user;
      setIsLoggedIn(loggedIn);
      if (!loggedIn) {
        setItems([]);
        return;
      }
      const stored = Cookies.get('wishlist');
      const wishlist = stored ? JSON.parse(stored) : [];
      setItems(Array.isArray(wishlist) ? wishlist : []);
    } catch {
      setItems([]);
    }
  }, []);

  const handleRemove = (id) => {
    try {
      const filtered = items.filter((item) => (item._id || item.id) !== id);
      setItems(filtered);
      Cookies.set('wishlist', JSON.stringify(filtered), { expires: 7 });
    } catch {
      // ignore
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1280px] w-full mx-auto my-10 px-4">
        <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
        <p className="text-gray-600">Please login to view your wishlist.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] w-full mx-auto my-10 px-4">
        <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
        <p className="text-gray-600">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-[1280px] w-full mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className='text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-[#C09578] to-gray-800 bg-clip-text text-transparent'>My Wishlist</h1>
          <div className='flex justify-center items-center gap-2 text-sm'>
            <Link href="/" className="text-gray-600 hover:text-[#C09578] transition font-medium">Home</Link>
            <IoIosArrowForward className='text-[#C09578]' />
            <p className="text-[#C09578] font-semibold">My Wishlist</p>
          </div>
        </div>

        {/* border */}
        <div className='border border-gray-200 m-8'></div>

        <div className="grid grid-cols-4 gap-4">
          {items.map((v, i) => {
            const productId = v._id || v.id;
            return (
              <div key={productId || i} className="w-full h-[420px] border-2 border-gray-200 rounded-xl shadow-md bg-white flex flex-col">
                <Link href={`/products-details/${productId}`} className="flex-1 flex flex-col">
                  <div className="relative w-full h-[240px] bg-gray-100 rounded-t-lg overflow-hidden">
                    {v.image ? (
                      <img
                        className="w-full h-full object-cover"
                        alt={v.name}
                        src={`${v.imagePath || ''}${v.image}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(productId);
                      }}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <CiHeart size={24} />
                    </button>
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-center">
                      <p className="py-1 text-gray-600 text-sm">
                        {v?.parent_category?.name || 'Product'}
                      </p>
                      <h4 className="py-1 font-semibold">{v.name}</h4>
                      <p className="py-1">
                        <del className="text-gray-400">Rs. {v.actual_price}</del>{' '}
                        <span className="text-[#C09578] font-bold">Rs.{v.sale_price}</span>
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(productId)}
                  className="w-full text-sm bg-gray-100 text-gray-700 py-2 rounded-b-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
                >
                  Remove from Wishlist
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


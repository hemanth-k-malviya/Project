'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CiHeart } from 'react-icons/ci'
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify'
import ProductCard from './ProductCard'
import Upsell from './Upsell'


export default function ProductDetails({ id: idProp }) {
    const { id: idFromParams } = useParams();
    const id = idProp ?? idFromParams;
    const [productDetails, setProductDetails] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const baseUrl = (process.env.NEXT_PUBLIC_APIS_URL || '').trim();
        axios.post(`${baseUrl}/products/details/${id}`)
            .then((result) => {
                if (result.data._status === true) {
                    setProductDetails(result.data._data || '');
                    setImageUrl(result.data.image_path || '');
                } else {
                    setProductDetails(null);
                }
            })
            .catch(() => {
                toast.error('Something went wrong !!');
                setProductDetails(null);
            })
            .finally(() => setLoading(false));
    }, [id]);
    if (loading) {
        return (
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4 flex justify-center items-center min-h-[200px]">
                <p className="text-gray-500">Loading product...</p>
            </div>
        );
    }

    if (!productDetails) {
        return (
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4 flex justify-center items-center min-h-[200px]">
                <p className="text-gray-500">Product not found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                <p className='text-[40px] font-bold text-center'>{productDetails.name}</p>
                <div className='flex justify-center' >
                    <p className="text-[16px] hover:text-[#C09578]"> Home </p>
                    <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
                    <p className="text-[16px] text-[#C09578]">{productDetails.name}</p>
                </div>

                {/* border */}
                <div className='border border-gray-200 m-8'></div>

                <div className='grid grid-cols-2 gap-6'>
                    <div className="">
                        <img src={`${imageUrl}${productDetails.image}`} alt={productDetails.name} />
                        <div className='grid grid-cols-6 gap-2 ml-17 mt-4'>
                            <img src={`${imageUrl}${productDetails.image}`} alt="" className='w-30 h-18' />
                            <img src={`${imageUrl}${productDetails.image}`} alt="" className='w-30 h-18' />
                            <img src={`${imageUrl}${productDetails.image}`} alt="" className='w-30 h-18' />
                            <img src={`${imageUrl}${productDetails.image}`} alt="" className='w-30 h-18' />
                            <img src={`${imageUrl}${productDetails.image}`} alt="" className='w-30 h-18' />
                        </div>
                    </div>

                    <div className="">
                        <h4 className='py-2 font-semibold text-[25px]'>{productDetails.name}</h4>
                        <p className='py-2'><del className='text-gray-400'>Rs.{productDetails.actual_price}</del> <span className='text-[#C09578] font-bold'>Rs.{productDetails.sale_price}</span></p>
                        <p className='text-[15px] text-gray-700'>{productDetails.short_description}</p>

                        {/* border */}
                        <div className='border border-gray-200 my-5'></div>

                        <button type="submit" className='bg-[#C09578] hover:bg-black text-white rounded px-15 py-2 my-3'>Add To Cart</button>
                        <p className='text-[15px] font-semibold py-1'>Code : <span className='mr-2 text-gray-600'>{productDetails.code}</span></p>
                        <p className='text-[15px] font-semibold py-1'>Dimension : <span className='mr-2 text-gray-700 '>{productDetails.dimension}</span></p>
                        <p className='text-[15px] font-semibold py-1'>Estimate Delivery Days : <span className='mr-2 text-gray-700 '>{productDetails.estimate_delivery_days}</span></p>
                        {productDetails?.parent_category && (
                            <p className='text-[15px] font-semibold py-1'>
                                Category :{' '}
                                <span className='mr-2 text-gray-700 '>
                                    {Array.isArray(productDetails.parent_category)
                                        ? productDetails.parent_category
                                            .map((v) => v?.name ?? '')
                                        //   .filter(Boolean)
                                        //   .join(', ')
                                        : productDetails.parent_category?.name ?? productDetails.parent_category}
                                </span>
                            </p>
                        )}
                        {productDetails?.color_ids && (
                            <p className='text-[15px] font-semibold py-1'>
                                Color :{' '}
                                <span className='mr-2 text-gray-700 '>
                                    {Array.isArray(productDetails.color_ids)
                                        ? productDetails.color_ids
                                            .map((v) => v?.name ?? '')
                                            .filter(Boolean)
                                            .join(', ')
                                        : productDetails.color_ids?.name ?? productDetails.color_ids}
                                </span>
                            </p>
                        )}
                        {productDetails?.material_ids && (
                            <p className='text-[15px] font-semibold py-1'>
                                Material :{' '}
                                <span className='mr-2 text-gray-700 '>
                                    {Array.isArray(productDetails.material_ids)
                                        ? productDetails.material_ids
                                            .map((v) => v?.name ?? '')
                                            .filter(Boolean)
                                            .join(', ')
                                        : productDetails.material_ids?.name ?? productDetails.material_ids}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
                <div className="">
                    <p className='text-[30px] text-[#C09578] font-semibold mt-5'>Description</p>
                    {/* border */}
                    <div className='border border-gray-200 my-2'></div>
                    <p className='text-[15px] text-gray-700'>{productDetails.description}</p>
                </div>

                {/* Related products */}
                <div className="max-w-[1280px] w-full mx-auto my-10 ">
                    <div className='flex'>
                        <p className='text-[30px] font-bold '>Related Products</p>
                        <div className='w-[940px] border-b-1 border-gray-300 mb-5 ml-2'></div>
                    </div>

                    <ProductCard />
                </div>

                {/* Upsell products */}
                <Upsell />

            </div>
        </>
    )
}

"use client"
import React, { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { MdAdd } from 'react-icons/md'
import { MdRemove } from 'react-icons/md'
import Link from 'next/link';
import axios from 'axios'
import { toast } from 'react-toastify'

export default function FAQS() {
    const [openIndex, setOpenIndex] = useState(null);
    const [faqs, setFaqs] = useState([])

    // const faqs = [
    //     {
    //         question: 'What is your return policy?',
    //         answer: 'We offer a 30-day return policy on all unused and undamaged products. Items must be returned in their original packaging with all accessories.'
    //     },
    //     {
    //         question: 'How long does delivery take?',
    //         answer: 'Standard delivery takes 5-7 business days. Express delivery is available for 2-3 business days. You can track your order in real-time through our website.'
    //     },
    //     {
    //         question: 'Do you offer international shipping?',
    //         answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Please check our shipping page for more details.'
    //     },
    //     {
    //         question: 'Is my payment information secure?',
    //         answer: 'Yes, we use industry-standard SSL encryption to protect all payment information. We never store complete credit card details on our servers.'
    //     },
    //     {
    //         question: 'Can I cancel or modify my order?',
    //         answer: 'Orders can be cancelled or modified within 2 hours of placement. After that, the order enters our fulfillment process and cannot be changed. Contact our support team for assistance.'
    //     },
    //     {
    //         question: 'Do you have a loyalty program?',
    //         answer: 'Yes! Our members earn points on every purchase which can be redeemed for discounts and exclusive offers. Sign up today to start earning rewards.'
    //     }
    // ]

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_APIS_URL}/faqs/view`)
            .then((result) => {
                if(result.data._status === true){
                    setFaqs(result.data._data)
                }else{
                    setFaqs([])
                }
            })
            .catch(() => {
                toast.error('Something Went Wrong !!')
            })
    })

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <>
            <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
                <p className='text-[40px] font-bold text-center'>Frequently Questions</p>
                <div className='flex justify-center'>
                    <Link href={'/'}><p className="text-[16px] hover:text-[#C09578]">Home </p></Link>
                    <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
                    <p className="text-[16px] text-[#C09578]">Frequently Asked Questions</p>
                </div>

                {/* border */}
                <div className='border border-gray-200 m-8'></div>

                {/* FAQ Section */}
                <div className='my-8'>
                    <div className='max-w-full mx-auto'>
                        {faqs.map((faq, index) => (
                            <div key={index} className='mb-4'>
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className='w-full flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-5 border border-gray-200 rounded-lg transition-all duration-200'
                                >
                                    <p className='text-[16px] font-semibold text-gray-800 text-left'>{faq.question}</p>
                                    <div className='text-[#C09578] text-[20px]'>
                                        {openIndex === index ? <MdRemove /> : <MdAdd />}
                                    </div>
                                </button>

                                {openIndex === index && (
                                    <div className='bg-gray-50 p-5 border border-gray-200 border-t-0 rounded-b-lg'>
                                        <p className='text-[15px] text-gray-600 leading-relaxed'>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support Section */}
                <div className='bg-gray-50 p-8 rounded-lg my-10 border border-gray-200 text-center'>
                    <p className='text-[24px] font-bold mb-3'>Didn&apos;t find your answer?</p>
                    <p className='text-[16px] text-gray-600 mb-5'>Our support team is here to help. Contact us anytime!</p>
                    <button className='bg-[#C09578] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a87a60] transition-all duration-200'>
                        Contact Support
                    </button>
                </div>
            </div>
        </>
    )
}

import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../Comman/Breadcrumb';
import axios from 'axios';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';

export default function Orders() {
  let [orderModal, setOrderModal] = useState(false);
  const [orderDetails, setORderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getImageUrl = (filePath) => {
    if (!filePath) return '';

    // If backend already sent a full URL, use it directly
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const base = (import.meta.env.VITE_BASE_URL || '').replace(/\/$/, '');
    if (!base) return filePath;

    // If path already contains uploads/, prepend only base URL
    if (filePath.startsWith('/uploads/') || filePath.includes('uploads/')) {
      return `${base}/${filePath.replace(/^\//, '')}`;
    }

    // Default: assume filename stored, build products path
    return `${base}/uploads/products/${filePath}`;
  };
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_WEBSITE_ORDERS}/view`, {
      page: currentPage,
    })
      .then((result) => {
        if (result.data._status == true) {
          setORderDetails(result.data._data);
          setTotalPage(result.data._paginate.total_page);
        } else {
          setORderDetails([])
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
      })
  }, [currentPage])


  const singleCheckBox = (id) => {

    const checkValue = checkBoxValues.filter((v) => {
      if (v == id) {
        return v;
      }
    })

    if (checkValue.length > 0) {
      const finalValue = checkBoxValues.filter((v) => {
        if (v != id) {
          return v;
        }
      })
      setCheckBoxValues([...finalValue]);

      if (finalValue.length > 0) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }

    } else {
      var newData = [...checkBoxValues, id]
      setCheckBoxValues(newData);

      if (newData.length > 0) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }
  }

  const allCheckBoxSelect = () => {
    if (checkBoxValues.length == products.length) {
      setCheckBoxValues([]);
      setButtonDisabled(true);
    } else {
      setCheckBoxValues([]);

      const ids = [];
      products.forEach((v) => {
        ids.push(v._id);
      })

      setCheckBoxValues([...ids]);
      setButtonDisabled(false);
    }
  }

  const deleteRecords = () => {
    axios.put(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/delete`, {
      ids: checkBoxValues
    })
      .then((result) => {
        if (result.data._status == true) {
          toast.success(result.data._message);
          setAPIStatus(!apiStatus)
          setCheckBoxValues([]);
          setButtonDisabled(true);
        } else {
          toast.error(result.data._message);
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
      })
  }

  return (
    <section className="w-full">
      <Breadcrumb path={"Orders"} />

      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            Order's List
          </h3>
          <div className="border border-t-0 rounded-b-md border-slate-400">
            <div className="relative overflow-x-auto">
              <table className="w-full  text-left rtl:text-right text-gray-500 ">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      {/* Delete button wiring can be added here if needed */}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      S. No.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orderDetails.length > 0
                      ?
                      orderDetails.map((v, i) => {
                        return (
                          <tr key={v._id || i} className="bg-white border-b">
                            <th
                              scope="row"
                              className="px-6 py-4 text-[18px] font-semibold text-gray-900 whitespace-nowrap ">
                              <input
                                id={`order-checkbox-${v._id || i}`}
                                name="deleteCheck"
                                type="checkbox"
                                value={v._id}
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 " />
                            </th>
                            <td className="px-6 py-4 font-bold">{i + 1}</td>
                            <td className="px-6 py-4">{v.order_number}</td>
                            <td className="px-6 py-4 font-semibold">
                              {v.first_name}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {v.product_info?.length || 0}
                            </td>
                            <td className="px-6 py-4">₹ {v.total_amount}</td>
                            <td className="px-6 py-4">
                              {v.created_at
                                ? new Date(v.created_at).toISOString().slice(0, 10)  // "2026-03-10"
                                : ''}
                            </td>
                            <td className="px-6 py-4">
                              {v.payment_status === 1
                                ? 'Pending'
                                : v.payment_status === 2
                                  ? 'Success'
                                  : v.payment_status === 3
                                    ? 'Failed'
                                    : ''}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => {
                                  setSelectedOrder(v);
                                  setOrderModal(true);
                                }}
                                data-modal-target="order-modal"
                                data-modal-toggle="order-modal"
                                type="button"
                                className=" mt-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                View
                              </button>
                            </td>
                          </tr>
                        )

                      })
                      :
                      ''
                  }
                </tbody >
              </table>
            </div>
            <div className="w-full flex justify-center m-3">
              <ResponsivePagination
                current={currentPage}
                total={totalPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
      {orderModal === true && selectedOrder && (
        <div
          id="order-modal"
          className="block overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="fixed w-full h-screen" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}></div>
          <div className="relative p-4 px-20 w-full max-w-full max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 className="text-xl font-semibold text-gray-900">
                  Product Image's & Price
                </h3>
                <button
                  onClick={() => {
                    setOrderModal(false);
                    setSelectedOrder(null);
                  }}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="order-modal">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14">
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <div className="grid grid-cols-[58%_27%] gap-10 justify-between">
                  <div className="space-y-8">
                    {selectedOrder.product_info?.map((product, idx) => (
                      <div key={idx} className="flex gap-8 items-center">
                        <img
                          className="w-28"
                          src={getImageUrl(product.image)}
                          alt={product.name}
                        />
                        <div>
                          <h3 className="text-red-600 font-semibold">{product.name}</h3>
                          <ul className="space-y-2 mt-3">
                            <li className="font-semibold text-[17px]">
                              Price :
                              <span className="font-normal text-[16px] ">
                                &nbsp; ₹ {product.price}
                              </span>
                            </li>
                            <li className="font-semibold text-[17px]">
                              Quantity :
                              <span className="font-normal text-[16px] ">
                                &nbsp; {product.quantity}
                              </span>
                            </li>
                            <li className="font-semibold text-[17px]">
                              Size :
                              <span className="font-normal text-[16px] ">
                                &nbsp; 72L * 32H * 30W
                              </span>
                            </li>
                            <li className="font-semibold text-[17px]">
                              Color :
                              <span className="font-normal text-[16px] ">
                                &nbsp; Red
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-2 rounded-md shadow-md p-3">
                    <h3 className=" font-semibold text-[20px]">Product Details</h3>
                    <p className="mt-1">
                      {selectedOrder.shipping_address?.address},
                      {selectedOrder.shipping_address?.city},
                      {selectedOrder.shipping_address?.state},
                      {selectedOrder.shipping_address?.country}
                    </p>
                    <h3 className=" font-semibold text-[20px] mt-8">Order Summary</h3>
                    <ul className="space-y-4 mt-4">
                      <li className="font-semibold text-[17px]">
                        Item(s) Subtotal :
                        <span className="font-normal text-[16px] ">
                          &nbsp; ₹ {selectedOrder.total_amount}
                        </span>
                      </li>
                      <li className="font-semibold text-[17px]">
                        Online / Cash on Delivery :
                        <span className="font-normal text-[16px] ">
                          &nbsp;  {selectedOrder.payment_type}
                        </span>
                      </li>
                      <li className="font-semibold text-[17px]">
                        Shipping :
                        <span className="font-normal text-[16px] ">
                          &nbsp; ₹ 0
                        </span>
                      </li>
                      <li className="font-semibold text-[17px]">
                        Grand Total:
                        <span className="font-normal text-[16px] ">
                          &nbsp; ₹ {selectedOrder.total_amount}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section >
  )
}

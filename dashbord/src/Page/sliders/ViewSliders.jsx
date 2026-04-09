import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import axios from 'axios';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { toast } from 'react-toastify';

export default function ViewSliders() {
  let [activeFilter, setactiveFilter] = useState(true);
  const [slider, setslider] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [checkBoxValues, setCheckBoxValues] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [apiStatus, setAPIStatus] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SLIDER_API}/view`, {
      page: currentPage,
      name: searchName
    })
      .then((result) => {
        if (result.data._status == true) {
          setslider(result.data._data)
          setImageUrl(result.data._image_path)
          setTotalPage(result.data._paginate.total_page)
        } else {
          setslider([]);
          setTotalPage(1);
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
      })
  }, [currentPage, searchName, apiStatus]);


  // const searchHandler = (event) => {
  //   event.preventDefault();
  //   setCurrentPage(1);
  //   setSearchName(event.target.name.value);
  // }

  // const filterByName = (event) => {
  //   setCurrentPage(1);
  //   setSearchName(event.target.value);
  // }

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
    if (checkBoxValues.length == slider.length) {
      setCheckBoxValues([]);
      setButtonDisabled(true);
    } else {
      setCheckBoxValues([]);

      const ids = [];
      slider.forEach((v) => {
        ids.push(v._id);
      })

      setCheckBoxValues([...ids]);
      setButtonDisabled(false);
    }
  }

  const changeStatus = () => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SLIDER_API}/change-status`, {
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
  const changeSingleStatus = (id) => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SLIDER_API}/change-status`, {
      ids: [id]
    })
      .then((result) => {
        if (result.data._status == true) {
          toast.success(result.data._message);
          setAPIStatus(!apiStatus);
        } else {
          toast.error(result.data._message);
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
      })
  }

  const deleteRecords = () => {
    axios.put(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SLIDER_API}/delete`, {
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

      <nav className="flex border-b-2" aria-label="Breadcrumb">
        <ol className="p-3 px-6 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center ">
            <Link to={"/home"} className="inline-flex items-center text-md font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              /
              <Link to={"/slider/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Slider</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">View</span>
            </div>
          </li>
        </ol>
      </nav>


      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <div className='flex item-center justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
            <h3 className="text-[26px] font-semibold" >
              View Slider
            </h3>
            <div className='flex justify-between '>

              <button
                type="button"
                onClick={changeStatus}
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" disabled={buttonDisabled ? 'disabled' : ''}> Change Status</button>


              <button type="button"
                onClick={deleteRecords}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" disabled={buttonDisabled ? 'disabled' : ''}>Delete </button>

            </div>

          </div>
          <div className="border border-t-0 rounded-b-md border-slate-400">

            {/* border-2 border-[red] */}
            <div className="relative overflow-x-auto">


              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">

                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="p-4">
                        <div class="flex items-center">
                          <input
                            id="checkbox-all-search"
                            onClick={allCheckBoxSelect}
                            checked={checkBoxValues.length == slider.length ? 'checked' : ''}

                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label for="checkbox-all-search" class="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" class=" w-[10%] ">
                        Image
                      </th>
                      <th scope="col" class=" w-[8%] ">
                        Order
                      </th>
                      <th scope="col" class="w-[11%]">
                        Status
                      </th>
                      <th scope="col" class="w-[6%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      slider.length > 0
                        ?
                        slider.map((v, i) => {
                          return (
                            <tr class="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50     dark:hover:bg-gray-600">
                              <td class="w-4 p-4">
                                <div class="flex items-center">
                                  <input id="checkbox-table-search-1"

                                    checked={checkBoxValues.includes(v._id) ? 'checked' : ''}

                                    onClick={() => singleCheckBox(v._id)}

                                    type="checkbox"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                                </div>
                              </td>
                              <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">

                                <div class="py-4">
                                  <div class="text-base font-semibold">{v.name}</div>

                                </div>
                              </th>
                              <td class=" py-4">
                                {
                                  v.imageUrl != ""
                                    ?
                                    <img class="w-10 h-10 rounded-full" src={`${imageUrl}${v.image}`} />
                                    :
                                    "N/A"
                                }

                              </td>
                              <td class=" py-4">
                                {v.order}
                              </td>
                              <td class=" py-4">
                              {
                                  v.status == 1
                                    ?
                                    <button
                                      type="button"
                                      onClick={() => changeSingleStatus(v._id)}
                                      class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">
                                      Active
                                    </button>
                                    :
                                    <button
                                      type="button"
                                      onClick={() => changeSingleStatus(v._id)}
                                      class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">
                                      Deactive
                                    </button>
                                }

                              </td>
                              <td class=" py-4">

                                <Link to={`/Sliders/update/${v._id}`} >
                                  <div className="rounded-[50%] w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <MdModeEdit className='text-[18px]' />
                                  </div>
                                </Link>
                              </td>
                            </tr>
                          )
                        })
                        :
                        <tr class="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">

                          <td colSpan={6} class=" px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">

                            <div class="py-4">
                              <div class="text-base font-semibold text-center">No Record Found !</div>

                            </div>
                          </td>
                        </tr>
                    }
                  </tbody>
                </table>
                <div className='w-full mx-auto m-3 flex justify-center'>
                  <ResponsivePagination
                    current={currentPage}
                    total={totalPage}
                    onPageChange={setCurrentPage} />
                </div>
              </div>


            </div>

          </div>
        </div>
      </div>



    </section>
  )
}

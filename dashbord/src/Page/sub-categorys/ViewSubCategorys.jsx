import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { FaFilter } from 'react-icons/fa';
import Breadcrumb from '../../Comman/Breadcrumb';
import axios from 'axios';
import { toast } from 'react-toastify';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';

export default function ViewSubCategorys() {
  let [activeFilter, setactiveFilter] = useState(true);
  let [activeDropDown, setactiveDropDown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchParentCategory, setSearchParentCategory] = useState('');
  const [checkBoxValues, setCheckBoxValues] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [apiStatus, setAPIStatus] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  // view category
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_CATEGORY_API}/view-category`)
      .then((result) => {
        if (result.data._status == true) {
          setCategories(result.data._data)
        } else {
          setCategories([]);
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
      })
  }, []);

   const filterByName = (event) => {
        setCurrentPage(1);
        setSearchName(event.target.value);
    }
     const filterByParentCategory = (event) => {
        setCurrentPage(1);
        setSearchParentCategory(event.target.value);
    }

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
        if (checkBoxValues.length == subCategories.length) {
            setCheckBoxValues([]);
            setButtonDisabled(true);
        } else {
            setCheckBoxValues([]);

            const ids = [];
            subCategories.forEach((v) => {
                ids.push(v._id);
            })

            setCheckBoxValues([...ids]);
            setButtonDisabled(false);
        }
    }

    const changeStatus = () => {
        axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_CATEGORY_API}/change-status`, {
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

    const deleteRecords = () => {
        axios.put(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_CATEGORY_API}/delete`, {
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


  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_CATEGORY_API}/view`, {
      page: currentPage,
      name: searchName,
      parent_category: searchParentCategory
    })
      .then((result) => {
        if (result.data._status == true) {
          setSubCategories(result.data._data)
          setImageUrl(result.data.image_path)
          setTotalPage(result.data._paginate.total_pages)
        } else {
          setSubCategories([]);
          setTotalPage(1);
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
      })
  }, [currentPage, searchName, apiStatus, searchParentCategory]);


  return (

    <section className="w-full">

      <Breadcrumb path={"sub-category"} link={'/category/sub-category/view'} path2={"View"} slash={"/"} />

      <div className={`rounded-lg border border-gray-300 px-5 py-5 max-w-[1220px] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

        <form className="grid grid-cols-[40%_35%_5%] gap-[1%] items-center ">
          <div className="">

            <select
              name="parentCatSelectBox"
              onChange={filterByParentCategory}
              className="border  border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-3"
            >
              <option value="">Select Parent Category</option>
              {
                categories.map((v, i) => {
                  return (
                    <option value={v._id}>{v.name}</option>
                  )

                })
              }
            </select>
          </div>
          <div className="">
            <input
              type="text"
              id="simple-search"
              className="border  border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-3"
              placeholder="Search  name..."
              required
            />
          </div>
          <div className=''>
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>



        </form>


      </div>
      <div className="w-full min-h-[610px]">
                    <div className="max-w-[1220px] mx-auto py-5">
                        <div className='flex item-center justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
                            <h3 className="text-[26px] font-semibold" >
                                View Sub Category
                            </h3>
                            <div className='flex justify-between '>
                                <div onClick={() => setactiveFilter(!activeFilter)} className="cursor-pointer text-white mx-3 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
                                </div>

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
                            <div className="relative overflow-y-auto">


                                <div class="relative shadow-md sm:rounded-lg">

                                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="p-4">
                                                    <div class="flex items-center">
                                                        <input
                                                            id="checkbox-all-search"
                                                            onClick={allCheckBoxSelect}
                                                            checked={checkBoxValues.length == subCategories.length ? 'checked' : ''}

                                                            type="checkbox"
                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label for="checkbox-all-search" class="sr-only">checkbox</label>
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Parent Category Name
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Sub Category Name
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
                                                subCategories.length > 0
                                                    ?
                                                    subCategories.map((v, i) => {
                                                        return (
                                                            <tr class="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                                                                    {v.name}
                                                                </td>
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
                                                                            <button type="button" class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Active</button>
                                                                            :
                                                                            <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Deactive</button>
                                                                    }



                                                                </td>
                                                                <td class=" py-4">

                                                                    <Link to={`/sub-category/update/${v._id}`} >
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
                                    <div className='w-300 auto mb-3'>
                                        <ResponsivePagination
                                            current={currentPage}
                                            total={totalPage}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>



    </section>
  )
}

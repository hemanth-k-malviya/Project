import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Breadcrumb from '../../Comman/Breadcrumb';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';

export default function Users() {

    let [activeFilter, setactiveFilter] = useState(true);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [checkBoxValue, setcheckBoxValue] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [apiStatus, setApiStatus] = useState(true);

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_WEBSITE_USERS}/view-users`, {
            page: currentPage,
            name: searchName,
            code: searchEmail
        })
            .then((result) => {
                if (result.data._status == true) {
                    setUsers(result.data._data)
                    setTotalPages(result.data._paginate.total_page)
                } else {
                    setUsers([])
                    setTotalPages(1);
                }
            })
            .catch(() => {
                toast.error('Something went wrong !!')
            })
    }, [currentPage, searchName, searchEmail, apiStatus])

    const searchHandler = (event) => {
        event.preventDefault();
        setCurrentPage(1);
        setSearchName(event.target.name.value);
        setSearchEmail(event.target.email.value);

    }

    const filterByName = (event) => {
        setCurrentPage(1);
        setSearchName(event.target.value);
    }

    const filterByEmail = (event) => {
        setCurrentPage(1);
        setSearchEmail(event.target.value);
    }

    const singlrCheckBox = (id) => {

        const checkValue = checkBoxValue.filter((v) => {
            if (v == id) {
                return v;
            }
        })
        if (checkValue.length > 0) {
            const finalValue = checkBoxValue.filter((v) => {
                if (v != id) {
                    return v;
                }
            })
            setcheckBoxValue([...finalValue]);
            if (checkBoxValue.length > 0) {
                setButtonDisabled(false);
            } else {
                setButtonDisabled(true);
            }
        } else {
            var newData = [...checkBoxValue, id]
            setcheckBoxValue(newData);
            if (newData.length > 0) {
                setButtonDisabled(false);
            } else {
                setButtonDisabled(true);
            }
        }

    }



    const allCheckBoxSelect = () => {
        if (checkBoxValue.length == users.length) {
            setcheckBoxValue([]);
            setButtonDisabled(true);
        } else {
            setcheckBoxValue([]);
            const ids = [];

            colors.forEach((v) => {
                ids.push(v._id);
            })
            setcheckBoxValue([...ids]);
            setButtonDisabled(false);
        }
    }

    const changestatus = () => {
        axios.post(`${import.meta.env.VITE_WEBSITE_USERS}/change-status`, {
            ids: checkBoxValue
        })
            .then((result) => {
                if (result.data._status == true) {
                    toast.success(result.data._message);
                    setApiStatus(!apiStatus);
                    setcheckBoxValue([]);
                    setButtonDisabled(true)
                } else {
                    toast.error(result.data._message)
                }
            })
            .catch(() => {
                toast.error('Something went wrong !!')
            })
    }

    const deleteRecords = () => {
        axios.put(`${import.meta.env.VITE_WEBSITE_USERS}/delete`, {
            ids: checkBoxValue
        })
            .then((result) => {
                if (result.data._status == true) {
                    toast.success(result.data._message);
                    setApiStatus(!apiStatus)
                    setcheckBoxValue([]);
                    setButtonDisabled(true)
                } else {
                    toast.error(result.data._message)
                }
            })
            .catch(() => {
                toast.error('Something went wrong !!')
            })
    }

    return (
       <section className="w-full">

      <Breadcrumb path={"User"} link={"/user"} path2={"View"} slash={"/"} />

      <div className={`bg-gray-50 px-2 py-5 max-w-[1220px] duration-[1s] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

        <form className="flex " autoComplete='off' onSubmit={searchHandler}>
          <div className="relative w-full me-4">
            <input
              type="text"
              id="simple-search"
              name='name'
              onKeyUp={filterByName}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search  name..."

            />
          </div>
          <div className="relative w-full me-4">
            <input
              type="text"
              id="code"
              name='code'
              onKeyUp={filterByEmail}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search  email..."

            />
          </div>
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
        </form>

      </div>
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <div className='flex item-center justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
            <h3 className="text-[26px] font-semibold" >
              View Users
            </h3>
            <div className='flex justify-between '>
              <div onClick={() => setactiveFilter(!activeFilter)} className="cursor-pointer text-white mx-3 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
              </div>

              <button
                type="button"
                onClick={changestatus}
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" disabled={buttonDisabled ? 'disabled' : ''}> Change Status</button>


              <button type="button"
                onClick={deleteRecords}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" disabled={buttonDisabled ? 'disabled' : ''}>Delete </button>
            </div>
          </div>
          <div className="border border-t-0 rounded-b-md border-slate-400">

            {/* border-2 border-[red] */}
            <div className="relative w-full overflow-x-auto">


              <div className="relative w-full shadow-md sm:rounded-lg overflow-x-auto">

                <table className="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all-search"
                            onClick={allCheckBoxSelect}
                            checked={checkBoxValue.length == users.length ? 'checked' : ''}

                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label for="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                         Name
                      </th>
                      <th scope="col" className="  ">
                        Email
                      </th>
                      <th scope="col" className="  ">
                        Number
                      </th>
                      <th scope="col" className="w-[11%]">
                        Status
                      </th>
                      {/* <th scope="col" className="w-[6%]">
                        Action
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      users.length > 0
                        ?
                        users.map((v, i) => {
                          return (
                            <tr class="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td class="w-4 p-4">
                                <div class="flex items-center">
                                  <input id="checkbox-table-search-1"

                                    checked={checkBoxValue.includes(v._id) ? 'checked' : ''}

                                    onClick={() => singlrCheckBox(v._id)}

                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                                </div>
                              </td>
                              <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">

                                <div class="py-4">
                                  <div class="text-base font-semibold">{v.name}</div>

                                </div>
                              </th>
                              <td class=" py-4">
                                {v.email}
                              </td>
                              <td class=" py-4">
                                {v.mobile_number}
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
                              {/* <td class=" py-4">

                                  <div className="rounded-[50%] w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <MdModeEdit className='text-[18px]' />
                                  </div>
                              </td> */}
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
                    total={totalPages}
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




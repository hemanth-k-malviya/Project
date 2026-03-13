import React, { useEffect, useState } from 'react'
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from '../../Comman/Breadcrumb';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function AddSubSubCategorys() {

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const params = useParams();
  const [updateId, setUpdateId] = useState('')
  const [imageURL, setImageUrl] = useState('');
  const [subSubCategoryDetails, setSubSubCategoryDetails] = useState('')
  const navigate = useNavigate();
  const [parent_category_id, set_parent_category_id] = useState('');
  const [sub_category_id, set_sub_category_id] = useState('');

  // view category
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_CATEGORY_API}/view-category`, {
      id: parent_category_id
    })
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
  }, [parent_category_id]);

  useEffect(() => {
    if (parent_category_id != '') {
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_SUB_CATEGORY_API}/view-sub-category`, {
        id: sub_category_id,
        parent_category: parent_category_id
      })
        .then((result) => {
          if (result.data._status == true) {
            setSubCategories(result.data._data)
          } else {
            setSubCategories([]);
          }
        })
        .catch(() => {
          toast.error('Something went wrong !!');
        })
    }

  }, [parent_category_id]);

  // Dropify
  useEffect(() => {
    const dropifyElement = $("#image");

    if (dropifyElement.data("dropify")) {
      dropifyElement.data("dropify").destroy();
      dropifyElement.removeData("dropify");
    }

    // **Force Update Dropify Input**
    dropifyElement.replaceWith(
      `<input type="file" accept="image/*" name="image" id="image"
          class="dropify" data-height="250" data-default-file="${imageURL}"/>`
    );

    // **Reinitialize Dropify**
    $("#image").dropify();

  }, [imageURL]); // ✅ Runs when `defaultImage` updates

  useEffect(() => {
    if (params.id != '' && params.id != undefined) {
      setUpdateId(params.id);
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_SUB_CATEGORY_API}/details/${params.id}`)
        .then((result) => {
          if (result.data._status == true) {
            setSubSubCategoryDetails(result.data._data)
            set_parent_category_id(result.data._data.parent_category)
            set_sub_category_id(result.data._data.sub_category)
            if (result.data._data.image != '') {
              setImageUrl(`${result.data.image_path}${result.data._data.image}`)
            }
          } else {
            setSubSubCategoryDetails('');

          }
        })
        .catch(() => {
          toast.error('Something went wrong !!')
        })
    }
  }, [params])

  const formHandler = (event) => {
    event.preventDefault();

    if (!updateId) {
      //add category
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_SUB_CATEGORY_API}/create`, event.target)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            event.target.reset()
            navigate('/sub-sub-categorys/view')
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong!');
        })
    }
    else {
      //update sub sub categories 
      axios.put(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_SUB_SUB_CATEGORY_API}/update/${params.id}`, event.target)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            event.target.reset()
            navigate('/sub-sub-categorys/view')
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong !');
        })
    }
  }

  const changeSubCategotries = (event) => {
    set_parent_category_id(event.target.value)
  }

  return (
    <section className="w-full">
      <Breadcrumb path={"sub-sub-categorys"} link={'/category/sub-sub-category/view'} path2={"Add"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateId ? "Update Sub Sub Category" : "Add Sub Sub Category"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex gap-5">
              <div className="w-1/3">
                <label
                  htmlFor="categoryImage"
                  className="block  text-md font-medium text-gray-900"
                >
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name='image'
                  id="image"
                  className="dropify"
                  data-height="230"
                />

              </div>

              <div className="w-2/3">
                {/* Parent Category Dropdown */}
                <div className="mb-5">
                  <label className="block  text-md font-medium text-gray-900">
                    Parent Category Name
                  </label>
                  <select
                    onClick={changeSubCategotries}
                    name="parent_category"
                    className="border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option value="">Select Category</option>
                    {
                      categories.map((v, i) => {
                        return (
                          <option value={v._id}
                            selected={v._id == subSubCategoryDetails.parent_category ? 'selected' : ''}>{v.name}</option>
                        )

                      })
                    }
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block  text-md font-medium text-gray-900">
                    sub Category Name
                  </label>
                  <select
                    name="sub_category"
                    className="border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option value="">Select Category</option>
                    {
                      subCategories.map((v, i) => {
                        return (
                          <option value={v._id} selected={v._id == subSubCategoryDetails.sub_category ? 'selected' : ''}>{v.name}</option>
                        )

                      })
                    }
                  </select>

                </div>

                <div className="mb-5">
                  <label
                    htmlFor="categoryName"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    name='name'
                    defaultValue={subSubCategoryDetails.name}
                    id="categoryName"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Category Name"
                  />

                </div>

                <div className="mb-5">
                  <label
                    htmlFor="categoryName"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Order
                  </label>
                  <input
                    type="text"
                    name='order'
                    defaultValue={subSubCategoryDetails.order}
                    id="categoryName"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Category Order"
                  />

                </div>

              </div>


            </div>
            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateId ? "Update Sub Sub Category" : "Add Sub Sub  Category"}
            </button>
          </form>


        </div>
      </div>
    </section>
  )
}

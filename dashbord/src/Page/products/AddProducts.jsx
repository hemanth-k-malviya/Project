import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function AddProducts() {

  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubcategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [parent_category_id, set_parent_category_id] = useState('');
  const [sub_category_id, set_sub_category_id] = useState('');
  const [sub_sub_category_id, set_sub_sub_category_id] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const [updateId, setUpdateId] = useState('');
  const [imageURL, setImageUrl] = useState('');
  const [productDetails, setProductDetails] = useState('')
  const [material_id, setMaterial_id] = useState('');
  const [color_id, setColor_id] = useState('');

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/view-materials`)
      .then((result) => {
        if (result.data._status == true) {
          setMaterials(result.data._data);
        }
      })
      .catch(() => {
        toast.error('Something went wrong')
      })

    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/view-colors`)
      .then((result) => {
        if (result.data._status == true) {
          setColors(result.data._data);
        }
      })
      .catch(() => {
        toast.error('Something went wrong')
      })
  }, [])

  // parent category
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/view-parent-category`, {
      id: parent_category_id
    })
      .then((result) => {
        if (result.data._status == true) {
          setCategories(result.data._data);
        }
      })
      .catch(() => {
        toast.error('Something went wrong')
      })

  }, [parent_category_id])

  // Sub category
  useEffect(() => {
    if (parent_category_id != '') {
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/view-sub-category`, {
        id: sub_category_id,
        parent_category: parent_category_id
      })
        .then((result) => {
          if (result.data._status == true) {
            setSubcategories(result.data._data);
          }
        })
        .catch(() => {
          toast.error('Something went wrong')
        })
    }
  }, [parent_category_id])

  // Sub Sub category
  useEffect(() => {
    if (parent_category_id && sub_category_id) {
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/view-sub-sub-category`, {
        id: sub_sub_category_id,
        parent_category: parent_category_id,
        sub_category: sub_category_id
      })
        .then((result) => {
          if (result.data._status) {
            setSubSubCategories(result.data._data);
          } else {
            setSubSubCategories([]);
          }
        })
        .catch(() => toast.error('Something went wrong'));
    }
  }, [parent_category_id, sub_category_id]);



  const selectCategories = (event) => {
    set_parent_category_id(event.target.value)
  }

  const selectSubCategories = (event) => {
    set_sub_category_id(event.target.value);
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    // data.description = value;

    const formData = new FormData();

    // Append all form fields
    Object.keys(data).forEach((key) => {
      if (key === "image" && data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      } else if (key === "images" && data.images && data.images[0]) {
        // formData.append("images", data.images[0]);

        // Multiple images
        for (let i = 0; i < data.images.length; i++) {
          formData.append("images", data.images[i]);
        }
      } else if (key !== "image" && key !== "images") {
        formData.append(key, data[key]);
      }
    });

    if (!updateId) {
      // Add Product
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/create`, formData)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            reset();
            navigate('/products/view');
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong !');
        })
    } else {
      // Update Product
      axios.put(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/update/${updateId}`, formData)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            reset();
            navigate('/products/view');
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong !');
        })
    }

  };

  // update work
  useEffect(() => {
    if (params.id != '' && params.id != undefined) {
      setUpdateId(params.id);
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_PRODUCT_API}/details/${params.id}`)
        .then((result) => {
          if (result.data._status == true) {
            const data = result.data._data;

            // Set only scalar and string values from the API response
            Object.entries(data).forEach(([key, value]) => {
              // Skip arrays, objects (except for nested primitives)
              if (value !== null && typeof value !== 'object') {
                setValue(key, value);
              }
            });

            // Explicitly set dropdown values
            setValue("material_ids", data.material_ids?.[0]?._id || data.material_ids?.[0] || '');
            setValue("color_ids", data.color_ids?.[0]?._id || data.color_ids?.[0] || '');
            setValue("parent_category", data.parent_category?._id || data.parent_category || '');
            setValue("sub_category", data.sub_category?._id || data.sub_category || '');
            setValue("sub_sub_category_ids", data.sub_sub_category_ids?.[0]?._id || data.sub_sub_category_ids?.[0] || data.sub_sub_category || '');

            // Set state values for dropdowns
            setMaterial_id(data.material_ids?.[0]?._id || data.material_ids?.[0] || '');
            setColor_id(data.color_ids?.[0]?._id || data.color_ids?.[0] || '');
            setProductDetails(data);
            set_parent_category_id(data.parent_category?._id || data.parent_category || '');
            set_sub_category_id(data.sub_category?._id || data.sub_category || '');
            set_sub_sub_category_id(data.sub_sub_category_ids?.[0]?._id || data.sub_sub_category_ids?.[0] || data.sub_sub_category || '');

            if (data.image != '') {
              setImageUrl(`${result.data.image_path}${data.image}`);
            }
          } else {
            setProductDetails('');
          }
        })
        .catch(() => {
          toast.error('Something went wrong !!')
        })
    }
    else {
      setUpdateId('')
    }
  }, [params, setValue])

  useEffect(() => {
    $(".dropify").dropify({
      messages: {
        default: "Drag and drop ",
        replace: "Drag and drop ",
        remove: "Remove",
        error: "Oops, something went wrong"
      }
    });
  }, []);

  // Dropify
  //  useEffect(() => {
  //     const dropifyElement = $("#image");

  //     if (dropifyElement.data("dropify")) {
  //       dropifyElement.data("dropify").destroy();
  //       dropifyElement.removeData("dropify");
  //     }

  //     // **Force Update Dropify Input**
  //     dropifyElement.replaceWith(
  //       `<input type="file" accept="image/*" name="image" id="image"
  //           class="dropify" data-height="250" data-default-file="${imageURL}"/>`
  //     );

  //     // **Reinitialize Dropify**
  //     $("#image").dropify();

  //   }, [imageURL]); // ✅ Runs when `defaultImage` updates


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
              <Link to={"/product/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Product</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">{updateId ? "Update" : "Add"}</span>
            </div>
          </li>
        </ol>
      </nav>



      <div className='w-full px-6 py-6  '>

        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="grid grid-cols-3 gap-[10px] ">
            {/* for left */}
            <div className="for-images ">

              <div className="">
                <label
                  htmlFor="ProductImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product Image
                </label>
                {
                  updateId
                    ?
                    <input
                      type="file"
                      name='image'
                      id="image"
                      className="dropify"
                      data-height="160"
                      {...register("image", { required: false })}
                     />
                    :
                    <input
                      type="file"
                      name='image'
                      id="image"
                      className="dropify"
                      data-height="160"
                      {...register("image", { required: "Product Image is required" })}
                    />
                }

                {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
              </div>

              <div className="">
                <label
                  htmlFor="backImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Back Image
                </label>
                <input
                  type="file"
                  id="backImage"
                  className="dropify"
                  data-height="160"
                  {...register("backImage", { required: "Back Image is required" })}
                />

              </div>

              <div className="">
                <label
                  htmlFor="GalleryImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Gallery Image
                </label>
                {
                  updateId
                    ?
                    <input
                      type="file"
                      id="images"
                      name='images[]'
                      className="dropify"
                      data-height="160"
                      multiple="multiple"
                      {...register("image", { required: false })}      
                    />
                    :
                    <input
                      type="file"
                      id="images"
                      name='images[]'
                      className="dropify"
                      data-height="160"
                      multiple="multiple"
                      {...register("image", { required: "Gallery Image is required" })}
                    />
                }

                {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
              </div>
            </div>

            {/* for midd */}
            <div className="middle">
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={productDetails.name}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Prodct Name'
                  {...register("name", { required: "Prodct Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="materialName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Meterial
                </label>
                <select
                  {...register("material_ids", { required: "Meterial is required" })}
                  name="material_ids"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  {
                    materials.map((v, i) => {
                      return (
                        <option key={i} value={v._id} selected={material_id == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }

                </select>
                {errors.material_ids && <p className="text-red-500 text-sm">{errors.material_ids.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Parent Category
                </label>
                <select
                  {...register("parent_category", { required: "Parent Category is required" })}
                  name="parent_category"
                  onChange={selectCategories}
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>

                  {
                    categories.map((v, i) => {
                      return (
                        <option key={i} value={v._id} selected={productDetails.parent_category == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }
                </select>
                {errors.parent_category && <p className="text-red-500 text-sm">{errors.parent_category.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Sub Sub Category
                </label>
                <select
                  {...register("sub_sub_category_ids", { required: "Sub Sub Category is required" })}
                  name="sub_sub_category_ids"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>

                  {
                    subSubCategories.map((v, i) => {
                      return (
                        <option key={i} value={v._id} selected={productDetails.sub_sub_category == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }

                </select>
                {errors.Sub_Sub_Category && <p className="text-red-500 text-sm">{errors.Sub_Sub_Category.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Featured
                </label>
                <select
                  {...register("is_featured", { required: "Is Featured is required" })}
                  name="is_featured"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_featured == 1 ? 'selected' : ''}>Yes</option>
                  <option value="2" selected={productDetails.is_featured == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.is_featured && <p className="text-red-500 text-sm">{errors.is_featured.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="is_onsale"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Onsell
                </label>
                <select
                  {...register("is_onsale", { required: "Is Onsell is required" })}
                  name="is_onsale"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_onsale == 1 ? 'selected' : ''}>Yes</option>
                  <option value="2" selected={productDetails.is_onsale == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.is_onsale && <p className="text-red-500 text-sm">{errors.is_onsale.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="is_top_rated"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Top Rated
                </label>
                <select
                  {...register("is_top_rated", { required: "Top Rated is required" })}
                  name="is_top_rated"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_top_rated == 1 ? 'selected' : ''}>Yes</option>
                  <option value="2" selected={productDetails.is_top_rated == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.is_top_rated && <p className="text-red-500 text-sm">{errors.is_top_rated.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="actual_price"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Actual Price
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.actual_price}
                  {...register("actual_price", { required: " Actual Price is required" })}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Actual Price'
                  name="actual_price"
                />
                {errors.actual_price && <p className="text-red-500 text-sm">{errors.actual_price.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="estimate_delivery_days"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Estimate Delivery Days
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.estimate_delivery_days}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='   Estimate Delivery Days'
                  name="estimate_delivery_days"
                  {...register("estimate_delivery_days", { required: "    Estimate Delivery Days is required" })}
                />
                {errors.estimate_delivery_days && <p className="text-red-500 text-sm">{errors.estimate_delivery_days.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="order"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Order
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.order}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Order'
                  name="order"
                  {...register("order", { required: " Order is required" })}
                />
                {errors.order && <p className="text-red-500 text-sm">{errors.order.message}</p>}
              </div>


            </div>

            {/* for right */}
            <div className="right-items">

              <div className="mb-5">
                <label
                  htmlFor="code"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product code
                </label>
                <input
                  type="text"
                  name="code"
                  defaultValue={productDetails.code}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Prodct Code'
                  {...register("code", { required: "code Name is required" })}
                />
                {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Color
                </label>
                <select
                  {...register("color_ids", { required: "Color is required" })}
                  name="color_ids"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  {
                    colors.map((v, i) => {
                      return (
                        <option key={i} value={v._id} selected={color_id == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }

                </select>
                {errors.color_ids && <p className="text-red-500 text-sm">{errors.color_ids.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Sub Category
                </label>
                <select
                  {...register("sub_category", { required: "Sub Category is required" })}
                  name="sub_category"
                  onChange={selectSubCategories}
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Select Category</option>

                  {
                    subCategories.map((v, i) => {
                      return (
                        <option key={i} value={v._id} selected={productDetails.sub_category == v._id ? 'selected' : ''}>{v.name}</option>
                      )
                    })
                  }

                </select>
                {errors.sub_category && <p className="text-red-500 text-sm">{errors.sub_category.message}</p>}

              </div>


              <div className="mb-5">
                <label
                  htmlFor="is_best_selling"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Best Selling
                </label>
                <select
                  {...register("is_best_selling", { required: " Best Selling is required" })}
                  name="is_best_selling"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_best_selling == 1 ? 'selected' : ''}>Yes</option>
                  <option value="2" selected={productDetails.is_best_selling == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.is_best_selling && <p className="text-red-500 text-sm">{errors.is_best_selling.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="is_new_arrival"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is New Arrival
                </label>
                <select
                  {...register("is_new_arrival", { required: "Is New Arrival is required" })}
                  name="is_new_arrival"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_new_arrival == 1 ? 'selected' : ''}>Yes</option>
                  <option value="2" selected={productDetails.is_new_arrival == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.is_new_arrival && <p className="text-red-500 text-sm">{errors.is_new_arrival.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="is_upsell"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Upsell
                </label>
                <select
                  {...register("is_upsell", { required: "Upsell is required" })}
                  name="is_upsell"
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_upsell == 1 ? 'selected' : ''}>Yes</option>
                  <option value="2" selected={productDetails.is_upsell == 2 ? 'selected' : ''}>No</option>

                </select>
                {errors.is_upsell && <p className="text-red-500 text-sm">{errors.is_upsell.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="quantity"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Total In Stocks
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.quantity}
                  {...register("quantity", { required: "Stocks is required" })}
                  name="quantity"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Total In Stocks'
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="sale_price"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Sale Price
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.sale_price}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder=' Sale Price'
                  name="sale_price"
                  {...register("sale_price", { required: "Sale Price is required" })}
                />
                {errors.sale_price && <p className="text-red-500 text-sm">{errors.sale_price.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="dimension"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Dimension
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.dimension}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Dimension'
                  name="dimension"
                  {...register("dimension", { required: "Dimension is required" })}
                />
                {errors.dimension && <p className="text-red-500 text-sm">{errors.dimension.message}</p>}
              </div>

            </div>
          </div>


          <div className='py-[40px]'>
            <label
              htmlFor="short_description"
              className="block  text-md font-medium text-gray-900 text-[#76838f]">
              Short Description
            </label>
            <textarea
              {...register("short_description", { required: "Short Description is required" })}
              name='short_description'
              className='text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 h-[200px]'
              defaultValue={productDetails.short_description}
            />
          </div>
          {errors.short_description && (
            <p className="text-red-500 text-sm">{errors.short_description.message}</p>
          )}

          <div className='py-[10px]'>
            <label
              htmlFor="description"
              className="block  text-md font-medium text-gray-900 text-[#76838f]">
              Description
            </label>
            <textarea
              {...register("description", { required: " Description is required" })}
              name='description'
              className='text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 h-[200px]'
              defaultValue={productDetails.description}
            />

          </div>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <button class=" mt-5 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 ">
            {updateId ? "Update Product " : "Add Product"}
          </button>

        </form>

      </div>
    </section>
  )
}

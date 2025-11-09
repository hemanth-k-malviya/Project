import {  useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Breadcrumb from '../../Comman/Breadcrumb';
import { useEffect, useState } from "react";
import React from "react";

export default function AddMaterials() {

  const params = useParams();
  const [updateId, setUpdateId] = useState('');
  const [materialDetails, setMaterialDetails] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id != '') {
      setUpdateId(params.id); 
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_COLOR_API}/details/${params.id}`)
        .then((result) => {
          if (result.data._status == true) {
            setMaterialDetails(result.data._data)
          } else {
            setMaterialDetails('');

          }
        })
        .catch(() => {
          toast.error('Something went wrong !!')
        })
    }
  }, [params])

  const formHandler = (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.name.value,
      order: event.target.order.value,
    }

    
    if (!updateId) {
      //add material
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_MATERIAL_API}/create`, formData)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            event.target.reset()
            navigate('/material/view')
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong!');
        })
    } 
    else {
      //update material
      axios.put(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_MATERIAL_API}/update/${updateId}`, formData)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            event.target.reset()
            navigate('/material/view')
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong !');
        })
    }
  }
  return (
    <div className="w-full">
         <div className="mx-auto py-5">
           <h3 className="text-[20px] font-semibold bg-slate-100 py-2 px-3 rounded-t-md border border-slate-400">
             {updateId ? "Update Material" : "Add Material"}
           </h3>
   
           <form autoComplete="off"
             className="p-3 border border-t-0 rounded-b-md border-slate-400"
             onSubmit={formHandler}
           >
             {/* Material Name */}
             <div className="mb-5">
               <label className="block text-md font-medium text-gray-900">Color Name</label>
               <input
                 type="text" name="name"
                 defaultValue={materialDetails.name}
                 // {...register("colorName", { required: "Color Name is required" })}
                 className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                 placeholder="Enter Material Name"
               />
               {/* {errors.colorName && <p className="text-red-500 text-sm">{errors.colorName.message}</p>} */}
             </div>
   
       
             {/* Material Order */}
             <div className="mb-5">
               <label className="block text-md font-medium text-gray-900">Order</label>
               <input
                 type="number" name="order"
                 defaultValue={materialDetails.order}
                 // {...register("colorOrder", {
                 //   required: "Order is required",
                 //   min: { value: 1, message: "Order must be at least 1" },
                 // })}
                 className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                 placeholder="Enter Order"
               />
               {/* {errors.colorOrder && <p className="text-red-500 text-sm">{errors.colorOrder.message}</p>} */}
             </div>
   
             {/* Submit Button */}
             <button
               type="submit"
               className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
             >
               {updateId ? "Update Material" : "Add Material"}
             </button>
           </form>
         </div>
       </div>
  )
}

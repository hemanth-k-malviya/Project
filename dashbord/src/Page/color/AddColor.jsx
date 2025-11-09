import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddColor() {
  const [color, setColor] = useState("#000000");
  const params = useParams();
  const [updateId, setUpdateId] = useState('');
  const [colorDetails, setColorDetails] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id != '') {
      setUpdateId(params.id); 
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_COLOR_API}/details/${params.id}`)
        .then((result) => {
          if (result.data._status == true) {
            setColorDetails(result.data._data)
            setColor(result.data._data.code)
          } else {
            setColorDetails('');

          }
        })
        .catch(() => {
          toast.error('Something went wrong !!')
        })
    }
  }, [params])

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const formHandler = (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.name.value,
      code: color,
      order: event.target.order.value,
    }

    
    if (!updateId) {
      //add color
      axios.post(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_COLOR_API}/create`, formData)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            event.target.reset()
            navigate('/color/view')
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong !');
        })
    } 
    else {
      //update color
      axios.put(`${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_COLOR_API}/update/${updateId}`, formData)
        .then((result) => {
          if (result.data._status == true) {
            toast.success(result.data._message);
            event.target.reset()
            navigate('/color/view')
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
          {updateId ? "Update Color" : "Add Colors"}
        </h3>

        <form autoComplete="off"
          className="p-3 border border-t-0 rounded-b-md border-slate-400"
          onSubmit={formHandler}
        >
          {/* Color Name */}
          <div className="mb-5">
            <label className="block text-md font-medium text-gray-900">Color Name</label>
            <input
              type="text" name="name"
              defaultValue={colorDetails.name}
              // {...register("colorName", { required: "Color Name is required" })}
              className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
              placeholder="Enter Color Name"
            />
            {/* {errors.colorName && <p className="text-red-500 text-sm">{errors.colorName.message}</p>} */}
          </div>

          {/* Color Picker */}
          <div className="mb-5">
            <label className="block text-md font-medium text-gray-900">Color Picker</label>
            <div className="flex items-center gap-3">
              <ChromePicker color={color} onChange={handleColorChange} />
              <div className="w-10 h-10 border border-gray-400 rounded-md" style={{ backgroundColor: color }}></div>
            </div>
          </div>

          {/* Color Order */}
          <div className="mb-5">
            <label className="block text-md font-medium text-gray-900">Order</label>
            <input
              type="number" name="order"
              defaultValue={colorDetails.order}
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
            {updateId ? "Update Color" : "Add Color"}
          </button>
        </form>
      </div>
    </div>
  )
}

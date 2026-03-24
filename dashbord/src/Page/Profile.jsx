import React, { useEffect, useState } from "react";
import { IoPhonePortrait } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import Breadcrumb from "../Comman/Breadcrumb";
import axios from "axios";
import { toast } from "react-toastify";

export default function Profile() {

  const [activeTab, setActiveTab] = useState("editProfile");
  const token = localStorage.getItem("token");


  useEffect(() => {
    $(".dropify").dropify({
      messages: {
        default: "Profile ",
        replace: "Drag and drop ",
        remove: "Remove",
        error: "Oops, something went wrong"
      }
    });
  }, [activeTab]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const [userProfile, setUserProfile] = useState('')
  const [userEmail, setUserEmail] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [updateProfile, setUpadateProfile] = useState(true)
  const [isLoading, setisLoading] = useState(false);
  const [imageURL, setImageUrl] = useState('');

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
    if (!token) {
      toast.error("Please login again");
      return;
    }
    axios.post(`${import.meta.env.VITE_WEBSITE_USERS}/view-profile`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((result) => {
        if (result.data._status === true) {
          setUserProfile(result.data._data);
          setUserEmail(result.data._data.email);
           setImageUrl(result.data._image_path)
          setSelectedTitle(result.data._data.gender)
        } else {
          toast.error(result.data._message)
        }
      })
      .catch(() => {
        toast.error("Something went wrong !")
      })
  }, [updateProfile])

  const updateProfileHandling = (e) => {
    e.preventDefault()
    if (!token) {
      toast.error("Please login again");
      return;
    }
    const formData = new FormData(e.target);
    setisLoading(true)
    axios.put(`${import.meta.env.VITE_WEBSITE_USERS}/update-profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((result) => {
        if (result.data._status === true) {
          setUserProfile(result.data._data);
          toast.success(result.data._message)

          setUpadateProfile(!updateProfile)
          setisLoading(false)
        } else {
          toast.error(result.data._message)
          setisLoading(false)
        }
      })
      .catch((error) => {
        console.error("update-profile failed:", error);
        toast.error("Something went wrong !")
        setisLoading(false)
      })
  }


  const changePassword = (e) => {
    e.preventDefault();
    setisLoading(true);

    const formData = new FormData(e.target);

    const currentPassword = formData.get("current_password");
    const newPassword = formData.get("new_password");
    const confirmPassword = formData.get("confirm_password");

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      setisLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setisLoading(false);
      return;
    }

    axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/user/change-password`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // ❗ Do NOT set Content-Type manually for FormData
        },
      }
    )
      .then((result) => {
        if (result.data._status === true) {
          toast.success(result.data._message);
          e.target.reset(); // clear form
          setisLoading(false);
        } else {
          toast.error(result.data._message);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong!");
        setisLoading(false);
      })
  };

  return (
    <div className="bg-[#F1F4F5]">
      <Breadcrumb path={"Profile"} />

      <div className="w-full px-6 grid grid-cols-[30%_auto] gap-[10px] py-[20px]">
        <div className="bg-white  self-start  rounded-lg shadow-md">
          <div className="py-[40px] text-center">
            <img
              className="w-[80px] h-[80px] mx-auto rounded-full"
              src={`${imageURL}/${userProfile.image}`}
              alt="Profile"
            />
            <h5 className="pt-[6px]">{userProfile.name}</h5>
          </div>
          <div className="bg-[#F6F9FD] p-[20px]  rounded-lg shadow-md">
            <h4 className="py-[8px] font-bold">Contact Information</h4>
            <p className="flex items-center gap-[8px] py-[6px]">
              <IoPhonePortrait /> {userProfile.mobile_number}
            </p>
            <p className="flex items-center gap-[8px] py-[6px]">
              <MdEmail /> {userProfile.email}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-4">
            <button
              className={`px-6 py-2 text-lg font-medium ${activeTab === "editProfile"
                ? "border-b-4 border-purple-700 text-purple-700"
                : "text-gray-600"
                }`}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </button>
            <button
              className={`px-6 py-2 text-lg font-medium ${activeTab === "changePassword"
                ? "border-b-4 border-purple-700 text-purple-700"
                : "text-gray-600"
                }`}
              onClick={() => setActiveTab("changePassword")}
            >
              Change Password
            </button>
          </div>

          {/* Edit Profile Form */}
          {activeTab === "editProfile" && (
            <form onSubmit={updateProfileHandling} className="p-3">
              <div className="flex gap-5">
                <div className="w-1/3">
                  <label className="block  text-md font-medium text-gray-900">
                    Choose Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="image"
                    className="dropify"
                    data-height="236"
                  />
                </div>
                <div className="w-2/3">
                  <div className="mb-5">
                    <label className="block  text-md font-medium text-gray-900">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                      placeholder="Name"
                      defaultValue={userProfile.name}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block  text-md font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                      placeholder="Email"
                      value={userProfile.email}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block  text-md font-medium text-gray-900">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile_number"
                      className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                      placeholder="Number"
                      defaultValue={userProfile.mobile_number}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="my-5 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg px-5 py-2.5"
              >
                {isLoading ? "Loading..." : "Update Profile"}
              </button>
            </form>
          )}

          {/* Change Password Form */}
          {activeTab === "changePassword" && (
            <form onSubmit={handleSubmit(onSubmit)} className="p-3">
              <div className="mb-5">
                <label className="block  text-md font-medium text-gray-900">Current Password</label>
                <input
                  type="password"
                  {...register("currentPassword", { required: "Current Password is required" })}
                  className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                  placeholder="Current Password"
                />
                {errors.currentPassword && <p className="text-red-500">{errors.currentPassword.message}</p>}
              </div>

              <div className="mb-5">
                <label className="block  text-md font-medium text-gray-900">New Password</label>
                <input
                  type="password"
                  {...register("newPassword", { required: "New Password is required" })}
                  className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                  placeholder="New Password"
                />
                {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
              </div>

              <div className="mb-5">
                <label className="block  text-md font-medium text-gray-900">Confirm Password</label>
                <input
                  type="password"
                  {...register("confirmPassword", { required: "Confirm Password is required" })}
                  className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                className="my-5 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg px-5 py-2.5"
              >
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div >
  );
}

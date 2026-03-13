import React, { useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import './../App.css'
import { toast } from 'react-toastify'
import axios from 'axios'

function ResetPassword() {
  let navigate = useNavigate()
  const { token } = useParams() // Get token from URL if needed

  const [resetLoading, setResetLoading] = useState(false);
  const [shownew, setShowNew] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  // const token = params?.token;

  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetLoading(true);

    axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/user/reset-password`, e.target)
      .then((result) => {
        if (result.data._status === true) {
          toast.success(result.data._message);
          setResetLoading(false);
          e.target.reset();
          // Redirect to login page after successful reset
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          toast.error(result.data._message);
          setResetLoading(false);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong!');
        setResetLoading(false);
      })
  }

  return (
    <>
      <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img class="w-[400px] h-[110px]" src="https://mastercoach.in/wp-content/uploads/2021/09/header_logo.png" alt="logo" />
          </a>
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Reset Password
              </h1>
              <form class="space-y-4 md:space-y-6" onSubmit={handleResetPassword}>
                <input type="hidden" name='token' value={token || ''} />
                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                  <input type="password"
                    name="new_password"
                    id="new_password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                  <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <input type="password"
                    name="confirm_password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={
                    resetLoading
                      ?
                      'disabled'
                      :
                      ''
                  }
                >
                  {
                    resetLoading
                      ?
                      'Loading...'
                      :
                      'Reset Password'
                  }
                </button>

                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Remember your password? <Link to="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ResetPassword
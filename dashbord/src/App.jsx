import { useState } from 'react'
import React from 'react'
import './App.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function App() {
  let navigate = useNavigate()

  const [loginLoadind, setLoginLoadind] = useState(false)

  let signIn = (e) => {
    e.preventDefault()
    setLoginLoadind(true)
    axios.post(`${import.meta.env.VITE_WEBSITE_USERS}/login`, e.target)
      .then((result) => {
        if (result.data._status == true) {
          localStorage.setItem("token", result.data._token);
          toast.success(result.data._message);
          navigate("/dashboard");
          setLoginLoadind(false);
        } else {
          toast.error(result.data._message);
          setLoginLoadind(false);
        }
      })
      .catch(() => {
        toast.error('Something went wrong!')
        setLoginLoadind(false);
      })
  }


return (
  <>
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        
        <div class="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-900 bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100">
          <img class="w-[400px] h-[110px] object-contain" src="/image/logo.png" alt="logo" />
        </div>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form class="space-y-4 md:space-y-6" onSubmit={signIn}>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
             
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

               
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-gray-400 hover:text-white  dark:text-primary-500">Forgot password?</Link>
              </div>

              <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                {loginLoadind ? 'Signing in...' : 'Sign in'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  </>
)

}
export default App




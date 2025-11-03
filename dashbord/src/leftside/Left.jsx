import React, { useState } from 'react'
import { Nav } from '../Comman/NavData'
import { RiArrowDownSLine, RiArrowUpSLine, RiPieChart2Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';

export default function Left() {
  // console.log(Nav)
  const [model, setModel] = useState(false)
  const ACC = (id) => {
    setModel(model === id ? null : id)
  }
  return (
    <div className='w-full overflow-y-auto h-screen bg-gray-50 dark:bg-gray-800 scrollbar-hide'>

      <img class="w-[250px] h-[100px] p-[15px]" src="https://mastercoach.in/wp-content/uploads/2021/09/header_logo.png" alt="logo" />

      <div className='w-[195px] border border-gray-400 ml-[28px]'></div>

      <div className='w-full '>
        <Link to={'/dashboard'}>
          <div className='flex mt-[40px] text-xl ml-[15px]'>

            <RiPieChart2Fill className='mt-[3px]  text-white' />
            <h3 className='ml-[15px] cursor-pointer text-white' >Dashbord</h3>

          </div>
        </Link>
        {Nav.map((item, index) => (
          <div className='mt-[30px] ml-[15px] text-[18px]  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group '>
            <div className='flex justify-between p-4'>
              <div className='flex'>
              <item.icon className='mt-[5px] ' />
              <h3 className='ml-[15px] cursor-pointer' onClick={() => ACC(item.id)}>{item.title}</h3>
              </div>
              
              <span className='ml-10'>{model  === item.id ? <RiArrowUpSLine /> : <RiArrowDownSLine />}</span>
            </div>
            
            <div >
              <ul className={`${model === item.id ? 'block' : 'hidden'}`} >
                   
                {item.subMenu.map((v, i) => (
                  <>

                    <Link to={`${v.link}`}>
                      <li className='m-[5px_30px] flex '>  {v.subIcon && <v.subIcon className="mr-2 mt-[5px]" />} {v.subTitle}
                      
                      </li>
                    </Link>

                  </>

                ))}

              </ul>
            </div>
          </div>
        ))}

        {/* <div className='mt-[30px] ml-[15px] text-[18px] '>

          <h3>Users</h3>
        
          <div className='row'>

            <ul>

              <li>View User</li>

            </ul>

          </div>

        </div> */}

      </div>
    </div >
  )
}

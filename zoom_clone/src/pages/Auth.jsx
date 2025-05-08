import React, { useState } from 'react'
import Signup from '../components/Signup'
import Login from '../components/Login'

const Auth = () => {

  const Tabs = [
    {id: 1, name: "Login"},
    {id: 2, name: "Signup"}
  ]

  const [currentTab, setCurrentTab] = useState(1)
  return (
    <div className='min-h-screen flex justify-between items-center bg-[#f5f5f5]'>
        <div className=' w-[80%] min-h-[60%] mx-auto flex p-6 rounded-md justify-around gap-6 shadow-lg'>
            <img src='/assets/videocall.png' className='w-[40%] object-contain rounded-lg '/>
            <div className='w-full flex flex-col gap-4 p-4'>
              <div className='flex rounded-md'>
                  {
                    Tabs.map((tab) => (
                      <button key={tab.id} onClick={() => {setCurrentTab(tab.id)}} className={`px-5 py-3 rounded-md border-1 delay-100 transition ease-linear  ${currentTab === tab.id ? 'bg-blue-400 text-white': 'bg-transparent'}`} >
                        <p className='mx-auto '>{tab.name}</p>
                      </button>
                    ))
                  }
              </div>
              <div>
                {
                  currentTab == 1 ? (<Login setCurrentTab={setCurrentTab}/>): (<Signup setCurrentTab={setCurrentTab}/>)
                }
              </div>
            </div>
        </div>
    </div>
  )
}

export default Auth
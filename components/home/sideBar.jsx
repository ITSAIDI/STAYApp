'use client'
import { useState } from 'react';
import { viga,poppins } from "@/fonts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faClock,faHexagonNodes,faMapLocationDot,faLightbulb } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image'



export default function SideBar() {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    'Home',
    'Time analysis',
    'Networks',
    'Spatial analysis',
    'Semantic analysis',
  ];
 const icons = [
    faHouse,
    faClock,
    faHexagonNodes,
    faMapLocationDot,
    faLightbulb,
 ]
  return (
    <div className='bg-gray-200 w-[20%] flex flex-col items-center p-2 m-2 rounded-lg'>

      {/*Head*/}
      <div className='flex flex-row items-center mb-30'>
            <Image
            src="/logo.png" width={50} height={50}  alt="logo of STAY app" quality={100}
            />
            <div className={`${poppins.className}`}>
                <h1 className='text-xl font-bold leading-none'>STAY</h1>
                <p className='text-[11px] leading-none'>youtube</p>
            </div>
      </div>


      {/*Tabs*/}

      <div className={`${viga.className} px-2 py-1 text-left flex flex-col gap-3`}>
       
        <h1 className='mb-3'>MENU</h1>

        {tabs.map((tab,index) => (
           <div
           key={tab}
           className={`${activeTab === tab ? 'text-green-900 font-semibold' : 'text-gray-500'} hover:text-green-900  transition-colors`}
           >
                <FontAwesomeIcon 
                className={`${activeTab === tab ? 'scale-120' : 'scale-100'} transition-transform duration-400 `}
                icon={icons[index]} />
                <button
                    onClick={() => setActiveTab(tab)}
                    className="px-2 py-1"
                >
                {tab}
                </button>
           </div>
          
        ))}
      </div>
    </div>
  );
}

'use client'

import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Tooltip from '../tooltip'
import ChannelCard from './channelCard'
import { useState } from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


export default function ChannelSection({order,profileURL,channelName,creationDate,label,statChoice,channelStats,bio}) {
  const safeChoice = statChoice || 'nombre_vues_total'
  const [showCard,setShowCard] = useState(false)
  return (
    <div className='flex flex-col items-center hover:bg-gray-100 transition-colors duration-300 cursor-pointer w-full rounded-lg'>
      {/* Channel Section */}
      <div 
        onClick={()=>{setShowCard(true)}}
        className={`flex flex-row gap-10 justify-between w-full  p-1 ${viga.className}`}>
        
        <div className='flex flex-row gap-2 items-center'>
            <h1 className={`${viga.className} text-green1`}>{order}</h1>
            <Image
            src={profileURL}
            className='rounded-full'
            width = {45}
            height={45}
            alt='channel logo'
            quality={100} />
            <div className='flex flex-col'>
              <h1 className='truncate max-w-52 xl:max-w-xs text-[15px]'>{channelName}</h1>
              <p className='text-gray-400 text-[14px]'>{new Date(creationDate).toLocaleDateString('fr-FR')}</p>
            </div>
        </div>

        <div className='flex flex-col items-end gap-1'>
              {label ? <Tooltip text={'Pertinent'} styleText={'bg-green-300 text-green1 px-1.5 py-0  rounded-xl text-[14px]'} message={'Pertinent to the self-sufficiency phenomenon'} /> : <p className='bg-red-300 text-green1 px-1.5 py-0 rounded-xl text-[14px]'>Not pertinent</p>}
              <div className='flex flex-row gap-1 items-baseline text-[14px]'>
                <FontAwesomeIcon className='text-green1' icon={channelStats[safeChoice]['icon']}/>
                <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(channelStats[safeChoice]['number'])}</p>
              </div>
            
        </div>
      
      </div>
      {/* Channel Card*/}
      {
        showCard && (
          <div 
          className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out'>
            <div className='relative bg-white rounded-lg shadow-xl w-[48%] p-2'>
              <button
              className='absolute right-3 top-1'
              onClick={()=>{setShowCard(false)}}
              >
               <FontAwesomeIcon className='text-green1 font-bold cursor-pointer scale-95 hover:scale-110 transition duration-300 ease-in-out' icon={faXmark}  />
              </button>
              <ChannelCard profileURL= {profileURL} channelName= {channelName} creationDate= {creationDate} label= {label}  channelStats= {channelStats} bio= {bio} />
            </div>

          </div>
        )
      }
      <hr className='my-0.5 border-gray-200 w-[97%]'/>
    </div>

  )
}

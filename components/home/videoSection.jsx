'use client'

import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEye,faThumbsUp,faXmark } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { useState } from 'react'
import VideoCard from './videoCard'




export default function VideoSection({ videoInfos,statChoice }) {
  const safeChoice = statChoice || 'nombre_vues'
  const [showCard,setShowCard] = useState(false)

  return (
    <div className="flex flex-col w-full rounded-lg bg-white  cursor-pointer p-2 text-[14px] xl:text-[18px]">
       {/* Video Section */}
       <div
        onClick={()=>{setShowCard(true)}}
        className='hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out'
       >
          <div className="flex flex-row items-center gap-3">
            
            <h1 className={`${viga.className} text-green1`}>{videoInfos.order}</h1>
            <div className="relative w-full aspect-video">
                <Image
                  src={videoInfos.miniature}
                  alt="video thumbnail"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-sm object-cover"
                  quality={100}
                />
            </div>

          </div>

        <div className={`${viga.className} flex flex-row justify-between ml-5 mt-1`}>

            <p className='text-gray-400 '>{new Intl.DateTimeFormat('fr-FR').format(new Date(videoInfos.date_publication))}</p>
            <div className='flex flex-row gap-1.5 items-baseline'>
                <FontAwesomeIcon className='text-green1' icon={safeChoice === 'nombre_vues' ? faEye : faThumbsUp}/>
                <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(videoInfos[safeChoice])}</p>
            </div>

          
        </div>
       </div>

      {/* Video Card*/}
      {
        showCard && (
          <div 
          className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out'>
            <div className='relative bg-white rounded-lg shadow-xl w-[70%] p-2'>
              <button
              className='absolute right-3 top-1'
              onClick={()=>{setShowCard(false)}}
              >
              <FontAwesomeIcon className='text-green1 font-bold cursor-pointer scale-95 hover:scale-110 transition duration-300 ease-in-out' icon={faXmark}  />
              </button>
              <VideoCard videoInfos = {videoInfos} />
            </div>

          </div>
        )
      }
    </div>
  )
}


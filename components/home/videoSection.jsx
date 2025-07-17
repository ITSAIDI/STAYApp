import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEye,faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { transformDateAddOneDay } from '@/utils/utils1'



export default function VideoSection({ videoInfos,statChoice }) {
  const safeChoice = statChoice || 'nombre_vues'

  return (
    <div className="flex flex-col w-full rounded-lg bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer p-2 text-[14px] xl:text-[18px]">
      <div className="flex flex-row items-center gap-3">
        <h1 className={`${viga.className} text-green1`}>{videoInfos.order}</h1>
          <Image
          src={videoInfos.miniature}
          alt="video thumbnail"
          layout="responsive"
          width={16}
          height={9}
          className="rounded-sm"
          quality={100}
        />
      </div>

      <div className={`${viga.className} flex flex-row justify-between ml-5 mt-1`}>

          <p className='text-gray-400 '>{new Intl.DateTimeFormat('fr-FR').format(new Date(videoInfos.date_publication))}</p>
          <div className='flex flex-row gap-1.5 items-baseline'>
              <FontAwesomeIcon className='text-green1' icon={safeChoice === 'nombre_vues' ? faEye : faThumbsUp}/>
              <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(videoInfos[safeChoice])}</p>
          </div>
      </div>
    
    </div>
  )
}


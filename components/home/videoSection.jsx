import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEye,faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'



export default function VideoSection({ videoInfos,statChoice }) {
  const safeChoice = statChoice || 'nombre_vues'

  return (
    <div className="flex flex-col w-[420px] p-2 rounded-lg bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer">
      <div className="flex flex-row items-center gap-3">
        <h1 className={`${viga.className} text-green1`}>{videoInfos.order}</h1>
        <Image
          src={videoInfos.miniature}
          className="rounded-sm"
          width={390}
          height={40}
          alt="video thumbnail"
          quality={100}
        />
      </div>

      <div className={`${viga.className} flex flex-row justify-between ml-5 mt-1`}>

          <p className='text-gray-400 text-[14px]'>{new Date(videoInfos.date_publication).toLocaleDateString('fr-FR')}</p>
          <div className='flex flex-row gap-1.5 items-baseline text-[14px]'>
              <FontAwesomeIcon className='text-green1' icon={safeChoice === 'nombre_vues' ? faEye : faThumbsUp}/>
              <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(videoInfos[safeChoice])}</p>
          </div>
      </div>
    
    </div>
  )
}


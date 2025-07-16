import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'



export default function VideoSection({ videoInfos }) {
  const safeChoice = videoInfos.statChoice || 'nombre_vues'

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

          <p className='text-gray-400 text-[14px]'>{videoInfos.date_publication}</p>
          <div className='flex flex-row gap-1.5 items-baseline text-[14px]'>
              <FontAwesomeIcon className='text-green1' icon={videoInfos['videoStats'][safeChoice]['icon']}/>
              <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(videoInfos['videoStats'][safeChoice]['number'])}</p>
          </div>
      </div>
    
    </div>
  )
}


import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'



export default function VideoSection({videoInfos}) {
   const safeChoice = videoInfos.statChoice || 'nombre_vues'
  
    return (
    <div className='flex flex-col w-full'>
        <div className='flex flex-row items-center gap-3'>
           <h1 className={`${viga.className} text-green1`}>{videoInfos.order}</h1>
            <Image
            src={videoInfos.thumbnail}
            className='rounded-sm'
            width = {300}
            height={40}
            alt='video thumbnail'
            quality={100} />
        </div>

    </div>
  )
}

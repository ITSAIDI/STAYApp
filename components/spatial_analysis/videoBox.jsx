import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube,faXmark } from '@fortawesome/free-brands-svg-icons'
import { viga } from '@/fonts'
import Image from 'next/image'


export default function VideoBox({videoInfos}) {
   function getColor()
   {
    if(videoInfos.nombre_abonnes_total <= 600)
      return '#7af0a8'
    if(videoInfos.nombre_abonnes_total >= 13000)
      return '#FF6464'
    return '#64A0FF'
   }

   const flagColor = getColor()
  return (
    <div className='flex flex-col group hover:scale-[1.02] transition-all duration-300 ease-in-out'>
      <div className='rounded-md' style={{ backgroundColor: flagColor }}>
        <Image
          src={videoInfos.miniature}
          alt="video thumbnail"
          width={200}
          height={112} // 16:9 aspect
          className="rounded-md object-cover w-full ml-2"
        />
      </div>
    
      <div className='flex flex-row gap-2 mt-2'>
        <a
          href={`https://www.youtube.com/watch?v=${videoInfos.id_video}`}
          target="_blank"
          rel="noopener noreferrer"
          >
          <FontAwesomeIcon
              icon={faYoutube}
              className="text-green1 text-[20px] xl:text-[26px] group-hover:text-red-500 transition-all duration-300 ease-in-out"
          />
        </a>
       <p className={`${viga.className} text-green1 truncate w-full`}>{videoInfos.titre}</p>
      </div>
    </div>
 



  )
}

import Image from 'next/image'
import {faEye,faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { viga,poppins } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function VideoCard({videoInfos}) {
  return (
    <div className='flex flex-col w-full text-[14px] xl:text-[18px]'>

        {/*Upper section*/}
        <div className='flex flex-row w-full'>
            <div className='flex flex-col gap-1 min-w-[400px] xl:min-w-[500px]'>
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
                <div className= {`flex flex-row justify-between ${viga.className}`}>

                   <div className='flex flex-row gap-1.5 items-baseline'>
                        <FontAwesomeIcon className='text-green1' icon={faThumbsUp}/>
                        <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(videoInfos['nombre_likes'])}</p>
                   </div>

                   <div className='flex flex-row gap-1.5 items-baseline'>
                        <FontAwesomeIcon className='text-green1' icon={faEye}/>
                        <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(videoInfos['nombre_vues'])}</p>
                   </div>

                    <a
                    href={`https://www.youtube.com/watch?v=${videoInfos.id_video}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <FontAwesomeIcon
                        icon={faYoutube}
                        className="text-green1 text-[20px] xl:text-[26px]"
                    />
                    </a>

                </div>

            </div>

            <div className='flex flex-col gap-2 m-2 mt-0'>
                <div className='flex flex-col text-left'>
                    <h1 className={`${viga.className} text-gray-400`}>Published at (dd/mm/yyyy)</h1>
                    <p className={`${viga.className} text-green1`}>{new Intl.DateTimeFormat('fr-FR').format(new Date(videoInfos.date_publication))}</p>

                </div>

                <div className='flex flex-col text-left'>
                    <h1 className={`${viga.className} text-gray-400`}>Title</h1>
                    <p className={`${viga.className} text-green1 bg-gray-200 rounded-lg p-1 max-h-10 overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-gray-200`}>{videoInfos.titre}</p>

                </div>
                
                {
                    videoInfos.tags ? 
                
                    <div className='flex flex-col'>
                        
                        <h1 className={`${viga.className} text-gray-400`}>Tags</h1>
                        <div className={`${viga.className} flex flex-wrap gap-1 bg-gray-200 rounded-lg p-1 max-h-20 overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-gray-200`}>
                            { videoInfos.tags.map((value,index)=>
                            <p
                            className='bg-green1 text-white rounded-lg p-1'
                            key={index}
                            >
                                {value}
                            </p>)
                                
                            }
                        </div>
                    </div>
                    :
                     <h1 className={`${viga.className} p-1 bg-green1 text-white rounded-lg w-fit`}>No Tags</h1>
                }

            </div>

        </div>

        {/*Description section*/}
       <div className='flex flex-col text-left'>

        <h1 className={`${viga.className} text-gray-400`}>Description</h1>
        <p className={`${viga.className} text-green1 bg-gray-200 rounded-lg p-1 max-h-40 overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-gray-200`}>{videoInfos.description}</p>

      </div>

    </div>
  )
}

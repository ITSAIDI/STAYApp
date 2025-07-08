import { viga,poppins } from '@/fonts'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function ChannelCard({profileURL,channelName,creationDate,label,channelStats,bio}) {
  return (
    <div>
        <div className='flex flex-row justify-between mt-7 p-1'>
            {/* Profile Image */}
            <div>
                <Image
                src={profileURL}
                className='rounded-full'
                width = {80}
                height={80}
                alt='channel logo'
                quality={100} />
            </div>

            {/* Info */}
            <div className={`flex flex-col gap-1 ${poppins.className}`}>
                <h1 className={`${viga.className} text-gray-500`}>Name of channel</h1>
                <p className='max-w-[270px] overflow-x-auto whitespace-nowrap text-left'>{channelName}</p>
                <h1 className={`${viga.className} text-gray-500`}>Created at (yyyy/mm/dd)</h1>
                <p>{creationDate}</p>
                <h1 className={`${viga.className} text-gray-500`}>Pertinent ?</h1>
                {label ? <p>Yes</p>: <p>No</p>}
            </div>

            {/* Stats */}
            <div className={`flex flex-col gap-1 ${poppins.className}`}>

                {/* subscribers */}
                <div className= 'text-gray-500 flex flex-row gap-2 items-baseline'>

                    <FontAwesomeIcon icon={channelStats['nombre_abonnes_total']['icon']} />
                    <h1 className={`${viga.className}`}>Number of subscribers</h1>
                
                </div>
                <p>{new Intl.NumberFormat('fr-FR').format(channelStats['nombre_abonnes_total']['number'])}</p>
                
                {/* views */}
                <div className= 'text-gray-500 flex flex-row gap-2 items-baseline'>

                    <FontAwesomeIcon icon={channelStats['nombre_vues_total']['icon']} />
                    <h1 className={`${viga.className}`}>Number of views</h1>
                
                </div>
                <p>{new Intl.NumberFormat('fr-FR').format(channelStats['nombre_vues_total']['number'])}</p>

                {/* videos */}
                <div className= 'text-gray-500 flex flex-row gap-2 items-baseline'>

                    <FontAwesomeIcon icon={channelStats['nombre_videos_total']['icon']} />
                    <h1 className={`${viga.className}`}>Number of videos</h1>
                
                </div>
                <p>{new Intl.NumberFormat('fr-FR').format(channelStats['nombre_videos_total']['number'])}</p>
        

            </div>        

        </div>

        {/* Bio */}
        <h1 className={`${viga.className}`}>Bio</h1>
        <p className='w-full max-h-40 overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-green-200 bg-green-200 p-2 font-medium text-green1 rounded-lg'>
        {bio}
         </p>

        
    </div>
  )
}

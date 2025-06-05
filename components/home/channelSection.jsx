import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Tooltip from '../tooltip'


export default function ChannelSection({profileURL,channelName,creationDate,label,statChoice,channelStats,bio}) {
  return (
    <div className='flex flex-col items-center hover:bg-gray-100 transition-colors duration-300 cursor-pointer w-full rounded-lg'>
      <div className={`flex flex-row gap-10 justify-between w-full  p-1 ${viga.className}`}>
        
        <div className='flex flex-row gap-0.5 items-center'>
            <Image
            src={profileURL}
            className='rounded-full'
            width = {45}
            height={45}
            alt='channel logo'
            quality={100} />
            <div className='flex flex-col'>
              <h1 className='truncate max-w-44 xl:max-w-xs text-[15px]'>{channelName}</h1>
              <p className='text-gray-400 text-[14px]'>{creationDate}</p>
            </div>
        </div>

        <div className='flex flex-col items-end gap-1'>
          {label ? <Tooltip text={'Pertinent'} styleText={'bg-green-300 text-green1 px-1.5 py-0  rounded-xl text-[14px]'} message={'Pertinent to the self-sufficiency phenomenon'} /> : <p className='bg-red-300 text-green1 px-1.5 py-0 rounded-xl text-[14px]'>Not pertinent</p>}
              <div className='flex flex-row gap-1 items-baseline text-[14px]'>
                <FontAwesomeIcon className='text-green1' icon={channelStats[statChoice]['icon']}/>
                <p className='truncate max-w-20 text-gray-400'>{new Intl.NumberFormat('fr-FR').format(channelStats[statChoice]['number'])}</p>
              </div>
            
        </div>
      
      </div>
      <hr className='my-0.5 border-gray-200 w-[97%]'/>
    </div>

  )
}

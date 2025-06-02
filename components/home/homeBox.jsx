import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function HomeBox({textColor,bgColor,number,title,icon}) {
  return (
    <div className= {`p-2 ${bgColor} rounded-lg w-[40%]`}>
      <div className={`${viga.className} ${textColor} text-left gap-2 flex flex-col`}>

         <h1 className='text-lg xl:text-xl'>{title}</h1>

         <div className='flex flex-row gap-2 ml-4'>
           <FontAwesomeIcon icon={icon} className={`${textColor} text-2xl xl:text-3xl`} />
           <h1 className='text-5xl xl:text-6xl'>{new Intl.NumberFormat('fr-FR').format(number)}</h1>
         </div>

      </div>
    </div>
  )
}

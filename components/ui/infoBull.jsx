import { viga } from '@/fonts';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function InfoBull({information}) {
  return (
        <div className='relative group w-[400px]'>
          <FontAwesomeIcon className='text-green1 hover:scale-110 transition-all duration-300'  icon={faInfoCircle}/>
          <p className={`absolute top-0 left-5 opacity-0 mb-2 bg-green-200 text-green1 text-sm  px-2 py-1 rounded group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-1000 ${viga.className}`}>
            {information}
          </p>
        </div>
  )
}

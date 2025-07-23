'use client';

import Tooltip from '@/components/tooltip';
import { viga,poppins } from '@/fonts';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { vi } from 'date-fns/locale';
import dynamic from 'next/dynamic';
import { useEffect,useState } from 'react';

const MapComponent = dynamic(() => import('../../components/spatial_analysis/Map'), {
  ssr: false,
});



export default function SpatialAnalysis() {
  
  const [spatialEntities,setSpatialEntities] = useState([])

  async function getSpatialEntities() 
  {
   try 
    {
      const res = await fetch('/api/spatial_analysis')
      const data = await res.json()
      setSpatialEntities(data)

      //console.log('spatialEntities: ',data)

    } 
    catch (error) {
      console.log('Failing while fetching spatialEntities ',error)
    }
  }

  useEffect(()=>{getSpatialEntities();},[])

  return (
    <div>
      <div className='flex flex-row gap-2 m-2'>
        <h1 className={`${viga.className} text-green1`}>Self-sufficiency cartography</h1>
        <div className='relative group'>
          <FontAwesomeIcon className='text-green1'  icon={faInfoCircle}/>
          <p className={`absolute top-0 left-5 opacity-0 mb-2 bg-green-200 text-green1 text-sm  px-2 py-1 rounded group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap ${viga.className}`}>
            This cartography is based on the detected french locations from videos metadata 
          </p>
        </div>
      </div>
      
      <MapComponent entities = {spatialEntities}/>
    </div>
  );
}

'use client';

import InfoBull from '@/components/ui/infoBull';
import { viga } from '@/fonts';
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
    <div className='flex flex-col gap-2 p-2'>
      
      <div className='flex flex-row gap-1'>
        <h1 className={`${viga.className} text-green1`}>Self-sufficiency cartography-videos</h1>
        <InfoBull information={"This cartography is based on the detected french locations from videos metadata "} />
      </div>
      
      <MapComponent entities = {spatialEntities}/>
    </div>
  );
}

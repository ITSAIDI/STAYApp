'use client'

import { viga,poppins } from '@/fonts'
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState,useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import VideoSection from './videoSection'



export default function VideosLeaderboard() {

  const [query,setQuery] = useState('')
  const [videos,setVideos] = useState([])
  let videosInit = useRef([])

  async function initVideos()
  {
    try 
    {
      const res = await fetch('/api/videos')
      videosInit.current = await res.json()
      setVideos(videosInit.current)
      console.log('Videos :',videosInit.current)
    } 
    catch (error) {
      console.log('Failing while fetching videos ',error)
    }
  }

  
  useEffect(()=>{initVideos();},[])

  const testVideoccc = {
     order : 1,
    "id_video": "6CI-4_XszYg",
    "miniature": "https://i.ytimg.com/vi/6CI-4_XszYg/maxresdefault.jpg",
    "titre": "Autonomie alimentaire.  Être autosuffisant sur petite surface !",
    "date_publication": "2022-09-01T22:00:00.000Z",
    "description": "Découvrez le Pirate de la Permaculture et son autonomie alimentaire sur toute petite surface. Picro arrive à être autosuffisant sur une surface d'à peine 800m2... de quoi rêver.\n\nAdhérez à cette chaîne pour obtenir des avantages :\nhttps://www.youtube.com/channel/UC9Q8WeyCb3yxySC3P3mGpBw/join\nPour me soutenir, suivez ce lien : https://fr.tipeee.com/le-jardin-d-emerveille\n\nAu sommaire :\n0:00 - Présentations\n0:53 - Quelles productions\n4:24 - Comment calculer son autosuffisance !\n5:00 - Réduire sa dépendance énergétique\n6:20 - Visite du lieu\n8:08 - Surface et organisation de la production\n10:58 - Gestion de l'eau\n11:51 - Jardin forêt ?\n13:24 - Le pirate Picro et sa chaîne YouTube.\n\nLa chaîne YouTube de Picro : https://www.youtube.com/user/piiicro\n\nPour me soutenir, suivez ce lien : https://fr.tipeee.com/le-jardin-d-emerveille\n\nMerci à vous tous les permapotes d'avoir regardé cette vidéo. :)\nCliquez sur ce lien pour vous abonner : \nhttps://www.youtube.com/channel/UC9Q8WeyCb3yxySC3P3mGpBw",
    "tags": [
        "Autonomie alimentaire. Être autosuffisant sur petite surface !",
        "permaculture",
        "plantes",
        "jardin",
        "biodiversité",
        "agroécologie",
        "potager",
        "d'émerveille",
        "des merveilles",
        "Autonomie alimentaire",
        "Produire sa nourriture",
        "comment créer son potager bio",
        "comment démarrer son potager",
        "comment démarrer un potager",
        "comment faire un potager bio",
        "comment préparer son potager",
        "créer son jardin",
        "créer son potager",
        "faire un potager",
        "etre autosuffisant",
        "Autosuffisant sur petite surface"
    ],
    "duree": 1032,
    "nombre_vues": 197415,
    "nombre_likes": 5749,
    "date_releve_video": "2025-05-20T22:00:00.000Z"
   }

  const videosTest = [testVideoccc,testVideoccc,testVideoccc]


  return (
    <div className='flex flex-col bg-white rounded-lg mt-2 p-2 w-full h-full'>

        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Videos</h1>

        {/* Search area */}
        <div className="flex flex-row px-4 py-1 border rounded-full border-green1 text-sm mt-2 mb-2 gap-1">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl text-green1"  />
          <input
          type="text"
          placeholder="search for a video by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className= {`${poppins.className} w-full focus:outline-none`}
          />
        </div>

        {/* Videos List */}
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-white overflow-x-hidden">
          {
            videosTest.map((video,index)=>
            <VideoSection
             key={index}
             statChoice = {'nombre_vues'}
             videoInfos={video}  />)
          }
        </div>


    </div>
  )
}

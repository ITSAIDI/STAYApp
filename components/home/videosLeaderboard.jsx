'use client'

import { viga,poppins } from '@/fonts'
import { faMagnifyingGlass,faEye,faThumbsUp } from '@fortawesome/free-solid-svg-icons'
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
    } 
    catch (error) {
      console.log('Failing while fetching videos ',error)
    }
  }

  useEffect(()=>{initVideos();},[])


  const testVideo = {
    order : 1,
    videoId:"NRzflSM89iI",
    thumbnail :"https://i.ytimg.com/vi/NRzflSM89iI/maxresdefault.jpg", 
    title:"Mes livres préférés pour l'AUTONOMIE/AUTOSUFFISANCE : potager, élevage, cuisine, transfo ect)",
    publicationDate:"2021-05-07",
    description:`00:00 Le guide terre vivante de l'autonomie au jardin 
                  04:06 Le traité Rustica des arbres fruitiers
                  05:08 Jardin-Forêt de Fabrice Desjours
                  10:30 La forêt Jardin de Martin crawford
                  11:15 Cultiver les champignons de Folko Kullmann
                  13:00 Le guide des champignons de France et d'Europe de Guillaume Eyssartier et Paul Roux
                  15:08 La bible du jardinage Maison Rustique 
                  19:07 Faites pousser et dégustez vos protéines de François Couplan et Xavier Mathias
                  20:25 Manger sauvage de Richard Mabey
                  21:49 Le traité Rustica de la conservation 
                  25:21 Le traité Rustica de la bonne cuisine maison 
                  30:00 L'art de la fermentation de Luna Kyung et Camille Oger
                  31:40 Prodigieuse lactofermentation de Pascal Labbé
                  32:06 L'art de faire son fromage de David Asher 
                  34:15 Le traité Rustica de la ferme familiale 
                  37:56 Vivre en autosuffisance 
                  39:29 L'autosuffisance de John Seymour
                  41:40 Petit manuel à l'usage de ceux qui vivent retiré du monde chez Larousse
                  42:35 La cuisine de la ferme de Sarah Mayor 
                  43:40 Le petit traité Rustica de l'apiculteur débutant 
                  43:58 Les plantes mellifères mois par mois de Jacques Piquée
                  44:17 Planter des arbres pour les abeilles de Yves Darricau
                  45:05 Arbres fourragers de Jerome Goust
                  45:45 Planter des haies pour la biodiversité de Bernard Farinelli 
                  48:00 Manuel de construction en bambou







                  Le lien du discord pour participer à la recopie des 5 tomes de la maison rustique : https://discord.gg/mNkvh5cr
                  Les 2 vidéos dont je parle pour le livre sur le jardin foret  : https://www.youtube.com/watch?v=D6z-4adGWN4   et https://www.youtube.com/watch?v=WqOt7lfYChU

                  Tu as une question à poser en rapport avec la vidéo ? Je t'invite à le faire en priorité dans les commentaires pour qu'elle puisse servir à tous, mais si tu n'oses pas la poser en public, tu peux me contacter par mail  ! 



                  Mon mail : laptiteortie@gmail.com


                  Tu peux me retrouver sur le discord réseautonome : https://reseautono.me/​​​​
                  Tu y retrouveras des catégories avec plein de conseils dans le domaine de l'autonomie, j'y puise énormément d'infos, beaucoup d'entraide !


                  Notre sol et climat (pour t'aider vis à vis des vidéos de jardin) : Nous vivons dans le Limousin, donc un climat continental, plutôt proche du climat parisien, notre terre est acide et sablo-limoneuse. Nos hivers sont doux même si parfois cela peut geler très fort (-10 en général) et nos étés sont en général secs (et le sont de plus en plus)


                  Pour avoir des nouvelles quotidiennement, je t'invite à m'ajouter sur Instagram où je partage tous les jours : https://www.instagram.com/laptiteorti...`,
    tags:['permaculture', 'autonomie', 'jardinage','permacul', 'autonomdce', 'marichage'],
    statChoice:'nombre_vues',
    videoStats:{
      nombre_vues : {nombre : 48787,icon :faEye},
      nombre_likes : {nombre:1848,icon :faThumbsUp}
    },
    
  }


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
        <div className="flex flex-col items-center max-h-56 overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-white overflow-x-hidden">
          <VideoSection videoInfos = {testVideo} />
        </div>


    </div>
  )
}

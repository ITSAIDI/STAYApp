'use client'

import { viga,poppins } from '@/fonts'
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState,useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import VideoSection from './videoSection'
import { Combobox } from "./combobox"
import { Calendar22 } from "./datePicker"


const sortingList = [
  {
    value: "nombre_vues",
    label: "Number of views",
  },
  {
    value: "nombre_likes",
    label: "Number of likes",
  }
]

const orderingList = [
  {
    value: "desc",
    label: "Descending",
  },
  {
    value: "asc",
    label: "Ascending",
  }
]

const collectionDateList = [
  {
    value: "2025-05-21", // YYYY-MM-DD format adapted to what PostgreSQL requires.
    label: "21/05/2025", // What the user see
  },
]

export default function VideosLeaderboard() {

  const [statChoice,setStatChoice] = useState()
  const [order,setOrder] = useState()
  const [publicationDateFrom,setpublicationDateFrom] = useState()
  const [publicationDateTo,setpublicationDateTo] = useState()
  const [collectionDate,setCollectionDate] = useState()

  const formatDate = (date) => date?.toLocaleDateString('fr-CA')
  //formatDate used to format the calendar date into a format accepted by PogreSQL (CA for canadian Format yyyy-mm-dd)


  const debounceTimeout = useRef(null)
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
      //console.log('Videos :',videosInit.current)
    } 
    catch (error) {
      console.log('Failing while fetching videos ',error)
    }
  }
  async function getSearch() 
  {
    //console.log('getSearch Videos')
    if (!query.trim()) {
        setVideos(videosInit.current)
        return
      }

    try 
    {
      const res = await fetch(`/api/videos/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setVideos(data)
      
    } 
    catch (error) 
    {
      setVideos(videosInit.current)
      console.log('Failing while fetching suggestions ',error)
    }
  }

  async function getFiltering() 
  {
    //console.log("getFiltering")
    try 
    {
      const res = await fetch('/api/videos/filtering',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { statChoice,
            order,
            collectionDate,
            publicationDateFrom: formatDate(publicationDateFrom),
            publicationDateTo: formatDate(publicationDateTo)
          }),
      })
      const data = await res.json()

      setVideos(data)
      
    } 
    catch (error) 
    {
      setVideos(videosInit.current)
      console.log('Failing while Filtering videos',error)
    }
  }
  
  useEffect(()=>{
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current) // clear the previous timing
    debounceTimeout.current = setTimeout(
                                          () => {getSearch()}, 
                                          300
                                        ) 
    // Wait 300 ms before sending the request to avoid extra and unuseful requests.
  },[query])
  useEffect(()=>{getFiltering();},[statChoice,order,collectionDate,publicationDateFrom,publicationDateTo])
  useEffect(()=>{initVideos();},[])


  return (
    <div className='flex flex-col bg-white rounded-lg mt-2 p-2 w-full  mb-2'>

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

        {/* Videos Sorting and Collection Date */}
        <div className="flex flex-wrap gap-2 mt-2 items-baseline-last">
            <Combobox value = {statChoice} setValue={setStatChoice} itemsList={sortingList} text={"Sort videos"}/>
            <Combobox value = {order} setValue={setOrder} itemsList={orderingList} text={"Select order"} />
            <Combobox value = {collectionDate} setValue={setCollectionDate} itemsList={collectionDateList} text={"Collection Date"} />
            <Calendar22 title={'Publication Date (From)'} date={publicationDateFrom} setDate={setpublicationDateFrom}/>
            <Calendar22 title={'Publication Date (To)'} date={publicationDateTo} setDate={setpublicationDateTo}/>
          </div>

        {/* Videos List */}
        <div className="flex flex-col overflow-y-scroll max-h-svh scrollbar scrollbar-thumb-green1 scrollbar-track-white overflow-x-hidden">
          {
            videos.map((video,index)=>
            <VideoSection
             key={index}
             statChoice = {statChoice}
             videoInfos={{ ...video, order: index + 1 }}  />)
          }
        </div>


    </div>
  )
}

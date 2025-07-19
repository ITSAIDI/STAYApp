'use client'

import { faUser,faPlay,faEye,faCircleExclamation,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ChannelSection from "./channelSection"

import { viga,poppins } from "@/fonts"

import { useEffect, useState,useRef } from "react"
import { Combobox } from "./combobox"
import { Calendar22 } from "./datePicker"


const sortingList = [
  {
    value: "nombre_vues_total",
    label: "Number of views",
  },
  {
    value: "nombre_abonnes_total",
    label: "Number of subscribers",
  },
  {
    value: "nombre_videos_total",
    label: "Number of videos",
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
    value: "2025-05-19", // YYYY-MM-DD format adapted to what PostgreSQL requires.
    label: "19/05/2025", // What the user see
  },
]

export default function ChannelsLeaderboard() {
  const [statChoice,setStatChoice] = useState()
  const [order,setOrder] = useState()
  const [collectionDate,setCollectionDate] = useState()
  const [creationDateFrom,setCreationDateFrom] = useState()
  const [creationDateTo,setCreationDateTo] = useState()

  const formatDate = (date) => date?.toLocaleDateString('fr-CA')
  //formatDate used to format the calendar date into a format accepted by PogreSQL (CA for canadian Format yyyy-mm-dd)
  
  let channelsInit = useRef([]) // useRef to preserves the channelsInit after re-redering of  channelsLeaderBoard
  const debounceTimeout = useRef(null)
  const [channels,setChannels] = useState([])
  const [query,setQuery] = useState('')
  
  //console.log('creationDateTo :',formatDate(creationDateTo))
  //console.log('query:  ',query)



  async function initChannels()
  {
    try 
    {
      const res = await fetch('/api/channels')
      channelsInit.current = await res.json()
      setChannels(channelsInit.current)

      //console.log('ChNnels: ',channelsInit.current)
    } 
    catch (error) {
      console.log('Failing while fetching channels ',error)
    }
  }
  async function getSearch() 
  {
    if (!query.trim()) {
        setChannels(channelsInit.current)
        return
      }

    try 
    {
      const res = await fetch(`/api/channels/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setChannels(data)
      
    } 
    catch (error) 
    {
      setChannels(channelsInit.current)
      console.log('Failing while fetching suggestions ',error)
    }
  }
  async function getFiltering() 
  {
    //console.log("getFiltering")
    try 
    {
      const res = await fetch('/api/channels/filtering',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { statChoice,
            order,
            collectionDate,
            creationDateFrom: formatDate(creationDateFrom),
            creationDateTo: formatDate(creationDateTo)
          }),
      })
      const data = await res.json()

      setChannels(data)
      
    } 
    catch (error) 
    {
      setChannels(channelsInit.current)
      console.log('Failing while Filtering ',error)
    }
  }


  useEffect(()=>{initChannels();},[])

  useEffect(()=>{getFiltering();},[statChoice,order,collectionDate,creationDateFrom,creationDateTo])

  useEffect(()=>{
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current) // clear the previous timing
    debounceTimeout.current = setTimeout(
                                          () => {getSearch()}, 
                                          300
                                        ) 
    // Wait 300 ms before sending the request to avoid extra and unuseful requests.
  },[query])
  

  return (
    <div className='flex flex-col bg-white rounded-lg mt-2 p-2 w-full mb-2'>

        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Channels</h1>

        {/* Search area */}
        <div className="flex flex-row px-4 py-1 border rounded-full border-green1 text-sm mt-2 mb-2 gap-1">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl text-green1"  />
          <input
          type="text"
          placeholder="search for a channel by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className= {`${poppins.className} w-full focus:outline-none`}
          />
        </div>
        
        {/* Channels Sorting and Collection Date */}
        <div className="flex flex-wrap gap-3 mt-2 items-baseline-last">
            <Combobox value = {statChoice} setValue={setStatChoice} itemsList={sortingList} text={"Sort channels"}/>
            <Combobox value = {order} setValue={setOrder} itemsList={orderingList} text={"Select order"} />
            <Combobox value = {collectionDate} setValue={setCollectionDate} itemsList={collectionDateList} text={"Collection Date"} />
            <Calendar22 title={'Creation Date (From)'} date={creationDateFrom} setDate={setCreationDateFrom}/>
            <Calendar22 title={'Creation Date (To)'} date={creationDateTo} setDate={setCreationDateTo}/>
        </div>


        {/* Channels list */}
        <div className="flex flex-col items-start overflow-y-scroll max-h-svh scrollbar scrollbar-thumb-green1 scrollbar-track-white overflow-x-hidden">
          {
            channels.map((channel,index)=>
            (
              <ChannelSection
              key={channel.id_chaine}
              order={index+1}
              profileURL = {channel.logo}  
              channelName = {channel.nom} 
              creationDate = {new Date(channel.date_creation).toISOString().split('T')[0]}
              bio = {channel.bio}
              label = {channel.pertinente}
              statChoice = {statChoice}
              channelStats = {
                  {
                    nombre_abonnes_total:{number : channel.nombre_abonnes_total , icon : faUser},
                    nombre_videos_total    :{number : channel.nombre_videos_total , icon : faPlay},
                    nombre_vues_total     :{number : channel.nombre_vues_total , icon : faEye},
                    
                  }
                }
              />

            ))
           
          }
            

        </div>

        {/* Channels empty message */}
        {
          (channels.length === 0) 
          && 
          <div className="flex flex-col items-center text-gray-300 mt-3">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-3xl"  />
            <h1>No channels</h1>
          </div>
          
        }
        

    </div>
  )
}


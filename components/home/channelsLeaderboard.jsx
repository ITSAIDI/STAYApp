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
    value: "views",
    label: "Number of views",
  },
  {
    value: "subscribers",
    label: "Number of subscribers",
  },
  {
    value: "videos",
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


export default function ChannelsLeaderboard() {
  const [statChoice,setStatChoice] = useState("")
  const [order,setOrder] = useState("")
  
  let channelsInit = useRef([]) // useRef to preserves the channelsInit after re-redering of  channelsLeaderBoard
  const debounceTimeout = useRef(null)
  const [channels,setChannels] = useState([])
  const [query,setQuery] = useState('')
  

  //console.log('order :',order)
  //console.log('statChoice :',statChoice)

  async function initChannels()
  {
    try 
    {
      const res = await fetch('/api/channels')
      channelsInit.current = await res.json()
      setChannels(channelsInit.current)
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

  async function getSorting() 
  {
    console.log('getSorting i hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    try 
    {
      const res = await fetch('/api/channels/sorting',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statChoice, order }),
      })
      const data = await res.json()

      console.log('Sorted Channels',data)

      setChannels(data)
      
    } 
    catch (error) 
    {
      setChannels(channelsInit.current)
      console.log('Failing while sorting ',error)
    }
  }


  useEffect(()=>{initChannels();},[])
  
  useEffect(()=>{
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current) // clear the previous timing
    debounceTimeout.current = setTimeout(
                                          () => {getSearch()}, 
                                          300
                                        ) 
    // Wait 300 ms before sending the request to avoid extra and unuseful requests.
  },[query])
  
  useEffect(() => {
    if(statChoice !== "" && order !== "")
    {
      getSorting();
    }
    
  }, [statChoice, order])

  return (
    <div className='flex flex-col bg-white rounded-lg mt-2 p-2 w-[50%] h-full'>

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
        
        {/* Channels Sorting */}
        <div className="flex flex-row gap-2 w-fit mb-3">

            <Combobox value = {statChoice} setValue={setStatChoice} itemsList={sortingList} text={"Sort channels"}/>
            <Combobox value = {order} setValue={setOrder} itemsList={orderingList} text={"Select order"} />

        </div>

        {/* The Creation date range's choice  */}
        <div className="flex flex-row gap-2 w-fit items-center mb-3">

          <Calendar22 title={'Creation Date (From)'}/>
          <Calendar22 title={'Creation Date (To)'}/>
          
        </div>


        {/* Channels list */}
        <div className="flex flex-col items-start max-h-56 overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-white overflow-x-hidden">
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
                    subscribers:{number : channel.nombre_abonnes_total , icon : faUser},
                    videos    :{number : channel.nombre_videos_total , icon : faPlay},
                    views     :{number : channel.nombre_vues_total , icon : faEye},
                    
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

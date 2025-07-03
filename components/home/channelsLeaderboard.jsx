'use client'

import { faUser,faPlay,faEye,faCircleExclamation,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ChannelSection from "./channelSection"

import { viga,poppins } from "@/fonts"

import { useEffect, useState,useRef } from "react"
import { Combobox } from "./combobox"



export default function ChannelsLeaderboard() {
  const [statChoice,setStatChoice] = useState('views')
  let channelsInit = useRef([]) // useRef to preserves the channelsInit after re-redering of  channelsLeaderBoard
  const debounceTimeout = useRef(null)
  const [channels,setChannels] = useState([])
  const [query,setQuery] = useState('')

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


  useEffect(()=>{initChannels();},[])

  useEffect(()=>{
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current) // clear the previous timing
    debounceTimeout.current = setTimeout(
                                          () => {getSearch()}, 
                                          300
                                        ) 
    // Wait 300 ms before sending the request to avoid extra and unuseful requests.
  },[query])

  return (
    <div className='flex flex-col bg-white rounded-lg mt-2 p-2 w-[50%]'>

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
        
        {/* Channels Sorting Combobox*/}

        <Combobox value = {statChoice} setValue={setStatChoice} />

        {/* Channels list */}
        <div className="flex flex-col items-start max-h-60 overflow-y-scroll scrollbar scrollbar-thumb-green1 scrollbar-track-white overflow-x-hidden">
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
            <h1>No results</h1>
          </div>
          
        }
        

    </div>
  )
}

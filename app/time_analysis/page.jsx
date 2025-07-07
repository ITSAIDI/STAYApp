"use client"

import TimeChart from "@/components/time_analysis/timeChart"
import { useState,useEffect } from "react"



export default function time_analysis() {

  const Categories = [
  {
    value: "maladies_ravageurs",
    label: "Maladies_Ravageurs",
  },
    {
    value: "eau",
    label: "Eau",
  },
    {
    value: "sol",
    label: "Sol",
  },
    {
    value: "adventices",
    label: "Adventices",
  },
    {
    value: "récolte",
    label: "Récolte",
  }
  ]
  const [channelsData,setChannelsData] = useState([])
  const [videosData,setVideosData] = useState([])
  const [videosCategory,setVideosCategory] = useState("")
   


  const channelsMetadata = {
    charTitle : 'Channels by year',
    label:'Channels',
    description :"Number of channels created on each year",
    categories:[]
  }
  const videosMetadata = {
    charTitle : 'Videos by year',
    label:'Videos',
    description :"Number of videos published each year",
    categories:Categories
  }

  async function getChannelsData()
  {
    try 
    {
      const res = await fetch('/api/time_analysis/channels')
      const data = await res.json()
      //console.log(data)
      setChannelsData(data)
    } 
    catch (error) {
      console.log('Failing while fetching nombre of channels by year ',error)
    }
  }

  useEffect(()=>{getChannelsData()},[])


  return (
    <div className="p-2 flex flex-col gap-2 w-full">

      <div className="flex flex-row gap-2">
        <TimeChart  chartInfos = {channelsMetadata}  chartData = {channelsData}/>
        <TimeChart  chartInfos = {videosMetadata}  chartData = {channelsData} categoryState = {videosCategory} categoryFunction= {setVideosCategory}/>
      </div>
      
      
    </div>
  )
}

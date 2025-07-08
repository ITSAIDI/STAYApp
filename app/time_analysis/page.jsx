"use client"

import TimeChart from "@/components/time_analysis/timeChart"
import { useState,useEffect } from "react"
import { ThreeDot } from "react-loading-indicators"



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
  const [commentsData,setCommentsData] = useState([])

  const [videosCategory,setVideosCategory] = useState("")
  const [commentsCategory,setCommentsCategory] = useState("")
   
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);


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

  const commentsMetadata = {
    charTitle : 'Comments by year',
    label:'Comments',
    description :"Number of comments published each year",
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
      console.log('Failing while fetching numbre of channels by year ',error)
    }
  }

  async function getVideosData()
  {
    try 
    {
      const res = await fetch('/api/time_analysis/videos')
      const data = await res.json()
      //console.log(data)
      setVideosData(data)
    } 
    catch (error) {
      console.log('Failing while fetching numbre of videos by year ',error)
    }
  }

  async function getCommentsData()
  {
    try 
    {
      const res = await fetch('/api/time_analysis/comments')
      const data = await res.json()
      //console.log(data)
      setCommentsData(data)
    } 
    catch (error) {
      console.log('Failing while fetching numbre of comments by year ',error)
    }
  }

  const fetchWithDelay = async () => {
    await getChannelsData()
    setChannelsLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 1500)) // delay of 1.5 s

    await getVideosData()
    setVideosLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 1000)) // delay of 1.5 s
    await getCommentsData()
    setCommentsLoading(false)
  }
  useEffect(()=>{fetchWithDelay()},[])


  return (
    <div className="p-2 flex flex-col gap-2 w-full">

      <div className="flex flex-row gap-2">
        {channelsLoading ? (
           <div className="mt-[200px] ml-[100px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color='#7af0a8'/>
           </div>
         
        ):<TimeChart  chartInfos = {channelsMetadata}  chartData = {channelsData}/>}
        
        {(videosLoading && !channelsLoading) ? (
           <div className="mt-[200px] ml-[200px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color='#7af0a8'/>
           </div>
         
        ):
        <TimeChart  chartInfos = {videosMetadata}  chartData = {videosData} categoryState = {videosCategory} categoryFunction= {setVideosCategory}/>}
        
      </div>

      <div className="flex flex-row gap-2">
         {(!videosLoading && !channelsLoading && commentsLoading) ? (
           <div className="mt-[200px] ml-[200px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color='#7af0a8'/>
           </div>
         
        ):
        <TimeChart  chartInfos = {commentsMetadata}  chartData = {commentsData} categoryState = {commentsCategory} categoryFunction= {setCommentsCategory}/>}
        
      </div>
      
      
    </div>
  )
}

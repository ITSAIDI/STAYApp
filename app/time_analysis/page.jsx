"use client"

import { SeasonalityChart } from "@/components/time_analysis/seasonalityChart"
import TimeChart from "@/components/time_analysis/timeChart"
import VideosChart from "@/components/time_analysis/videosChart"

import { useState,useEffect } from "react"
import { ThreeDot } from "react-loading-indicators"
import { Checkbox } from "@/components/ui/checkbox"
import { viga } from "@/fonts"



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
  
  const Events = [
    {
      year : '2020',
      name : 'Covid19'
    },
    {
      year : '2022',
      name : 'Russia-Ukraine War'
    }
  ]


  const [showEvents,setShowEvents] = useState(false)

  const [channelsData,setChannelsData] = useState([])

  const [videosDataLarge,setVideosDataLarge] = useState([])
  const [videosDataSmall,setVideosDataSmall] = useState([])
  const [videosDataMedium,setVideosDataMedium] = useState([])

  const [commentsData,setCommentsData] = useState([])
  const [durationsData,setDurationsData] = useState([])
  const [channelSeasonalityData,setChannelSeasonalityData] = useState([])
  const [videoSeasonalityData,setVideoSeasonalityData] = useState([])

  //console.log('channelSeasonalityData',channelSeasonalityData)

  const [videosCategory,setVideosCategory] = useState("")
  const [commentsCategory,setCommentsCategory] = useState("")
  const [durationsCategory,setDurationsCategory] = useState("")
   
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [durationsLoading, setDurationsLoading] = useState(true);
  const [channelSeasonalityLoading, setchannelSeasonalityLoading] = useState(true);
  const [videoSeasonalityLoading, setvideoSeasonalityLoading] = useState(true);


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
    categories:[]
  }

  const commentsMetadata = {
    charTitle : 'Comments by year',
    label:'Comments',
    description :"Number of comments published each year",
    categories:[]
  }

  const durationsMetadata = {
    charTitle : 'Duration by year',
    label:'Average duration (s)',
    description :"Average duration in seconds of videos published each year",
    categories:[]
  }

  const channelSeasonalityMetadata = {
    charTitle : 'Channels Seasonality',
    label:'Channels',
    description :"Number of channels created on each season",
    colors :{
        winter: '#7af0a8',
        spring: '#227E51',
        summer: '#13452D',
        autumn: '#30ce74',
      },
      chartConfig:{
        winter: {
                  label: "Winter",
                },
        spring: {
                  label: "Spring",
                },
        summer: {
                  label: "Summer",
                },
        autumn: {
                  label: "Autumn",
                },
      }
  }

  const videoSeasonalityMetadata = {
    charTitle : 'Videos Seasonality',
    label:'Videos',
    description :"Number of videos published on each season",
    colors :{
        winter: '#7af0a8',
        spring: '#227E51',
        summer: '#13452D',
        autumn: '#30ce74',
      },
      chartConfig:{
        winter: {
                  label: "Winter",
                },
        spring: {
                  label: "Spring",
                },
        summer: {
                  label: "Summer",
                },
        autumn: {
                  label: "Autumn",
                },
      }
  }

  function groupBySeason(data) {
  const keys = Object.keys(data[0]);

  const seasons = {
    winter: [12, 1, 2],
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    autumn: [9, 10, 11],
  };

  const counters = {
    winter: 0,
    spring: 0,
    summer: 0,
    autumn: 0,
  };

  data.forEach((item) => {
    const month = parseInt(item[keys[0]]);
    const count = parseInt(item[keys[1]]);

    for (const [season, months] of Object.entries(seasons)) {
      if (months.includes(month)) {
        counters[season] += count;
        break;
      }
    }
  });

  return Object.entries(counters).map(([season, value]) => ({
    season,
    [keys[1]]: value,
  }));
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

      let res = await fetch('/api/time_analysis/videosLargeChannels')
      let data = await res.json()
      setVideosDataLarge(data)

      //console.log('videosLargeChannels ',data)

      res = await fetch('/api/time_analysis/videoSmallChannels')
      data = await res.json()
      setVideosDataSmall(data)

      //console.log('videoSmallChannels ',data)

      res = await fetch('/api/time_analysis/videosMediumChannels')
      data = await res.json()
      setVideosDataMedium(data)

      //console.log('videosMediumChannels ',data)

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

  async function getDurationsData()
  {
    try 
    {
      const res = await fetch('/api/time_analysis/durations')
      const data = await res.json()
      //console.log(data)
      setDurationsData(data)
    } 
    catch (error) {
      console.log('Failing while fetching average duration by year ',error)
    }
  }

  async function getChannelSeasonalityData()
  {
    try 
    {
      const res = await fetch('/api/time_analysis/channelSeasonality')
      const data = await res.json()
      //console.log(data)
      //console.log(groupBySeason(data))
      setChannelSeasonalityData(groupBySeason(data))
    } 
    catch (error) {
      console.log('Failing while fetching channels-seasonality',error)
    }
  }

  async function getVideoSeasonalityData()
  {
    try 
    {
      const res = await fetch('/api/time_analysis/videoSeasonality')
      const data = await res.json()
      //console.log(data)
      //console.log(groupBySeason(data))
      setVideoSeasonalityData(groupBySeason(data))
    } 
    catch (error) {
      console.log('Failing while fetching videos-seasonality',error)
    }
  }

  const fetchWithDelay = async () => {
    await getChannelsData()
    setChannelsLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 1500)) // delay of 1.5 s

    await getVideosData()
    setVideosLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 1500)) // delay of 1.5 s
    
    await getCommentsData()
    setCommentsLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 2000)) // delay of 1.5 s
    
    await getDurationsData()
    setDurationsLoading(false)
    
    await new Promise((resolve) => setTimeout(resolve, 2000)) // delay of 1.5 s

    await getChannelSeasonalityData()
    setchannelSeasonalityLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 2000)) // delay of 1.5 s

    await getVideoSeasonalityData()
    setvideoSeasonalityLoading(false)
  }

  useEffect(()=>{fetchWithDelay()},[])

  const ThreeDotColor = '#13452D'

  return (
    <div className="p-2 flex flex-col gap-2 w-full">
      <div className="flex flex-row gap-2 mt-2 ml-2 items-center">
        <Checkbox 
        className='border-green1 border-2'
        checked={showEvents} 
        onCheckedChange = {()=>{setShowEvents(!showEvents)}}
          />
          <h1 className={`${viga.className} text-[14px]`}>Events</h1>
      </div>
    
      <div className="grid grid-cols-2 gap-2">
        {channelsLoading ? (
           <div className="mt-[200px] ml-[100px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):<TimeChart  chartInfos = {channelsMetadata}  chartData = {channelsData} events = {Events} showEvents={showEvents} showCumulOption = {true}/>}
        
        {(videosLoading && !channelsLoading) ? (
           <div className="mt-[200px] ml-[200px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):
        <VideosChart  chartInfos = {videosMetadata} categoryState = {videosCategory} categoryFunction= {setVideosCategory} events = {Events} showEvents={showEvents} chartDataLarge={videosDataLarge} chartDataSmall={videosDataSmall} chartDataMedium={videosDataMedium} />}
        
      </div>

      <div className="grid grid-cols-2 gap-2">
         {(!videosLoading && !channelsLoading && commentsLoading) ? (
           <div className="mt-[200px] ml-[200px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):<TimeChart  chartInfos = {commentsMetadata}  chartData = {commentsData} categoryState = {commentsCategory} categoryFunction= {setCommentsCategory} events = {Events} showEvents={showEvents}/>}
        
        {(!videosLoading && !channelsLoading && !commentsLoading && durationsLoading) ? (
           <div className="mt-[200px] ml-[200px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):<TimeChart  chartInfos = {durationsMetadata}  chartData = {durationsData} categoryState = {durationsCategory} categoryFunction= {setDurationsCategory} events = {Events} showEvents={showEvents}/>}
      
      </div>

      <div className="grid grid-cols-2 gap-2">
         {(!videosLoading && !channelsLoading && !commentsLoading && !durationsLoading && channelSeasonalityLoading) ? (
           <div className="mt-[200px] ml-[200px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):<SeasonalityChart chartInfos={channelSeasonalityMetadata} chartData={channelSeasonalityData} />}
         {(!videosLoading && !channelsLoading && !commentsLoading && !durationsLoading && !channelSeasonalityLoading && videoSeasonalityLoading) ? (
           <div className="mt-[200px] ml-[200px] mb-[100%]">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):<SeasonalityChart chartInfos={videoSeasonalityMetadata} chartData={videoSeasonalityData} />}
      </div>
      
      
    </div>
  )
}

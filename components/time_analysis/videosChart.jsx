"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle, CardDescription
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {viga } from "@/fonts"
import { Combobox } from "../home/combobox"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"


export default function VideosChart({chartInfos,chartData,categoryState,categoryFunction,events,showEvents,chartDataLarge,chartDataSmall,chartDataMedium}) {

  if (!chartData || chartData.length === 0) return null 

  const keys = Object.keys(chartData[0])

  const [showCumul,setShowCumul] = useState(false) // One State to handle the 4 plots
  const [showLarge,setShowLarge] = useState(false)
  const [showSmall,setShowSmall] = useState(false)
  const [showMedium,setShowMedium] = useState(false)

  function cumulativeVideos(data) 
  {
    let cumulativeSum = 0

    return data.map(item => {
      cumulativeSum += item[keys[1]]
      return {
        ...item,
        [keys[1]]: cumulativeSum
        }
        })
  }

  function parseToInt(data)
  {
    let parsedData = data.map(item =>({
    ...item,
    [keys[1]]:parseInt(item[keys[1]])
    }))

    return parsedData
  }

  function handleClick()
  {
    if(showCumul)
    {
      setShowCumul(false)
      setDataDefault(TheData['default'])
      setDataLarge(TheData['large'])
      setDataSmall(TheData['small'])
      setDataMedium(TheData['medium'])
    }
    else
    {
      setShowCumul(true)
      setDataDefault(TheCumulData['default'])
      setDataLarge(TheCumulData['large'])
      setDataSmall(TheCumulData['small'])
      setDataMedium(TheCumulData['medium'])
    }
  }

  const TheData = {
    'default': parseToInt(chartData),
    'large':parseToInt(chartDataLarge) ,
    'small':parseToInt(chartDataSmall) ,
    'medium':parseToInt(chartDataMedium)
  } 
  const TheCumulData = {
    'default': cumulativeVideos(TheData['default']),
    'large': cumulativeVideos(TheData['large']),
    'small':cumulativeVideos(TheData['small']) ,
    'medium':cumulativeVideos(TheData['medium'])
  } 

  const [dataDefault,setDataDefault] = useState(TheData['default'])
  const [dataLarge,setDataLarge] = useState(TheData['large'])
  const [dataSmall,setDataSmall] = useState(TheData['small'])
  const [dataMedium,setDataMedium] = useState(TheData['medium'])

  const eventYears = events.map(event => event.year)

  const chartConfig = {
    'default':{
       [keys[1]]: {
          label: chartInfos.label,
          color: "#227E51",
        }
       },
    'large':{
       [keys[1]]: {
          label: chartInfos.label,
          color: "#13452D",
        }
       },
    'small':{
       [keys[1]]: {
          label: chartInfos.label,
          color: "#7af0a8",
        }
       },
    'medium':{
       [keys[1]]: {
          label: chartInfos.label,
          color: "#30ce74",
        }
       },
       
      }

  return (
    <Card className='w-[500px] h-[400px]' >
      <CardHeader className='flex flex-wrap justify-between'>
        <div className="flex flex-col gap-2">
          <CardTitle>{chartInfos.charTitle}</CardTitle>
          <CardDescription>{chartInfos.description}</CardDescription>
        </div>
        
        {(chartInfos.categories.length > 0) &&
        <Combobox value = {categoryState} setValue={categoryFunction} itemsList={chartInfos.categories} text={"Select category"}/>
        }
        
        <div className="flex flex-row gap-2 mt-2 items-center">
          <Checkbox 
          className='border-black border-2'
          checked={showCumul} 
          onCheckedChange = {()=>{handleClick();}}
            />
          <h1 className={`${viga.className} text-[15px]`}>Cumulative</h1>
        </div>

        <div className="flex flex-row gap-2 mt-2 items-center">
          <Checkbox 
          className='border-green1 border-2'
          checked={showLarge} 
          onCheckedChange = {()=>{setShowLarge(!showLarge)}}
            />
          <h1 className={`${viga.className} text-[15px]`}>Large Channels</h1>
        </div>
        
        <div className="flex flex-row gap-2 mt-2 items-center">
          <Checkbox 
          className='border-green3 border-2'
          checked={showSmall} 
          onCheckedChange = {()=>{setShowSmall(!showSmall)}}
            />
          <h1 className={`${viga.className} text-[15px]`}>Small Channels</h1>
        </div>
        
        <div className="flex flex-row gap-2 mt-2 items-center">
          <Checkbox 
          className='border-green4 border-2'
          checked={showMedium} 
          onCheckedChange = {()=>{setShowMedium(!showMedium)}}
            />
          <h1 className={`${viga.className} text-[15px]`}>Medium Channels</h1>
        </div>
           
      </CardHeader>

      <CardContent className='mt-0'>
        <ChartContainer config={chartConfig['default']}>
          <LineChart
            data={dataDefault}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={keys[0]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className={`${viga.className} text-[14px]`}
            />
            <ChartTooltip
              className = {`${viga.className} text-[14px]`}
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey={keys[1]}
              type="natural"
              stroke={chartConfig['default'][keys[1]]['color']}
              strokeWidth={2}
               dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const year = payload[keys[0]] // x-axis key (e.g., "year")

                    return (
                      <circle
                        key={`${index}-${keys[1]}-default`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={(eventYears.includes(year) && showEvents) ? "red" : chartConfig['default'][keys[1]]['color']}
                      />
                    )
                  }}
              activeDot={(props) => {
                const { cx, cy, payload, index } = props
                const year = payload[keys[0]]
                const event = events.find(e => e.year === year)

                if (!event || !showEvents) return (<circle
                    key={`${index}-${keys[1]}-default`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill= {chartConfig['default'][keys[1]]['color']}
                  />)

                const textX = cx - 80
                const textY = cy - 15
                const padding = 4
                const fontSize = 14
                
              const textWidth = event.name.length * 8
              const textHeight = fontSize + padding * 2

              return (
                <g>
                  <circle
                    key={`${index}-${keys[1]}-default`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill={"red"}
                  />
                  <rect
                    x={textX - padding}
                    y={textY - fontSize}
                    width={textWidth + padding * 2}
                    height={textHeight}
                    fill="#7af0a8"
                    rx={3} 
                    ry={3}
                  />
                  <text
                    className={`${viga.className} text-[14px]`}
                    x={textX}
                    y={textY}
                    fill="#13452D"
                  >
                    {event.name}
                  </text>
                </g>
              )
              }}

            >
            </Line>
          </LineChart>
        </ChartContainer>
        {
          showLarge && 
          <ChartContainer config={chartConfig['large']}>
          <LineChart
            data={dataLarge}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={keys[0]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className={`${viga.className} text-[14px]`}
            />
            <ChartTooltip
              className = {`${viga.className} text-[14px]`}
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey={keys[1]}
              type="natural"
              stroke={chartConfig['large'][keys[1]]['color']}
              strokeWidth={2}
               dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const year = payload[keys[0]] // x-axis key (e.g., "year")

                    return (
                      <circle
                        key={`${index}-${keys[1]}-large`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={(eventYears.includes(year) && showEvents) ? "red" : chartConfig['large'][keys[1]]['color']}
                      />
                    )
                  }}
              activeDot={(props) => {
                const { cx, cy, payload, index } = props
                const year = payload[keys[0]]
                const event = events.find(e => e.year === year)

                if (!event || !showEvents) return (<circle
                    key={`${index}-${keys[1]}-large`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill= {chartConfig['large'][keys[1]]['color']}
                  />)

                const textX = cx - 80
                const textY = cy - 15
                const padding = 4
                const fontSize = 14
                
              const textWidth = event.name.length * 8
              const textHeight = fontSize + padding * 2

              return (
                <g>
                  <circle
                    key={`${index}-${keys[1]}-large`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill={"red"}
                  />
                  <rect
                    x={textX - padding}
                    y={textY - fontSize}
                    width={textWidth + padding * 2}
                    height={textHeight}
                    fill="#7af0a8"
                    rx={3} 
                    ry={3}
                  />
                  <text
                    className={`${viga.className} text-[14px]`}
                    x={textX}
                    y={textY}
                    fill="#13452D"
                  >
                    {event.name}
                  </text>
                </g>
              )
              }}

            >
            </Line>
          </LineChart>
        </ChartContainer>
        }
      </CardContent>
    </Card>
  )
}

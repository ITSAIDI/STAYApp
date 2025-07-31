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


export default function VideosChart({chartInfos,categoryState,categoryFunction,events,showEvents,chartDataLarge,chartDataSmall,chartDataMedium}) {

  if (!chartDataLarge || chartDataLarge.length === 0) return null 

  const [showCumul,setShowCumul] = useState(false) // One State to handle the 4 plots
  const [showDefault,setShowDefault] = useState(true)
  const [showLarge,setShowLarge] = useState(false)
  const [showSmall,setShowSmall] = useState(false)
  const [showMedium,setShowMedium] = useState(false)


  function mergeVideosData(largeData, smallData, mediumData) {
  const yearSet = new Set()

  largeData.forEach(item => yearSet.add(item.publicationyear))
  smallData.forEach(item => yearSet.add(item.publicationyear))
  mediumData.forEach(item => yearSet.add(item.publicationyear))

  const merged = Array.from(yearSet)
    .sort()
    .map(year => {
      const large = largeData.find(d => d.publicationyear === year)
      const small = smallData.find(d => d.publicationyear === year)
      const medium = mediumData.find(d => d.publicationyear === year)

      const largeVal = large ? parseInt(large.videosnumber) : 0
      const smallVal = small ? parseInt(small.videosnumber) : 0
      const mediumVal = medium ? parseInt(medium.videosnumber) : 0

      return {
        publicationyear: year,
        default: largeVal + smallVal + mediumVal,
        large: largeVal,
        small: smallVal,
        medium: mediumVal
      }
    })

  return merged 
  }

  function computeCumulativeData(data) {
  let cumulDefault = 0
  let cumulLarge = 0
  let cumulSmall = 0
  let cumulMedium = 0

  return data.map(item => {
    cumulDefault += item.default
    cumulLarge += item.large
    cumulSmall += item.small
    cumulMedium += item.medium

    return {
      publicationyear: item.publicationyear,
      default: cumulDefault,
      large: cumulLarge,
      small: cumulSmall,
      medium: cumulMedium
    }
  })
  }

  function handleClick(){
    if(showCumul)
    {
      setShowCumul(false)
      setData(chartData)
    }
    else
    {
      setShowCumul(true)
      setData(chartDataCumul)
    }

  }

  const chartData = mergeVideosData(chartDataLarge,chartDataSmall,chartDataMedium)
  const chartDataCumul = computeCumulativeData(chartData)
  const [data,setData]= useState(chartData)

  //console.log('chartData  : ',chartData)
  //console.log('chartDataCumul  : ',chartDataCumul)
  console.log('data ',data)

  const chartConfig = {
  default: {
    label: "All types",
    color: "#227E51",
  },
  large: {
    label: "Large",
    color: "#13452D",
  },
  small: {
    label: "Small",
    color: "#7af0a8",
  },
  medium: {
    label: "Medium",
    color: "#B6F500",
  },
  } 

  const eventYears = events.map(event => event.year)



  return (
    <Card className='w-full h-full' >
      <CardHeader className='flex flex-col gap-2'>
        <div className="flex flex-row justify-between items-center w-full">
           <div className="flex flex-col gap-2">
              <CardTitle>{chartInfos.charTitle}</CardTitle>
              <CardDescription>{chartInfos.description}</CardDescription>
            </div>
            
            <div className="flex flex-row gap-2 mt-2 items-center">
              <Checkbox 
              className='border-black border-2'
              checked={showCumul} 
              onCheckedChange = {()=>{handleClick();}}
                />
              <h1 className={`${viga.className} text-[15px]`}>Cumulative</h1>
            </div>
        </div>
       
        <div className="flex flex-wrap gap-3">

            {(chartInfos.categories.length > 0) &&
            <Combobox value = {categoryState} setValue={categoryFunction} itemsList={chartInfos.categories} text={"Select category"}/>
            }
          
            
          <div className="flex flex-row gap-2 mt-2 items-center">
            <Checkbox 
              className="border-2"
              style={{
                borderColor: chartConfig.default.color,
                backgroundColor: showDefault ? chartConfig.default.color : 'transparent'
              }}
              checked={showDefault} 
              onCheckedChange={() => setShowDefault(!showDefault)}
            />
            <h1
              className={`${viga.className} text-[15px]`}
              style={{ color: chartConfig.default.color }}
            >
              All Channels
            </h1>
          </div>

          <div className="flex flex-row gap-2 mt-2 items-center">
            <Checkbox 
              className="border-2"
              style={{
                borderColor: chartConfig.large.color,
                backgroundColor: showLarge ? chartConfig.large.color : 'transparent'
              }}
              checked={showLarge} 
              onCheckedChange={() => setShowLarge(!showLarge)}
            />
            <h1
              className={`${viga.className} text-[15px]`}
              style={{ color: chartConfig.large.color }}
            >
              Large Channels
            </h1>
          </div>

          <div className="flex flex-row gap-2 mt-2 items-center">
            <Checkbox 
              className="border-2"
              style={{
                borderColor: chartConfig.small.color,
                backgroundColor: showSmall ? chartConfig.small.color : 'transparent'
              }}
              checked={showSmall} 
              onCheckedChange={() => setShowSmall(!showSmall)}
            />
            <h1
              className={`${viga.className} text-[15px]`}
              style={{ color: chartConfig.small.color }}
            >
              Small Channels
            </h1>
          </div>

          <div className="flex flex-row gap-2 mt-2 items-center">
            <Checkbox 
              className="border-2"
              style={{
                borderColor: chartConfig.medium.color,
                backgroundColor: showMedium ? chartConfig.medium.color : 'transparent'
              }}
              checked={showMedium} 
              onCheckedChange={() => setShowMedium(!showMedium)}
            />
            <h1
              className={`${viga.className} text-[15px]`}
              style={{ color: chartConfig.medium.color }}
            >
              Medium Channels
            </h1>
          </div>

        </div>
           
      </CardHeader>

      <CardContent className='mt-0'>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="publicationyear"
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

            {/* Default */}
            {
              showDefault && 
            <Line
              dataKey="default"
              type="natural"
              stroke={chartConfig.default.color}
              strokeWidth={2}
               dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const year = payload["publicationyear"] // x-axis key (e.g., "year")

                    return (
                      <circle
                        key={`${index}-default`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={(eventYears.includes(year) && showEvents) ? "red" : chartConfig.default.color}
                      />
                    )
                  }}
              activeDot={(props) => {
                const { cx, cy, payload, index } = props
                const year = payload["publicationyear"]
                const event = events.find(e => e.year === year)

                if (!event || !showEvents) return (<circle
                    key={`${index}-default`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill= {chartConfig.default.color}
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
                    key={`${index}-default`}
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
            }
            
            {/* Large */}
            {
              showLarge &&
            <Line
              dataKey="large"
              type="natural"
              stroke={chartConfig.large.color}
              strokeWidth={2}
               dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const year = payload["publicationyear"] // x-axis key (e.g., "year")

                    return (
                      <circle
                        key={`${index}-large`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={(eventYears.includes(year) && showEvents) ? "red" : chartConfig.large.color}
                      />
                    )
                  }}
              activeDot={(props) => {
                const { cx, cy, payload, index } = props
                const year = payload["publicationyear"]
                const event = events.find(e => e.year === year)

                if (!event || !showEvents) return (<circle
                    key={`${index}-large`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill= {chartConfig.large.color}
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
                    key={`${index}-large`}
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
            }

            {/* Small */}
             {
              showSmall &&
            <Line
              dataKey="small"
              type="natural"
              stroke={chartConfig.small.color}
              strokeWidth={2}
               dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const year = payload["publicationyear"] // x-axis key (e.g., "year")

                    return (
                      <circle
                        key={`${index}-small`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={(eventYears.includes(year) && showEvents) ? "red" : chartConfig.small.color}
                      />
                    )
                  }}
              activeDot={(props) => {
                const { cx, cy, payload, index } = props
                const year = payload["publicationyear"]
                const event = events.find(e => e.year === year)

                if (!event || !showEvents) return (<circle
                    key={`${index}-small`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill= {chartConfig.small.color}
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
                    key={`${index}-small`}
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
             }

            {/* Medium */}
            {
              showMedium &&
            <Line
              dataKey="medium"
              type="natural"
              stroke={chartConfig.medium.color}
              strokeWidth={2}
               dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const year = payload["publicationyear"] // x-axis key (e.g., "year")

                    return (
                      <circle
                        key={`${index}-medium`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={(eventYears.includes(year) && showEvents) ? "red" : chartConfig.medium.color}
                      />
                    )
                  }}
              activeDot={(props) => {
                const { cx, cy, payload, index } = props
                const year = payload["publicationyear"]
                const event = events.find(e => e.year === year)

                if (!event || !showEvents) return (<circle
                    key={`${index}-medium`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill= {chartConfig.medium.color}
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
                    key={`${index}-medium`}
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
            }

          </LineChart>
        </ChartContainer>
       
      </CardContent>
    </Card>
  )
}

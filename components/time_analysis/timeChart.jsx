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


export default function TimeChart({chartInfos,chartData,categoryState,categoryFunction,events,showEvents,showCumulOption =false}) {

  if (!chartData || chartData.length === 0) return null 

  const keys = Object.keys(chartData[0])

  function cumulativeVideos() 
  {
    let cumulativeSum = 0

    return parsedChartData.map(item => {
      cumulativeSum += item[keys[1]]
      return {
        ...item,
        [keys[1]]: cumulativeSum
        }
        })
  }

  function handleClick()
  {
    if(showCumul)
    {
      setShowCumul(false)
      setShowenData(parsedChartData)
    }
    else
    {
      setShowCumul(true)
      setShowenData(parsedCumulData)
    }
  }

  let parsedChartData = chartData.map(item =>({
    ...item,
    [keys[1]]:parseInt(item[keys[1]])
  }))

  let parsedCumulData = cumulativeVideos()


  const [showCumul,setShowCumul] = useState(false)
  const [showenData,setShowenData] = useState(parsedChartData)
  const eventYears = events.map(event => event.year)
  const chartConfig = {
        [keys[1]]: {
          label: chartInfos.label,
          color: "#13452D",
        }
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
        {showCumulOption && (
            <div className="flex flex-row gap-2 mt-2 items-center">
              <Checkbox 
              className='border-green1 border-2'
              checked={showCumul} 
              onCheckedChange = {()=>{handleClick();}}
                />
              <h1 className={`${viga.className} text-[15px]`}>Cumulative</h1>
            </div>
          )
        }
        
      </CardHeader>

      <CardContent className='mt-0'>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={showenData}
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
              stroke="#227E51"
              strokeWidth={2}
               dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const year = payload[keys[0]] // x-axis key (e.g., "year")

                    return (
                      <circle
                        key={`${index}-${keys[1]}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={(eventYears.includes(year) && showEvents) ? "red" : "#227E51"}
                      />
                    )
                  }}
              activeDot={(props) => {
                const { cx, cy, payload, index } = props
                const year = payload[keys[0]]
                const event = events.find(e => e.year === year)

                if (!event || !showEvents) return (<circle
                    key={`${index}-${keys[1]}`}
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill="#227E51"
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
                    key={`${index}-${keys[1]}`}
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
                    rx={3} // coins arrondis optionnel
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
      </CardContent>
    </Card>
  )
}

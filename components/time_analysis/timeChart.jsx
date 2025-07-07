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
import { poppins,viga } from "@/fonts"
import { Combobox } from "../home/combobox"


export default function TimeChart({chartInfos,chartData,categoryState,categoryFunction}) {

  if (!chartData || chartData.length === 0) return null // ou un loader

  const keys = Object.keys(chartData[0])

  const chartConfig = {
        [keys[1]]: {
          label: chartInfos.label,
          color: "#13452D",
        }
      }

 

  return (
    <Card className='w-[500px] h-[400px]' >
      <CardHeader className='flex flex-row justify-between'>
        <div className="flex flex-col gap-2">
          <CardTitle>{chartInfos.charTitle}</CardTitle>
          <CardDescription>{chartInfos.description}</CardDescription>
        </div>
        
        {(chartInfos.categories.length > 0) &&
        <Combobox value = {categoryState} setValue={categoryFunction} itemsList={chartInfos.categories} text={"Select category"}/>
        }
      </CardHeader>

      <CardContent className='mt-0'>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
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
              dot={{
                fill: "#227E51",
              }}
              activeDot={{
                r: 8,
              }}
            >
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

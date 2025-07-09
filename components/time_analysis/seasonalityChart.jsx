"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { viga } from "@/fonts"


export function SeasonalityChart({ chartInfos, chartData }) {
  if (!chartData || chartData.length === 0) return null

  const keys = Object.keys(chartData[0])
  const id = "pie-interactive"
  
  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartInfos.chartConfig} />
      <CardHeader className="space-y-0 pb-0">
        <CardTitle>{chartInfos.charTitle}</CardTitle>
        <CardDescription>{chartInfos.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
         <ChartContainer
            id={id}
            config={chartInfos.chartConfig}
            className="w-full aspect-square"
            >
            <PieChart>
                <ChartTooltip
                className={`${viga.className} text-[14px]`}
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                className="w-full h-full"
                data={chartData}
                dataKey={keys[1]}
                nameKey="season"
                innerRadius={60}
                strokeWidth={5}
                activeShape={(props) => {
                        const {
                            cx,
                            cy,
                            midAngle,
                            outerRadius,
                            fill,
                            payload,
                            value
                        } = props;

                        const RADIAN = Math.PI / 180;
                        const sin = Math.sin(-RADIAN * midAngle);
                        const cos = Math.cos(-RADIAN * midAngle);
                        const sx = cx + (outerRadius + 30) * cos;
                        const sy = cy + (outerRadius + 30) * sin;

                        // Compute total to get percentage
                        const total = chartData.reduce((acc, entry) => acc + entry[keys[1]], 0);
                        const percentage = ((value / total) * 100).toFixed(1);

                        return (
                            <g>
                            <Sector {...props} outerRadius={outerRadius + 10} />
                            <Sector
                                {...props}
                                outerRadius={outerRadius + 25}
                                innerRadius={outerRadius + 12}
                            />
                    <text
                        x={sx}
                        y={sy}
                        fill={fill}
                        textAnchor={cos >= 0 ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={16}
                        fontWeight="bold"
                    >
                        {percentage}%
                    </text>
                    </g>
                );
                }}

                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartInfos.colors[entry.season]} />
                ))}
                </Pie>
            </PieChart>
            </ChartContainer>
           
      </CardContent>
    </Card>
  )
}

'use client'

import { useEffect, useState } from "react"
import { faTv, faPlay, faComments } from "@fortawesome/free-solid-svg-icons"
import HomeBox from "./homeBox"

export default function HomeStatistics() {
  const [stats, setStats] = useState({
    numChannels: 0,
    numVideos: 0,
    numComments: 0
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/statistics")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch statistics", error)
      }
    }

    fetchStats()
  }, [])

  const boxes = [
    {
      textColor: 'text-white',
      bgColor: 'bg-green1',
      number: stats.numChannels,
      title: 'Number of pertinente channels',
      icon: faTv
    },
    {
      textColor: 'text-white',
      bgColor: 'bg-green2',
      number: stats.numVideos,
      title: 'Number of videos',
      icon: faPlay
    },
    {
      textColor: 'text-green1',
      bgColor: 'bg-green-300',
      number: stats.numComments,
      title: 'Number of comments',
      icon: faComments
    }
  ]

  return (
    <div className="flex flex-row gap-3 justify-between">
      {boxes.map((box, index) => (
        <HomeBox
          key={index}
          textColor={box.textColor}
          bgColor={box.bgColor}
          number={box.number}
          title={box.title}
          icon={box.icon}
        />
      ))}
    </div>
  )
}

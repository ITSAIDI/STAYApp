'use client'

import { viga } from "@/fonts"


export default function UsersNetwork() {
  const description = `This network represents the relationships between self-sufficiency channels. 
 Each node is a channel, and each edge represents mentions in the title, description, or tags of videos from the source channel.
 Mentions can be by the name or the ID of the destination channel.
  `
  return (
    <div className="bg-white h-full w-full p-2 rounded-sm">
       {/* Title */}
       <h1 className = {`${viga.className} text-xl text-green1`}>Users Network</h1>
       <p className="text-gray-500 font-bold whitespace-pre-line mt-2">{description}</p>
    </div>
  )
}

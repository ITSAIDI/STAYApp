'use client'

import { viga } from "@/fonts"
import InfoBull from "../ui/infoBull"

export default function UsersNetwork() {
  const description = `This network represents the relationships between self-sufficiency channels. 
 Each node is a channel, and each edge represents mentions in the title, description, or tags of videos from the source channel.
 Mentions can be by the name or the ID of the destination channel.
  `
  return (
    <div className="bg-white h-full w-full p-2 rounded-sm">
      {/* Header */}
      <div className="flex flex-row gap-1">
          <h1 className = {`${viga.className} text-xl text-green1`}>Channels Network</h1>
          <InfoBull  information={description}/>
      </div>
    </div>
  )
}

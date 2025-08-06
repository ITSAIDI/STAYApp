'use client'

import KeywordsCloud from "@/components/semantic_analysis/keywordsCloud"
import KeywordsNetwork from "@/components/semantic_analysis/keywordsNetwork"
import KeywordsTimeline from "@/components/semantic_analysis/keywordsTimeline"

import { useState } from "react"


export default function semantic_analysis() {
  const [cloudLoading,setCloudLoading] = useState(true)
  const [timelineLoading,setTimelineLoading] = useState(true)
  const [networkLoading,setNetworkLoading] = useState(true)
  return (
    <div className="p-2 flex flex-col h-full gap-2">

      {/*
      <KeywordsCloud loading={cloudLoading} setLoading={setCloudLoading} />
      {
        (!cloudLoading) && <KeywordsTimeline loading={timelineLoading} setLoading={setTimelineLoading}/>
      }
      {
        (!cloudLoading && !timelineLoading) && <KeywordsNetwork loading={networkLoading} setLoading={setNetworkLoading}/>
      }
      */}
      <KeywordsNetwork loading={networkLoading} setLoading={setNetworkLoading}  />
      
    </div>
  )
}

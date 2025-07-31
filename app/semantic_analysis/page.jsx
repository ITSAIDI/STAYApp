import KeywordsCloud from "@/components/semantic_analysis/keywordsCloud"
import KeywordsTimeline from "@/components/semantic_analysis/keywordsTimeline"


export default function semantic_analysis() {
  return (
    <div className="p-2 flex flex-col h-full gap-2">
      <KeywordsCloud  />
      <KeywordsTimeline  />
    </div>
  )
}

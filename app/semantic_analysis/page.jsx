import KeywordsCloud from "@/components/semantic_analysis/keywordsCloud"
import KeywordsTimeline from "@/components/semantic_analysis/keywordsTimeline"


export default function semantic_analysis() {
  return (
    <div className="bg-white m-3 rounded">
      <KeywordsCloud  />
      <KeywordsTimeline  />
    </div>
  )
}

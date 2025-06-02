import ChannelsLeaderboard from "@/components/home/channelsLeaderboard"
import VideosLeaderboard from "@/components/home/videosLeaderboard"
import HomeStatistics from "@/components/home/homeStatistics"

export default function home() {
  return (
    <div className="flex flex-col p-3">
       <HomeStatistics  />
       <div className="flex flex-row gap-3 justify-between">
          <ChannelsLeaderboard />
          <VideosLeaderboard  />
       </div>
       
    </div>

  )
}


import ChannelsLeaderboard from "@/components/home/channelsLeaderboard"
import VideosLeaderboard from "@/components/home/videosLeaderboard"
import HomeStatistics from "@/components/home/homeStatistics"

export default function home() {
  return (
    <div className="flex flex-col p-3 h-full">
       <HomeStatistics  />
       <div className="grid grid-cols-2 gap-2 w-full">
          <ChannelsLeaderboard />
          <VideosLeaderboard  />
       </div>
       
    </div>

  )
}

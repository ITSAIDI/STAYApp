import ChannelsNetwork from "@/components/networks/channelsNetwork"
import UsersNetwork from "@/components/networks/usersNetwork"




export default function networks() {
  return (
    <div className="flex flex-row gap-3 h-full w-full p-2">
       <ChannelsNetwork  />
       <UsersNetwork  />
    </div>
  )
}

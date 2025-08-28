import ChannelsNetwork from "@/components/networks/channelsNetwork"
//import UsersNetwork from "@/components/networks/usersNetwork"




export default function networks() {
  return (
    <div className="flex flex-col gap-2 h-full w-full p-2">
       <ChannelsNetwork  />
       {/*  <UsersNetwork  />  */}
    </div>
  )
}

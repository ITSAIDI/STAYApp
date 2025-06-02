import HomeMain from "@/components/home/homeMain"
import SideBar from "@/components/home/sideBar"



export default function home() {
  return (
    <div className="flex  h-full">
      <SideBar />
      <HomeMain />
    </div>

  )
}

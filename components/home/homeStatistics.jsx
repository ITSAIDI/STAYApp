import { faTv, faPlay,faComments } from "@fortawesome/free-solid-svg-icons"
import HomeBox from "./homeBox"


const boxes = [
  {
    'textColor':'text-white',
    'bgColor':'bg-green1',
    'number': 1700,
    'title':'Number of channels',
    'icon':faTv
  },
  {
    'textColor':'text-white',
    'bgColor':'bg-green2',
    'number': 42000,
    'title':'Number of videos',
    'icon':faPlay
  },
  {
    'textColor':'text-green1',
    'bgColor':'bg-green-300',
    'number': 140050,
    'title':'Number of comments',
    'icon':faComments
  },
]


export default function HomeStatistics() {
  return (
    <div className="flex flex-row gap-3 justify-between">
      {
        boxes.map((box,index) => (
          <HomeBox key={index} textColor = {box.textColor}  bgColor={box.bgColor} number = {box.number}  title = {box.title} icon = {box.icon} />
        ))
      }
    </div>
  )
}

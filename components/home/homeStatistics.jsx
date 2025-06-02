import { faTv, faPlay,faComments } from "@fortawesome/free-solid-svg-icons"
import HomeBox from "./homeBox"


const boxes = [
  {
    'textColor':'white',
    'iconColor':'green-300',
    'bgColor':'green-800',
    'number': 1700,
    'title':'Number of channels',
    'icon':faTv
  },
  {
    'textColor':'white',
    'iconColor':'green-300',
    'bgColor':'green-500',
    'number': 42000,
    'title':'Number of videos',
    'icon':faPlay
  },
  {
    'textColor':'green-800',
    'iconColor':'green-800',
    'bgColor':'green-300',
    'number': 140050,
    'title':'Number of comments',
    'icon':faComments
  },
]


export default function HomeStatistics() {
  return (
    <div className="flex flex-row justify-between">
      {
        boxes.map((box,index) => (
          <HomeBox key={index} textColor = {box.textColor} iconColor = {box.iconColor} bgColor={box.bgColor} number = {box.number}  title = {box.title} icon = {box.icon} />
        ))
      }
    </div>
  )
}

import { viga } from '@/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function HomeBox({textColor,iconColor,bgColor,number,title,icon}) {
  return (
    <div className= {`p-2 bg-${bgColor} rounded-lg`}>
      <div className={`${viga.className} text-${textColor} text-left`}>
         <h1>{title}</h1>
         <h1>{number}</h1>
      </div>
      <FontAwesomeIcon icon={icon} className={`text-${iconColor}`} />
    </div>
  )
}

import { viga } from '@/fonts';
import { faInfoCircle,faExpand,faPlusCircle,faTrash,faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function InfoBull({information}) {
  const iconMap = {
  Expand_Button: faExpand,
  Add_Button: faPlusCircle,
  Delete_Button:faTrash,
  Cancel_Button:faRotateLeft
    };

  function parseTextWithIcons(text) {
  // Split the string by spaces 
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if (iconMap[part]) {
      return (
        <FontAwesomeIcon
          key={index}
          icon={iconMap[part]}
          className="inline mx-1 text-green1"
        />
      );
    }
    return part;
  });
  }


  return (
        <div className='relative group w-[900px]'>
          <FontAwesomeIcon className='text-green1 hover:scale-110 transition-all duration-300'  icon={faInfoCircle}/>
          <p className={`absolute top-0 left-5 opacity-0 mb-2 bg-green-200 text-green1 text-[16px]  px-2 py-1 rounded group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-1000 whitespace-pre-line ${viga.className}`}>
            {parseTextWithIcons(information)}
          </p>
        </div>
  )
}

import { faTv, faPlay, faComments } from "@fortawesome/free-solid-svg-icons"
import HomeBox from "./homeBox"

export default async function HomeStatistics() {
  const res = await fetch(`${process.env.BASE_URL}/api/statistics`);

  const stats = await res.json();

  console.log('stats :',stats)

  const boxes = [
    {
      textColor: 'text-white',
      bgColor: 'bg-green1',
      number: stats.numChannels,
      title: 'Number of channels',
      icon: faTv
    },
    {
      textColor: 'text-white',
      bgColor: 'bg-green2',
      number: stats.numVideos,
      title: 'Number of videos',
      icon: faPlay
    },
    {
      textColor: 'text-green1',
      bgColor: 'bg-green-300',
      number: stats.numComments,
      title: 'Number of comments',
      icon: faComments
    }
  ];

  return (
    <div className="flex flex-row gap-3 justify-between">
      {boxes.map((box, index) => (
        <HomeBox
          key={index}
          textColor={box.textColor}
          bgColor={box.bgColor}
          number={box.number}
          title={box.title}
          icon={box.icon}
        />
      ))}
    </div>
  );
}

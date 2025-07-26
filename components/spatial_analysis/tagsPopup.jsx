'use client'

import { viga } from "@/fonts";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState,useEffect } from "react"
import { ThreeDot } from "react-loading-indicators"

export default function TagsPopup({entitiesIds,setshow}) {
  const [tagsSorted,setTagsSorted] = useState(null)
  const [tagsLoading,setTagsLoading] = useState(true)


  const ThreeDotColor = '#13452D'
  
  function getTags(results) {
        const tagCounts = {};

        // Count tags
        results.forEach(element => {
            if (Array.isArray(element.tags)) {
            element.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
            }
        });

        // Convert to array and sort by count descending
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1]) // sort by count descending
            .map(([tag, count]) => ({ tag, count }));

        return sortedTags;
    }

  async function getVideosTags() 
    {
        setTagsLoading(true)
        try 
        {
        const res = await fetch('/api/spatial_analysis/entityTags',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entitiesIds}),
        })
        const data = await res.json()

        console.log('Videos Tags  ',data)
        if(data) 
            {
                setTagsSorted(getTags(data))
                setTagsLoading(false)
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching entityTags ',error)
        }
    }

  useEffect(()=>{getVideosTags();},[entitiesIds])

  //console.log('Tags sorted  :',tagsSorted)

  return (
    <div className='absolute bottom-20 left-2  shadow-lg transform transition-transform duration-300 ease-in-out z-[1000] max-h-[200px] h-fit w-[400px] xl:w-[500px]
    rounded-sm
    bg-white
    p-2
    '>
         {tagsLoading ? (
           <div className="flex items-center justify-center h-full w-full">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):
        <div className="relative h-full">
             <button
                type="button"
                aria-label="Close tags popup"
                onClick={() => setshow(false)}
                className="absolute right-0 top-0 text-green1 hover:text-red-600 p-1 rounded transition-colors focus:outline-none focus:ring focus:ring-green1"
                >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <h1 className={`${viga.className} text-green1 mb-2`}>The 5 most frequent tags are highlighted</h1>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[150px] h-fit scrollbar scrollbar-thumb-green1 scrollbar-track-white pr-1">
                {tagsSorted !== null &&
                    tagsSorted.map((item, index) => (
                    <div
                        key={index}
                        className={`${viga.className} text-green1 rounded-full px-2 h-fit ${
                        index < 5 ? 'bg-green3' : 'bg-gray-100'
                        }`}
                    >
                        <span>{item.tag}</span>

                    </div>
                    ))}
            </div>
        </div>
        }

    </div>
  )
}

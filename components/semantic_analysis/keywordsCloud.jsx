'use client'

import { useState,useEffect,useRef,useMemo } from "react"
import { viga } from "@/fonts";
import { ThreeDot } from "react-loading-indicators"
import { Slider } from "@/components/ui/slider"
import { WordCloudComponent } from "./WordCloudComponent";
import { debounce } from "lodash";
import { faCaretRight,faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function KeywordsCloud() {
    let tagsInit = useRef(null)
    const [tagsSorted,setTagsSorted] = useState(null)
    const [tagsLoading,setTagsLoading] = useState(true)
    const [value, setValue] = useState([1])
    const debouncedSetValue = useMemo(() => debounce(setValue, 300),[]);
    const [pageNumber,setPageNumber] = useState(1)

   
    const ThreeDotColor = '#13452D'

    function getTags(results) {
        const tagCounts = {};

        // Count tags
        results.forEach(element => {
            if (Array.isArray(element.tags)) {
            element.tags.forEach(tag => {
                const cleanTag = tag.trim().toLowerCase(); // Cleaning
                tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
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
        const res = await fetch('/api/semantic_analysis/keywordsCloud')
        const data = await res.json()
        if(data) 
            {
                tagsInit.current = getTags(data)
                setValue([tagsInit.current?.[0]?.count || 1])
                setTagsLoading(false)
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching videos tags ',error)
        }
    }

    useEffect(()=>{getVideosTags();},[])
    useEffect(() => {
    if (tagsInit.current) {
            const filtered = tagsInit.current.filter(tag => tag.count <= value[0])
            setTagsSorted(filtered)
        }
        }, [value])


    //console.log('tagsInit.current  ',tagsInit.current)
    console.log('tagsSorted  ',tagsSorted)

  return (
    <div className="p-2">
         {tagsLoading ? 
         (
           <div className="flex items-center justify-center h-full w-full">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):
        <div className="bg-white rounded-sm flex flex-col p-2">
              <div className="flex flex-col gap-2 items-start w-64 mb-2">
                   <p className={`${viga.className} text-green1`}>Max Frequency: {value[0]}</p>
                    <Slider
                        value={value}
                        onValueChange={debouncedSetValue}
                        min={1}
                        max={tagsInit.current?.[0]?.count || 1}
                        step={1}
                    />
               </div>
               {/* Pagination */}
               <div className="flex flex-row gap-1 items-center">
                  <button
                    onClick={() => setPageNumber(pageNumber - 1)}
                    disabled={pageNumber === 1}
                    className={`p-2 rounded-full transition duration-200
                        ${pageNumber === 1 ? 'opacity-50' : 'hover:bg-green1/20 active:scale-90'}
                    `}
                    >
                    <FontAwesomeIcon
                        icon={faCaretLeft}
                        className={`text-[25px] transition 
                        ${pageNumber === 1 ? 'text-gray-400' : 'text-green1'}
                        `}
                    />
                  </button>

                  <p className={`${viga.className} text-green1`}>Page Number</p>
                  <p className={`text-green1 text-[20px] ${viga.className}`}>{pageNumber}</p>

                  <button
                    onClick={() => setPageNumber(pageNumber + 1)}
                    className="p-2 rounded-full transition duration-200 hover:bg-green1/20 active:scale-90"
                    >
                    <FontAwesomeIcon
                        icon={faCaretRight}
                        className="text-[25px] transition  text-green1"
                    />
                  </button>
               </div>
                {
                    tagsSorted && <WordCloudComponent words={tagsSorted.map(({ tag, count }) => ({ text: tag, value: count }))} pageNumber={pageNumber} />
                }
               
        </div>
        }

    </div>
  )
}

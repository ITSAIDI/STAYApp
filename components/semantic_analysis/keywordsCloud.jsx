'use client'

import { useState,useEffect,useRef,useMemo } from "react"
import { ThreeDot } from "react-loading-indicators"
import { WordCloudComponent } from "./WordCloudComponent";
import { debounce } from "lodash";
import { viga } from "@/fonts";


export default function KeywordsCloud() {
    let tagsInit = useRef(null)
    const [tagsSorted,setTagsSorted] = useState(null)
    const [tagsLoading,setTagsLoading] = useState(true)
    const [maxValue, setMaxValue] = useState([1])
    const [minValue, setMinValue] = useState([1])
    const debouncedSetMax = useMemo(() => debounce(setMaxValue, 300),[]);
    const debouncedSetMin = useMemo(() => debounce(setMinValue, 300),[]);
   
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
                setMaxValue([tagsInit.current?.[0]?.count || 1])
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

            const filtered = tagsInit.current.filter(tag => tag.count >= minValue[0] && tag.count <= maxValue[0])
            setTagsSorted(filtered)
        }
        }, [maxValue,minValue])


    //console.log('tagsInit.current  ',tagsInit.current)
    //console.log('tagsSorted  ',tagsSorted)

  return (
    <div className="p-2">
        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Keywords Cloud</h1>

         {tagsLoading ? 
         (
           <div className="flex items-center justify-center h-full w-full">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
        ):
        <div className="w-full h-full">
            {
                tagsSorted && <WordCloudComponent
                    tagsInit={tagsInit}
                    minValue={minValue} 
                    maxValue={maxValue} 
                    debouncedSetMax={debouncedSetMax} 
                    debouncedSetMin={debouncedSetMin} 
                    words={tagsSorted.map(({ tag, count }) => ({ text: tag, value: count }))}
                    />
            }
               
        </div>
        }

    </div>
  )
}

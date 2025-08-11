'use client'


import { viga } from "@/fonts"
import NetworkComp from "./networkComp"
import {useEffect,useState } from "react"
import { ThreeDot } from "react-loading-indicators"


export default function KeywordsNetwork({ loading, setLoading }) {

    const [tagsInit,setTagsInit] = useState(null)
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
        try 
        {
        const res = await fetch('/api/semantic_analysis/keywordsCloud')
        const data = await res.json()
        if(data) 
            {
                const response = getTags(data);
                setTagsInit(response)
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching videos tags ',error)
        }
    }
    
    useEffect(()=>{
        async function ExgetVideosTags()
         {
           await getVideosTags();
         };
         setLoading(true);
         ExgetVideosTags();
         setLoading(false);
   },[])


  return (
    <div className="w-full bg-white rounded-sm p-2">

        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Keywords Network</h1>
        {loading ? 
           <div className="flex items-center justify-center h-full w-full">
             <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
           </div>
         
         :
        <div className="w-full h-full">
            {tagsInit && <NetworkComp words={tagsInit.map(({ tag, count }) => ({ text: tag, value: count }))} /> }
        </div>
        }

    </div>
  )
}

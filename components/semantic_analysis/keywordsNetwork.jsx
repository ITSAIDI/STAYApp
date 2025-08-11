'use client'


import { viga } from "@/fonts"
import NetworkComp from "./networkComp"
import {useEffect,useRef } from "react"
import NetworkTest from "./networkTest"



export default function KeywordsNetwork({ loading, setLoading }) {
    let tagsInit = useRef(null)


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
                tagsInit.current = getTags(data)
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching videos tags ',error)
        }
    }
    

    useEffect(()=>{
        getVideosTags();
    },[])


    console.log('tagsInit.current  ',tagsInit.current)
    //console.log('links  ',links)
    //console.log('nodes  ',nodes)
    //console.log('links  ',links)


  return (
    <div className="w-full bg-white rounded-sm p-2">

        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Keywords Network</h1>

        <div className="w-full h-full">
            {
                /*
                <NetworkTest  />
        
                */
            }
            {tagsInit.current && <NetworkComp words={tagsInit.current.map(({ tag, count }) => ({ text: tag, value: count }))} /> }
        </div>
        
    </div>
  )
}

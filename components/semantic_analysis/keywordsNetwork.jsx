'use client'


import { viga } from "@/fonts"
import NetworkComp from "./networkComp"
import {useEffect,useState } from "react"
import InfoBull from '@/components/ui/infoBull';


export default function KeywordsNetwork({ loading, setLoading }) {
    
    const description = 
    `   * The Keywords Network plot represents relationships between keywords.
        * When two keywords appear in the same video tags, an edge links them.
        Add_Button inserts a selected keyword as a new node and up to 10 links with the highest co-occurrences.
        Expand_Button adds connections to an existing node based on top co-occurrences.
        Delete_Button removes a node and all its connected links from the network.
        Cancel_Button turns off Add_Button, Expand_Button, and Delete_Button and clears the search bar.
        --> Go to User_manual User manual for more details.
    `

    const [tagsInit,setTagsInit] = useState(null)
    
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
         ExgetVideosTags();
   },[])


  return (
    <div className="w-full bg-white rounded-sm p-2">

        {/* Title */}
        <div className='flex flex-row gap-1'>
            <h1 className = {`${viga.className} text-xl text-green1`}>Keywords Network</h1>
            <InfoBull information={description} />
        </div>
        <div className="w-full h-full">
            {tagsInit && <NetworkComp words={tagsInit.map(({ tag, count }) => ({ text: tag, value: count }))} loading = {loading} setLoading = {setLoading} /> }
        </div>
        
    </div>
  )
}

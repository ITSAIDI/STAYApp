'use client'


import { viga } from "@/fonts"
import NetworkComp from "./networkComp"
import { useState,useEffect,useRef } from "react"

export default function KeywordsNetwork({ loading, setLoading }) {
    let tagsInit = useRef(null)
    const [nodes, setNodes] = useState(null)
    const [links, setLinks] = useState(null)
    const networkRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })


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

    function getNodes(data)
    {
      const uniqueTags = new Set()
      data.forEach(({ source, target }) => {
        uniqueTags.add(source)
        uniqueTags.add(target)
      })

      const nodes = Array.from(uniqueTags).map(tag => ({ 'id':tag }))
      return nodes
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

    async function getInitialSamples() 
    {
        try 
        {
        const res = await fetch('/api/semantic_analysis/keywordsNetwork')
        const data = await res.json()
        if(data) 
            {
                setLinks(data);
                setNodes(getNodes(data));
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching keyword network initial samples',error)
        }
    }

    useEffect(()=>{
        setLoading(true);
        getVideosTags();
        getInitialSamples();
        setLoading(false);
    },[])

    useEffect(() => {
        if (!networkRef.current) return

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect
                setDimensions({ width, height })
            }
        })

        resizeObserver.observe(networkRef.current)

        return () => {
            if (networkRef.current) resizeObserver.unobserve(networkRef.current)
        }
    }, [])

    //console.log('tagsInit.current  ',tagsInit.current)
    console.log('links  ',links)
    console.log('nodes  ',nodes)


  return (
    <div className="w-full bg-white rounded-sm p-2">

        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Keywords Network</h1>

        <div className="flex flex-row w-full">
            <div className="w-[40%]">
              <h1>Serch bar</h1>
            </div>

            <div ref={networkRef} className="w-[60%] h-[500px]">
                {nodes &&(
                    <NetworkComp
                        nodes= {
                            nodes
                        }
                        links = {
                          links
                        }
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                )}
            </div>
        </div>
        
    </div>
  )
}

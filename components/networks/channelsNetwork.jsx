'use client'

import { viga } from "@/fonts"
import InfoBull from "../ui/infoBull"
import { useEffect, useState,useRef } from "react"
import * as d3 from "d3";

export default function ChannelsNetwork() {
  const description = `This network represents the relationships between self-sufficiency channels. 
 Each node is a channel, and each edge represents mentions in the title, description, or tags of videos from the source channel.
 Mentions can be by the name or the ID of the destination channel.
  `
  const [mentions,setMentions] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [links, setLinks] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [clickedNode, setClickedNode] = useState(null)

  const svgRef = useRef();
  const DivSVG = useRef();



  async function getNetworkData() {
  try {
    const response = await fetch('api/networks');
    const data = await response.json();

    if (data && data.length) {
      // Create nodes
      const nodesMap = new Map();
      data.forEach(item => {
        if (!nodesMap.has(item.targetchannelid)) {
          nodesMap.set(item.targetchannelid, {
            id: item.targetchannelid,
            logo: item.targetlogo
          });
        }
        if (!nodesMap.has(item.sourcechannelid)) {
          nodesMap.set(item.sourcechannelid, {
            id: item.sourcechannelid,
            logo: item.sourcelogo
          });
        }
      });
      const nodesArray = Array.from(nodesMap.values());

      // Create links
      const linksArray = data.map(item => ({
        source: item.sourcechannelid,
        target: item.targetchannelid,
        mentioncount: Number(item.mentioncount || 0)
      }));

      // Set state
      setNodes(nodesArray);
      setLinks(linksArray);

      //console.log("Nodes:", nodesArray);
      //console.log("Links:", linksArray);

    }

  } catch (error) {
    console.log('Error while fetching mentions data:', error);
  }
}

 useEffect(()=>{
    getNetworkData();
  },[])

  useEffect(() => {

    if (DivSVG.current && nodes && links)
    {
    const { width, height } = DivSVG.current.getBoundingClientRect();

    const mentionCounts = links.map(e => +e.mentioncount); 
    const minCount = d3.min(mentionCounts);
    const maxCount = d3.max(mentionCounts);

    const colorScale = d3.scaleLinear()
    .domain([minCount, maxCount])
    .range(['#d7fce5', '#fa1b02'])

    const svg = d3.select(svgRef.current)

    svg.selectAll('*').remove() // clear previous

    const container = svg.append('g')

    const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(120) 
    )
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(70)) 

    // Define Defs
    const defs = container.append("defs");

   // Create one arrow marker per link with its own color
    links.forEach((d, i) => {
      defs.append("marker")
        .attr("id", `arrowhead-${i}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15) // adjust for node radius
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", colorScale(+d.mentioncount)) // match link color

    });
     
    const link = container.append('g')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke', d => colorScale(+d.mentioncount))
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 2)
    .attr("marker-end", (d, i) => `url(#arrowhead-${i})`)
    .on('mouseover', function(event, d) {
            d3.select(this)
              .attr('stroke-width', 4)

            setHoveredLink(d)  
            setMousePos({ x: event.clientX, y: event.clientY })  
          })
    .on('mouseout', function(event, d) {
            d3.select(this)
              .attr('stroke-width', 2)     
              setHoveredLink(null)   
              setMousePos({ x: 0, y: 0 })      
          })

    // Creating patterns to hold Logo image of each node
    nodes.forEach(d => {
        defs.append("pattern")
          .attr("id", `logo-${d.id}`) // use node's id
          .attr("patternUnits", "objectBoundingBox")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("width", 1)
          .attr("height", 1)
          .append("image")
            .attr("href", d.logo) // URL to image
            .attr("width", 1)    // adjust based on radius
            .attr("height", 1)
            .attr("x", 0)
            .attr("y", 0)
            .attr("preserveAspectRatio", "xMidYMid slice");
      });

    const node = container.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 30)
      .attr('fill', d => `url(#logo-${d.id})`)
      .on('click', (event, d) => {
          setClickedNode(d);
        })
       .call(d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
            simulation.force('charge', d3.forceManyBody().strength(0))
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }))

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    })

    svg.call(
    d3.zoom()
      .scaleExtent([0.1, 4]) // min & max zoom
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      }))


    }

  }, [nodes,links]);

  return (
    <div ref={DivSVG} className="bg-white min-h-[500px] w-full p-2 rounded-sm">
       {/* Header */}
       <div className="flex flex-row gap-1">
          <h1 className = {`${viga.className} text-xl text-green1`}>Channels Network</h1>
          <InfoBull  information={description}/>
       </div>

       {/* Network */}
      <svg ref={svgRef} className='w-full h-full'/>

      {/* Hover function */}
      {hoveredLink && (
        <div
          className= {`${viga.className} fixed bg-green3 text-green1 text-[16px] px-3 py-1.5 rounded-md pointer-events-none z-[1000]`}
          style={{ top: mousePos.y + 10, left: mousePos.x + 10 }}
        >
          <p>{`Number of mentions: ${hoveredLink.mentioncount}`}</p>
        </div>
      )} 
    </div>
  )
}

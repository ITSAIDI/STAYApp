'use client'

import * as d3 from 'd3'
import { useEffect, useRef,useState } from 'react'


const data = {
  name: 'RootNode',
  children: Array.from({ length: 20 }, (_, i) => ({
    name: `Child${i + 1}`,
    children: []
  }))
};



export default function NetworkTest() {
    const svgRef = useRef()
    const DivSVG = useRef()

    useEffect(() => {
    const width = 928;
    const height = 600;

    const root = d3.hierarchy(data);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.data.name).distance(50).strength(1))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove(); // Clear previous content

    // Links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");

    // Nodes
    const node = svg.append("g")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("fill", d => d.children ? "#fff" : "#000")
      .attr("r", 5)
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    node.append("title")
      .text(d => d.data.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
      <div ref={DivSVG} className="h-[600px] border-1 border-gray-300 rounded-sm shadow-sm">
         <svg ref={svgRef} className='w-full h-full'/>
      </div>
  )
}

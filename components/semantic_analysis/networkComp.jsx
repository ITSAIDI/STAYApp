'use client'

import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

export default function D3ForceGraph({ nodes, links, width, height }) {
  const svgRef = useRef()

  const weights = links.map(e => +e.weight); 
  const minWeight = d3.min(weights);
  const maxWeight = d3.max(weights);

  const colorScale = d3.scaleLinear()
  .domain([minWeight, maxWeight])
  .range(['green', 'red'])
  .interpolate(d3.interpolateRgb);


  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // clear previous

    const container = svg.append('g')

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(width / 2, height / 2))

    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => colorScale(+d.weight))
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 2)

    const node = container.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 6)
      .attr('fill', '#13452D')
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

    const text = container.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.id)
      .attr('font-size', 10)
      .attr('fill', '#13452D')
      .style('font-family', 'Viga, sans-serif')


    // This block updates the position of the links whene nodes mouved.
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      text
        .attr('x', d => d.x + 8)
        .attr('y', d => d.y + 4)
    })

    svg.call(
    d3.zoom()
      .scaleExtent([0.1, 4]) // min & max zoom
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })
  )
  }, [nodes, links, width, height])

  return (
    <svg ref={svgRef} width={width} height={height} className="border-1 border-gray-300 rounded-sm shadow-sm" />
  )
}

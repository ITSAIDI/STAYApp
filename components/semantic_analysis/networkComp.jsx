'use client'

import { viga } from '@/fonts'
import * as d3 from 'd3'
import { useEffect, useRef,useState } from 'react'
import { faCirclePlus, faTrash,faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function NetworkComp({words}) {

  const svgRef = useRef()
  const DivSVG = useRef()
  const debounceTimeout = useRef(null);

  const [nodes, setNodes] = useState(null)
  const [links, setLinks] = useState(null)

  const [hoveredLink, setHoveredLink] = useState(null)
  const [clickedNode, setClickedNode] = useState(null)

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);

  const [selected, setSelected] = useState();
  const [removeDisabled,setRemoveDisabled] = useState(true)
  const [addDisabled,setAddDisabled] = useState(true)
  const [cancelDisabled,setCancelDisabled] = useState(true)

  //const [firstRun, setFirstRun] = useState(true);



  useEffect(()=>{
        async function ExgetInitialSamples()
         {
           await getInitialSamples();
         };
         ExgetInitialSamples();
   },[])

  useEffect(() => {

    if (DivSVG.current && links && nodes)
    {
    const weights = links.map(e => +e.weight); 
    const minWeight = d3.min(weights);
    const maxWeight = d3.max(weights);

    const colorScale = d3.scaleLinear()
    .domain([minWeight, maxWeight])
    .range(['#d7fce5', '#fa1b02'])

    const { width, height } = DivSVG.current.getBoundingClientRect();

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // clear previous

    const container = svg.append('g')

    const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(120) // plus de distance entre les niveaux
    )
    .force('charge', d3.forceManyBody().strength(-300)) // répulsion plus forte
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(70)) // évite chevauchement



    
    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => colorScale(+d.weight))
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('stroke', '#7af0a8')   
            .attr('stroke-width', 4)
          setHoveredLink(d)  
          setMousePos({ x: event.clientX, y: event.clientY })  
        })
      .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('stroke', d => colorScale(+d.weight))  
            .attr('stroke-width', 2)     
            setHoveredLink(null)   
            setMousePos({ x: 0, y: 0 })      
        })

    const node = container.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 8)
      .attr('fill', '#13452D')
      .on('click', (event, d) => {
          setClickedNode(d);
          setSelected(d.id);
          setRemoveDisabled(false);
          setCancelDisabled(false);
          setAddDisabled(false);
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

    const text = container.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.id)
      .attr('font-size', 14)
      .attr('fill', '#13452D')
      .style('font-family', 'Viga, sans-serif')
      


    // This block updates the position of the links when nodes mouved.
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
        .attr('x', d => d.x + 5)
        .attr('y', d => d.y -15)
    })

    svg.call(
    d3.zoom()
      .scaleExtent([0.1, 4]) // min & max zoom
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })
  )
  }
  }, [nodes, links])


  async function getInitialSamples() 
  {
        try 
        {
        const res = await fetch('/api/semantic_analysis/keywordsNetwork')
        const data = await res.json()
        if(data) 
            {
                //console.log('data  :',data)
                setLinks(data.links);
                setNodes(data.nodes);
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching keyword network initial samples',error)
        }
  }
  
  async function getKeywordLinks() {
    try {
      const response = await fetch('/api/semantic_analysis/keywordsNetwork/keyword',
        {
          method:'POST',
          headers :{ 'Content-Type': 'application/json' },
          body: JSON.stringify({keyword:selected})
        }
      )
      const data = await response.json();

      return data;
      //console.log('data keyword links : ',data);

    } catch (error) {
      console.log('Failing at keyword-Links fearching ',error)
      return [];
    }
    
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
  
  function getRandomWords(list, count) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function handleRemove() {
  if (removeDisabled === false && clickedNode) {
    // Disable Forces
    //setFirstRun(false);

     resetUI()
  
    const filteredNodes = nodes.filter(n => n.id !== clickedNode.id);
    const filteredLinks = links.filter(
      l => l.source.id !== clickedNode.id && l.target.id !== clickedNode.id
    );

    // Step 4: Update state
    setNodes(filteredNodes);
    setLinks(filteredLinks);
  }
}

  function resetUI()
  {
    setRemoveDisabled(true);
    setAddDisabled(true);
    setCancelDisabled(true);
    setSelected(null);
    setClickedNode(null);
    setQuery('');
  }

  async function handleAdd()
  {
    if(addDisabled==false && selected)
    {

      resetUI()

      const keywordLinks = await getKeywordLinks()
      const keywordNodes = getNodes(keywordLinks); // The New Nodes that commes with the added keyword

      // Update the list of Nodes 
      setNodes(prev => {
                const updated = [...(prev || [])];
                keywordNodes.forEach(newNode => {
                  if (!updated.some(node => node.id === newNode.id)) {
                    updated.push(newNode);
                  }
                });
                return updated;
              });
      // Update the list of links
      setLinks([...links,...keywordLinks]);

     

      //console.log('keywordLinks  :',keywordLinks)
      //console.log('keywordNodes  :',keywordNodes)

   
  
    };
    
  }

  const handleChange = (e) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      debounceTimeout.current = setTimeout(() => {
        if (value.trim() === '') {
          if (inputFocused) {
            setSuggestions(getRandomWords(words, 10));
          } else {
            setSuggestions([]);
          }
        } else {
          const filtered = words
            .filter(({ text }) => text.toLowerCase().startsWith(value.toLowerCase()))
            .sort((a, b) => b.value - a.value);
          setSuggestions(filtered);
        }
      }, 1000);
  };

  const handleFocus = () => {
    setInputFocused(true);
    if (query.trim() === '') {
      setSuggestions(getRandomWords(words, 10));
    }
  };

  const handleBlur = () => {
    // Delay to allow click selection before hiding suggestions
    setTimeout(() => {
      setInputFocused(false);
      setSuggestions([]);
    }, 400);
  };

  const handleSelect = (word) => {
      setQuery(word.text);
      setSelected(word.text);
      setSuggestions([]);
      setAddDisabled(false);
      setCancelDisabled(false);
    };

  //console.log('hoveredLink : ',hoveredLink)
  //console.log('clickedNode : ',clickedNode)
  //console.log('selected : ',selected)
  //console.log('query : ',query)
  console.log('nodes : ',nodes)
  console.log('links : ',links)

  return (
    <div className='flex flex-col gap-2'>
  
      {/* Interactivity elements */}

      <div className="flex flex-col gap-1 items-start">

        {/* Search bar */}
        <div className={`${viga.className} relative w-full  text-green1`}>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full p-2 border-2 border-gray-300 rounded-full"
            placeholder="Search a keyword..."
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border-2 border-gray-300 rounded-sm mt-1 max-h-60 overflow-auto">
              {suggestions.map(({ text, value }, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect({ text, value })}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                >
                  <span>{text}</span>
                  <span className="text-gray-400 text-sm">({value})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add, Remove, Cancel buttons */}
        <div className="flex flex-row gap-2 items-center mt-2">

          <button
          onClick={()=>{handleRemove();}}
          disabled = {removeDisabled}
          >
            <FontAwesomeIcon 
            className={`text-[20px] transition-all duration-300 ${
              removeDisabled
                ? 'text-gray-300' 
                : 'text-red-400 hover:text-red-500 active:scale-85'
            }`}
            icon={faTrash}/>
          </button>

          <button
          onClick={()=>{resetUI();}}
          disabled= {cancelDisabled}
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              className={`text-[20px] transition-all duration-300 ${
                cancelDisabled
                  ? 'text-gray-300'
                  : 'text-gray-400 hover:text-gray-500 active:scale-85'
              }`}
            />
          </button>

          <button
          onClick={()=>{handleAdd();}}
          disabled= {addDisabled}
          >
            
              <FontAwesomeIcon
                icon={faCirclePlus}
                className={`text-[20px] transition-all duration-300 ${
                  addDisabled
                    ? 'text-gray-300'
                    : 'text-green-400 hover:text-green-500 active:scale-85'
                }`}
              />
          </button>

          <h1 className={`${viga.className} text-green1`}>{selected}</h1>
        </div>
         
      </div>

      {/* Network SVG */}

      <div ref={DivSVG} className="h-[800px] border-1 border-gray-300 rounded-sm shadow-sm">
         <svg ref={svgRef} className='w-full h-full'/>
      </div>

      {/* Hover function */}
      {hoveredLink && (
        <div
          className= {`${viga.className} fixed bg-green3 text-green1 text-[16px] px-3 py-1.5 rounded-md pointer-events-none z-[1000]`}
          style={{ top: mousePos.y + 10, left: mousePos.x + 10 }}
        >
          <p>{`Number of Co-occurrences: ${hoveredLink.weight}`}</p>
        </div>
      )}
    </div>
    
 
  )
}

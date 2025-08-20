'use client'

import { viga,poppins } from "@/fonts"
import InfoBull from "../ui/infoBull"
import { useEffect, useState,useRef } from "react"
import Image from 'next/image'
import * as d3 from "d3";
import { transformDateAddOneDay } from "@/utils/utils1"
import { faCirclePlus, faTrash,faRotateLeft,faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faYoutube } from '@fortawesome/free-brands-svg-icons'

export default function ChannelsNetwork() {
  const description = 
  `* This network represents the relationships between channels. 
  * A node is a channel, an edge is mentions from source to target channel ( in the title, description, or tags of videos from the source channel).
  Expand_Button featch the most 5 mentioned channels by the clicked channel (Source).
  Add_Button featch 10 edges in witch added channel is a Source or Target.
  Cancel_Button undo an action
  Delete_Button delete a clicked channel
  `
  const [nodes, setNodes] = useState(null);
  const [links, setLinks] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Search bar States 
  const debounceTimeout = useRef(null);
  const [channelsList,setChannelsList] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState();
  const [inputFocused, setInputFocused] = useState(false);
  
  // Buttons bar States 
  const [removeDisabled,setRemoveDisabled] = useState(true)
  const [addDisabled,setAddDisabled] = useState(true)
  const [expandDisabled,setExpandDisabled] = useState(true)
  const [cancelDisabled,setCancelDisabled] = useState(true)


  // Search handling Functions

  function getRandomWords(list, count) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
    if (value.trim() === '') {
      if (inputFocused) {
        setSuggestions(getRandomWords(channelsList, 10));
      } 
      else {
        setSuggestions([]);
      }
    } 

    else {
          const filtered = channelsList.filter(({ channelname }) => channelname.startsWith(value.toLowerCase()))
          setSuggestions(filtered);
        }
    }, 1000);
  };

  const handleFocus = () => {
    setInputFocused(true);
    if (query.trim() === '' && channelsList) {
      setSuggestions(getRandomWords(channelsList, 10));
    }
  };

  const handleBlur = () => {
    // Delay to allow click selection before hiding suggestions
    setTimeout(() => {
      setInputFocused(false);
      setSuggestions([]);
    }, 400);
  };

  const handleSelect = (channel) => {
      setQuery(channel.channelname);
      setSelected(channel);
      setSuggestions([]);
      setAddDisabled(false);
      setCancelDisabled(false);
    };

  // Buttons handling functions

  function resetUI()
  {
    setRemoveDisabled(true);
    setAddDisabled(true);
    setCancelDisabled(true);
    setExpandDisabled(true);
    setSelected(null);
    setQuery('');
  }

  function handleAdd()
  {
    if(!addDisabled  && selected)
    {
      getAddChannel();
      resetUI();
    }
  }

  function handleRemove()
  {
    if(selected && !removeDisabled)
    {

      const filteredNodes = nodes.filter(node => node.id !== selected.id_chaine);
      const filteredLinks = links.filter(link => link.source.id !== selected.id_chaine && link.target.id !== selected.id_chaine );

      setNodes(filteredNodes);
      setLinks(filteredLinks);

      resetUI()
      
    }
    
  }


  async function handleExpand()
  {
    if(!expandDisabled  && selected)
    {
      const expandData = await getExpandChannel();

      const newNodes = [];
      const seen = new Set();
      
      expandData.forEach(d => {
          // Add source node
          if (!seen.has(d.sourcechannelid)) {
            newNodes.push({ id: d.sourcechannelid, logo: d.sourcelogo });
            seen.add(d.sourcechannelid);
          }
          // Add target node
          if (!seen.has(d.targetchannelid)) {
            newNodes.push({ id: d.targetchannelid, logo: d.targetlogo });
            seen.add(d.targetchannelid);
          }
        });

      const newLinks = expandData.map(d => ({
          source: { id: d.sourcechannelid },
          target: { id: d.targetchannelid },
          mentioncount: Number(d.mentioncount)
       }));

       setNodes(prevNodes => {
      const existingIds = new Set(prevNodes.map(n => n.id));
      return [
        ...prevNodes,
        ...newNodes.filter(n => !existingIds.has(n.id))
        ];
      });

       setLinks(prevLinks => {
      const existingLinks = new Set(prevLinks.map(l => `${l.source.id}-${l.target.id}`));
      return [
        ...prevLinks,
        ...newLinks.filter(l => !existingLinks.has(`${l.source.id}-${l.target.id}`))
      ];
    });
      
      //console.log('newNodes  :',newNodes);
      //console.log('newLinks  :',newLinks);
    }

   resetUI();
  }

  // Refs for the Network SVG  
  
  const svgRef = useRef();
  const DivSVG = useRef();


  // Backend Featching functions

  async function getChannelsList() {
    try {
      const response = await fetch('api/networks/channelsList');
      const data = await response.json();

      setChannelsList(data.channelsList);

      //console.log('response : ',channelsList.channelsList)
      
    } catch (error) {
      console.log('Error :',error)
    }
    
  }

  async function getNetworkData() {
  try {
    const response = await fetch('api/networks');
    const data = await response.json();

    if (data) {

      // Set state
      setNodes(data.nodes);
      setLinks(data.links);

      //console.log("Nodes:", data.nodes);
      //console.log("Links:", data.links);

    }

  } catch (error) {
    console.log('Error while fetching mentions data:', error);
  }
}
  async function getExpandChannel() {
    // Featch the 5 most mentionned channels by the expanded channel
    try {
      const response = await fetch('api/networks/expand', 
        {
          method:'POST',
          headers :{ 'Content-Type': 'application/json' },
          body: JSON.stringify({channelID:selected.id_chaine})
        });
      const data = await response.json();

      console.log('Expand  :',data);
      
      return data;
      
    } catch (error) {
      console.log('Error while fetching channel childs:', error);
    }
  }

  async function getAddChannel() {
    // Featch the 10 most height number of mentions links where channel is Source/Destination
    try {
      const response = await fetch('api/networks/add', 
        {
          method:'POST',
          headers :{ 'Content-Type': 'application/json' },
          body: JSON.stringify({channelID:selected.id_chaine})
        });
      const data = await response.json();

      console.log('Add  :',data);
      
    } catch (error) {
      console.log('Error while fetching channel strong relations: ', error);
    }
  }

 useEffect(()=>{
    getNetworkData();
    getChannelsList();
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

    svg.attr("width", width).attr("height", height);

    svg.selectAll('*').remove() // clear previous

    const container = svg.append('g')

    const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(100) 
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
        .attr("refX", 33) // adjust for node radius
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

        setSelected(channelsList?.find(c => c.id_chaine === d.id));
        setExpandDisabled(false);
        setCancelDisabled(false);
        setRemoveDisabled(false);

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

  }, [nodes,links,channelsList]);

  useEffect(()=>
  {
    // To adjust the vx vy NaN issue We need to map source and target to existing nodes in the State.

    if(nodes)
    {
      const nodeById = new Map(nodes.map(n => [n.id, n]));
      const fixedLinks = links.map(l => ({
        ...l,
        source: nodeById.get(l.source.id ), // si l.source est un objet → .id, sinon c’est déjà un id
        target: nodeById.get(l.target.id )
      }));

      setLinks(fixedLinks);
    }

  },[nodes])

  
  console.log('Selected Channel :',selected);
  console.log('Nodes :',nodes);
  console.log('Links :',links);

  return (
    <div className="bg-white h-[1100px] w-full p-2 rounded-sm">
       {/* Header */}
       <div className="flex flex-row gap-1">
          <h1 className = {`${viga.className} text-xl text-green1`}>Channels Network</h1>
          <InfoBull  information={description}/>
       </div>

       {/* Interactivity elements */}
       <div className="flex flex-row w-full gap-20 items-start mt-2">

          {/* Search bar, Remove, Add, Cancel, Expand */}
          <div className="flex flex-col gap-2 w-[50%]">

            {/* Search bar */}
            <div className={`${viga.className} relative text-green1`}>
              <input
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border-2 border-gray-300 rounded-full"
              placeholder="Search a channel..."
              autoComplete="off"
            />
            {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border-2 border-gray-300 rounded-sm mt-1 max-h-60 overflow-auto">
              {suggestions.map((channel, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(channel)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span>{channel.channelname}</span>
                </li>
              ))}
            </ul>
          )}

            </div>
            
            {/* Buttons */}
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

                <button
                onClick={()=>{handleExpand();}}
                disabled= {expandDisabled}
                >
                  <FontAwesomeIcon
                    icon={faExpand}
                    className={`text-[20px] transition-all duration-300 ${
                      expandDisabled
                        ? 'text-gray-300'
                        : 'text-yellow-400 hover:text-yellow-500 active:scale-85'
                    }`}
                  />
                </button>
            </div>

          </div>

          {/* Channel preview*/}
          <div className="w-[50%]">
            {
              selected && 
              <div className="flex flex-row gap-5 items-start">

                  <div className="relative w-[80px] h-[80px]">
                    <Image
                      src={selected.logo}
                      alt="channel logo"
                      className="rounded-full object-cover"
                      fill
                      sizes="80px"
                      quality={100}
                    />
                  </div>

                  <div className={`flex flex-col gap-1 ${poppins.className}`}>
                      <h1 className={`${viga.className} text-gray-500`}>Name of channel</h1>
                      <p className='max-w-[270px] overflow-x-auto whitespace-nowrap text-left'>{selected.channelname}</p>
                  </div>

                  <div className={`flex flex-col gap-1 ${poppins.className}`}>
                      <h1 className={`${viga.className} text-gray-500`}>Created at (dd/mm/yyyy)</h1>
                      <p>{transformDateAddOneDay(selected.date_creation)}</p>
                  </div>

                  <a
                    href={`https://www.youtube.com/channel/${selected.id_chaine}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <FontAwesomeIcon
                        icon={faYoutube}
                        className="text-green1 text-[20px] xl:text-[26px] hover:text-red-500 transition-colors duration-300"
                    />
                  </a>
                  

              </div>
            }

          </div>

       </div>

       {/* Network */}
       <div ref={DivSVG} className="w-full h-full" >
         <svg ref={svgRef}/>
       </div>
      

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

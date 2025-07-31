'use client'

import { viga } from "@/fonts"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect,useState,useRef } from "react"


import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle, CardDescription
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export default function KeywordsTimeline() {

    let tagsInit = useRef(null)
    const [selectedTags,setSelectedTags] = useState(['autosuffisance'])
    const [displayedData,setDisplayedData] = useState([])

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [inputFocused, setInputFocused] = useState(false);
    const debounceTimeout = useRef(null);


    const [chartConfig,setChartConfig] = useState({})


    const handleChange = (e) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      debounceTimeout.current = setTimeout(() => {
        if (value.trim() === '') 
          {
            if (inputFocused) 
            {
              setSuggestions(getRandomWords(tagsInit.current, 10));
            } 
            else 
            {
              setSuggestions([]);
            }
          } 

        else 
        {
          const filtered = tagsInit.current
            .filter(({ text }) => text.toLowerCase().startsWith(value.toLowerCase()))
            .sort((a, b) => b.value - a.value);
          setSuggestions(filtered);
        }
      }, 1000);
    };

    const handleFocus = () => {
      setInputFocused(true);
      if (query.trim() === '') {
        setSuggestions(getRandomWords(tagsInit.current, 10));
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
    setSelectedTags((prev) => {
        if (prev.includes(word.text)) return prev;
        return [...prev, word.text];
    });
    };

    // Same Color for a tag (persistent)
    function hashStringToColor(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, '0')}${
        ((hash >> 16) & 0xff).toString(16).padStart(2, '0')
      }${((hash >> 8) & 0xff).toString(16).padStart(2, '0')}`;
      return color;
    }

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
    function getRandomWords(list, count) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
    }
    function removeTag(tag)
    {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }

    async function getVideosTags() 
    {
        try 
        {
        const res = await fetch('/api/semantic_analysis/keywordsCloud')
        const data = await res.json()
        if(data) 
            {
                tagsInit.current = getTags(data).map(({ tag, count }) => ({ text: tag, value: count }))
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching videos tags ',error)
        }
    }

    async function getKeywordTimeline(selectedTag) {
      if(selectedTag)
      {
        try 
        {
          const response = await fetch('/api/semantic_analysis/keywordData',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body : JSON.stringify({keyword : selectedTag})

            }
          );
          const data = await response.json();
          
          return data;
          
        } 
        catch (error) 
        {
          console.log('Failing while fetching keyword time data ',error)
          
        }
      }
    return null;
    }
    
    useEffect(()=>{getVideosTags();},[])
    
    useEffect(() => {
      if (selectedTags.length === 0) {
        setChartConfig({});
        return;
      }

      const config = {};
      selectedTags.forEach((tag) => {
        config[tag] = {
          label: "Nomber of mentions of: "+tag,
          color: hashStringToColor(tag),
        };
      });
      setChartConfig(config);
    }, [selectedTags]);
    
    useEffect(() => {
      async function fetchAllKeywordTimelines() {
        const allData = {}; // { "2010": { annee: "2010", autosuffisance: 1, ... }, ... }
        const allYears = new Set();

        for (const tag of selectedTags) {
          const tagData = await getKeywordTimeline(tag);

          if (!tagData) continue;

          tagData.forEach(entry => {
            const year = entry.annee;
            const count = parseInt(entry.nombre_mentions);
            allYears.add(year);

            if (!allData[year]) {
              allData[year] = { annee: year };
            }

            allData[year][tag] = count;
          });
        }

        // Ajouter les années manquantes pour chaque tag avec valeur 0
        const mergedData = Array.from(allYears)
          .sort()
          .map(year => {
            const row = { annee: year };
            selectedTags.forEach(tag => {
              row[tag] = allData[year]?.[tag] ?? 0;
            });
            return row;
          });

        setDisplayedData(mergedData);
      }

      if (selectedTags.length > 0) {
        fetchAllKeywordTimelines();
      }
    }, [selectedTags]);

    console.log('chartConfig :',chartConfig)
    console.log('displayedData:', displayedData);

    
  return (
    <div className="flex flex-col bg-white rounded-sm p-2 gap-2 w-full h-full">
      
        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Keywords Timelines</h1>

       <div className="flex flex-row gap-1 w-full items-center h-full">

        {/* Select tags and Search */}
        <div className="flex flex-col gap-1 w-[70%] h-full">

          {/* Selected tags */}
          <div className="flex flex-wrap rounded-sm border-2 border-gray-300 w-full">
            {
              selectedTags && (
                selectedTags.map((tag,index)=>
                <div         
                  key={index}
                  className= {`text-green1 bg-green3 px-2 py-1 rounded-full ${viga.className} m-1 flex flex-row gap-1 items-center`}>
                  <h1>{tag}</h1>
                  <button
                    onClick={()=>{removeTag(tag);}}>
                    <FontAwesomeIcon 
                      icon={faCircleXmark} 
                      className="transition-all duration-300 opacity-70 hover:opacity-100 active:scale-85" />
                  </button>
                </div>
       
                )
              )
            }
          </div>

          {/* Search bar */}
          <div className={`${viga.className} relative text-green1 w-full h-full`}>
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

        </div>

        {/* Timelines */}
        <Card className='w-full h-full' >
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
               data={displayedData}
               margin={{
                  top: 40,
                  left: 12,
                  right: 12,
                }}
                > 
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="annee"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className={`${viga.className} text-[14px]`}
                />
                <ChartTooltip
                  className = {`${viga.className} text-[14px]`}
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                /> 
                {
                  selectedTags.map((tag,index)=>{
                    const config = chartConfig[tag];
                    if (!config) return null;
                    return (
                    <Line
                    key={index}
                    dataKey={tag}
                    type="natural"
                    stroke={chartConfig[tag].color}
                    strokeWidth={2}
                    dot={{fill: chartConfig[tag].color}}
                    activeDot={{r: 6}}
                    >

                    </Line>)
                   }
                  )
                }

                </LineChart>

              </ChartContainer>

            </CardContent>


        </Card>

      </div>

    </div>
  )
}

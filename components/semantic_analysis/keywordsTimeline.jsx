'use client'

import { viga } from "@/fonts"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect,useState,useRef } from "react"


export default function KeywordsTimeline() {

    let tagsInit = useRef(null)
    const [selectedTags,setSelectedTags] = useState([])
    const [displayedData,setDisplayedData] = useState(null)
    const [tagsLoading,setTagsLoading] = useState(true)

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [inputFocused, setInputFocused] = useState(false);
    const debounceTimeout = useRef(null);


    const ThreeDotColor = '#13452D'

    

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
        setTagsLoading(true)
        try 
        {
        const res = await fetch('/api/semantic_analysis/keywordsCloud')
        const data = await res.json()
        if(data) 
            {
                tagsInit.current = getTags(data).map(({ tag, count }) => ({ text: tag, value: count }))
                setTagsLoading(false)
            }
        
        } 
        catch (error) 
        {
        console.log('Failing while fetching videos tags ',error)
        }
    }
    
    useEffect(()=>{getVideosTags();},[])

  return (
    <div className="flex flex-col">
        {/* Title */}
        <h1 className = {`${viga.className} text-xl text-green1`}>Keywords Timelines</h1>

        <div className="flex flex-row gap-1">

          {/* Search bar */}
          <div className={`${viga.className} relative text-green1 w-[40%]`}>
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

        </div>


    </div>
  )
}

import { viga } from "@/fonts";
import { faCirclePlus, faTrash,faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useCallback, useMemo, useState,useEffect ,useRef} from "react";
import WordCloud from "react-d3-cloud";
import { Slider } from "@/components/ui/slider"

const MAX_FONT_SIZE = 100;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
//const MAX_WORDS = 20;

export function WordCloudComponent({ words,tagsInit,maxValue,debouncedSetMax,minValue,debouncedSetMin })
{

    const categorizedWords = useMemo(() => {
        const total = words.length;
        if (total < 4) return { mostFrequent: words, mediumFrequent: [], lessFrequent: [] };

        const q1Index = Math.floor(total * 0.001);
        const q3Index = Math.floor(total * 0.75);

        const mostFrequent = words.slice(0, q1Index);
        const mediumFrequent = words.slice(q1Index, q3Index);
        const lessFrequent = words.slice(q3Index);

        //console.log('mostFrequent',mostFrequent)
        //console.log('mediumFrequent',mediumFrequent)
        //console.log('lessFrequent',lessFrequent)


        return { mostFrequent, mediumFrequent, lessFrequent };
        }, [words]);
    
    const getRandomSample = (arr, n) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(n, arr.length));
        };

    const [sortedWords, setSortedWords] = useState([]);
    const [hoveredTag, setHoveredTag] = useState(null)
    const [minOccurences, setMinOccurences] = useState(1);
    const [maxOccurences, setMaxOccurences] = useState(1);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [inputFocused, setInputFocused] = useState(false);
    const debounceTimeout = useRef(null);

    const [selected, setSelected] = useState();
    const [removeDisabled,setRemoveDisabled] = useState(true)
    const [addDisabled,setAddDisabled] = useState(true)
    const [cancelDisabled,setCancelDisabled] = useState(true)
    
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
      }, 100);
    };

    const handleSelect = (word) => {
      setQuery(word.text);
      setSelected(word);
      setSuggestions([]);
      setAddDisabled(false);
      setCancelDisabled(false);
    };


    useEffect(() => {
      const { mostFrequent, mediumFrequent, lessFrequent } = categorizedWords;

      const topSample = getRandomSample(mostFrequent, 7);
      const middleSample = getRandomSample(mediumFrequent, 7);
      const bottomSample = getRandomSample(lessFrequent, 7);

      setSortedWords([...topSample, ...middleSample, ...bottomSample]);
    }, [categorizedWords]);


    useEffect(() => {
      if (sortedWords.length > 0) {
        const values = sortedWords.map((w) => w.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        setMinOccurences(min);
        setMaxOccurences(max);
        
      }
    }, [sortedWords]);

    function handleRemove()
    {
      if(removeDisabled==false)
      {
        setRemoveDisabled(true);
        setCancelDisabled(true);
        setSelected(null);

        setSortedWords(prevWords =>
        prevWords.filter(w => w.text.toLowerCase() !== selected.text.toLowerCase())
        );

      }
    }
    function handleCancel()
    {
      setRemoveDisabled(true);
      setAddDisabled(true);
      setCancelDisabled(true);
      setSelected(null);
      setQuery('');
    }
    function handleAdd()
    {
      if(addDisabled==false)
      {
        setAddDisabled(true);
        setCancelDisabled(true);
        setSelected(null);
        setQuery('');
        // Logic of Adding

        setSortedWords(prevWords => {
        const exists = prevWords.some(w => w.text.toLowerCase() === selected.text.toLowerCase());
        if (!exists) {
          return [...prevWords, selected];
        }
        return prevWords;
      });
      
      }
    }

    const calculateFontSize = useCallback(
        (wordOccurrences) => {
            if (minOccurences === maxOccurences) return MIN_FONT_SIZE;
            const normalizedValue =
            (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
            const fontSize =
            MIN_FONT_SIZE + normalizedValue * (MAX_FONT_SIZE - MIN_FONT_SIZE);
            return Math.round(fontSize);
        },
        [maxOccurences, minOccurences]
        );

    const calculateFontWeight = useCallback(
        (wordOccurrences) => {
            if (minOccurences === maxOccurences) return MIN_FONT_WEIGHT;
            const normalizedValue =
            (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
            const fontWeight =
            MIN_FONT_WEIGHT +
            normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
            return Math.round(fontWeight);
        },
        [maxOccurences, minOccurences]
        );

    //console.log('hoveredTag  :',hoveredTag)
   //console.log('sortedWords   :',sortedWords)
   
  return (
  <div className="relative mt-2 flex flex-row w-full items-center">

    <div className="flex flex-col gap-1 w-[40%] items-start mr-2">

      {/* Sliders */}
      <div className="flex flex-col gap-2 items-start w-full mb-2">
          <p className={`${viga.className} text-green1`}>Max Frequency: {maxValue[0]}</p>
          <Slider
              value={maxValue}
              onValueChange={debouncedSetMax}
              min={1}
              max={tagsInit.current?.[0]?.count || 1}
              step={1}
          />
      </div>

      <div className="flex flex-col gap-2 items-start w-full mb-2">
          <p className={`${viga.className} text-green1`}>Min Frequency: {minValue[0]}</p>
          <Slider
              value={minValue}
              onValueChange={debouncedSetMin}
              min={1}
              max={tagsInit.current?.[0]?.count || 1}
              step={1}
          />
      </div>

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
        onClick={()=>{handleCancel();}}
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

        <h1 className={`${viga.className} text-green1`}>{selected?.text}</h1>
      </div>

    </div>

    {/* Cloud */}
    <div className="min-w-[600px] min-h-[200px] h-fit w-[60%]">
      <WordCloud
        width={900}
        height={500}
        font="Poppins"
        fontWeight={(word) => calculateFontWeight(word.value)}
        data={sortedWords}
        rotate={0}
        padding={1}
        fontSize={(word) => calculateFontSize(word.value)}
        random={() => 0.5}
        onWordMouseOver={(event, d) => {
          setHoveredTag({
            x: event.clientX,
            y: event.clientY,
            count: d.value,
            tag:d.text,
          });
        }}
        onWordMouseOut={() => {
          setHoveredTag(null);
        }}
        onWordClick={(event, d) => {
          setRemoveDisabled(false);
          setCancelDisabled(false)
          setSelected(d);
      }}
      />
    </div>

    {/* Hover function */}
    {hoveredTag && (
      <div
        className={`flex flex-col absolute bg-green3 text-green1 px-2 py-1 rounded shadow ${viga.className} whitespace-nowrap`}
        style={{
          top: hoveredTag.y - 50, // shift up to align better with word
          left: hoveredTag.x-500,
          pointerEvents: "none", // avoid interfering with mouse events
          zIndex: 50,
        }}
      >
        <p>{hoveredTag.tag}</p>
        <p>{`Frequency: ${hoveredTag.count}`}</p>
      </div>
    )}


  </div>
);

}


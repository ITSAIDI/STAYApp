import { viga } from "@/fonts";
import {useCallback, useMemo, useState } from "react";
import WordCloud from "react-d3-cloud";


const MAX_FONT_SIZE = 100;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 20;

export function WordCloudComponent({ words })
{
    const categorizedWords = useMemo(() => {
        const total = words.length;
        if (total < 4) return { mostFrequent: words, mediumFrequent: [], lessFrequent: [] };

        const q1Index = Math.floor(total * 0.01);
        const q3Index = Math.floor(total * 0.75);

        const mostFrequent = words.slice(0, q1Index);
        const mediumFrequent = words.slice(q1Index, q3Index);
        const lessFrequent = words.slice(q3Index);

        console.log('mostFrequent',mostFrequent)
        console.log('mediumFrequent',mediumFrequent)
        console.log('lessFrequent',lessFrequent)


        return { mostFrequent, mediumFrequent, lessFrequent };
        }, [words]);
    
    const getRandomSample = (arr, n) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(n, arr.length));
        };

    const sortedWords = useMemo(() => {
    const { mostFrequent, mediumFrequent, lessFrequent } = categorizedWords;

    const topSample = getRandomSample(mostFrequent, 7);
    const middleSample = getRandomSample(mediumFrequent, 7);
    const bottomSample = getRandomSample(lessFrequent, 7);

    return [...topSample, ...middleSample, ...bottomSample];
    }, [categorizedWords]);

    const [hoveredTag, setHoveredTag] = useState(null)

    const [minOccurences, maxOccurences] = useMemo(() => {
    const min = Math.min(...sortedWords.map((w) => w.value));
    const max = Math.max(...sortedWords.map((w) => w.value));
    return [min, max];
        }, [sortedWords]);

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
   
  return (
  <div className="relative w-[400px] h-[400px]">
    <WordCloud
      width={800}
      height={800}
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
    />

    {hoveredTag && (
      <div
        className={`flex flex-col absolute bg-green3 text-green1 px-2 py-1 rounded shadow ${viga.className} whitespace-nowrap`}
        style={{
          top: hoveredTag.y - 100, // shift up to align better with word
          left: hoveredTag.x - 200,
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


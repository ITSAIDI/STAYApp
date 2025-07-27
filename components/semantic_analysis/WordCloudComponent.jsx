import {useCallback, useMemo } from "react";
import WordCloud from "react-d3-cloud";

const MAX_FONT_SIZE = 100;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 20;

export function WordCloudComponent({ words,pageNumber })
{
  const sortedWords = useMemo(() => words.slice((pageNumber-1)*MAX_WORDS, pageNumber*MAX_WORDS),[words])

    const [minOccurences, maxOccurences] = useMemo(() => {
    const min = Math.min(...sortedWords.map((w) => w.value));
    const max = Math.max(...sortedWords.map((w) => w.value));
    return [min, max];
        }, [sortedWords]);

    const calculateFontSize = useCallback(
        (wordOccurrences) => {
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
            const normalizedValue =
            (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
            const fontWeight =
            MIN_FONT_WEIGHT +
            normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
            return Math.round(fontWeight);
        },
        [maxOccurences, minOccurences]
        );

  return (
    <div className="w-[400px] h-[400px]">
      <WordCloud
        width={800}
        height={800}
        font={"Poppins"}
        fontWeight={(word) => calculateFontWeight(word.value)}
        data={sortedWords}
        rotate={0}
        padding={1}
        fontSize={(word) => calculateFontSize(word.value)}
        random={() => 0.5}
        />
    </div>
  );
}


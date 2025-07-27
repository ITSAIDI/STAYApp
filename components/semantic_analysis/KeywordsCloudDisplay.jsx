import React from 'react'
import WordCloud from 'react-d3-cloud'

const data = [
  { text: 'react', value: 100 },
  { text: 'javascript', value: 80 },
  { text: 'd3', value: 60 },
  { text: 'wordcloud', value: 40 },
  { text: 'frontend', value: 20 },
]

const fontSizeMapper = word => Math.log2(word.value) * 5
const rotate = word => (word.value % 360) - 45


export default function KeywordsCloudDisplay({ tags, maxWords }) {
 return (
    <WordCloud
      data={data}
      fontSizeMapper={fontSizeMapper}
      rotate={rotate}
      width={600}
      height={400}
    />
  )
}

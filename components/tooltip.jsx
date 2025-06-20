import React from 'react'

export default function Tooltip({text,message,styleText,styleMessage}) {
  return (
    <div className='relative group'>
        <p className={`${styleText} cursor-pointer`}>{text}</p>
        <p className={`${styleMessage} absolute  right-1 opacity-0 mb-2 bg-green-200 text-green1 text-sm  px-2 py-1 rounded group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap`}>{message}</p>

    </div>
  )
}

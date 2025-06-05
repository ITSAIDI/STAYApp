'use client'

import { faUser,faPlay,faEye } from "@fortawesome/free-solid-svg-icons"
import ChannelSection from "./channelSection"
import { viga } from "@/fonts"
import { useState } from "react"


export default function ChannelsLeaderboard() {
  const [statChoice,setStatChoice] = useState('views')

  return (
    <div className='flex flex-col bg-white rounded-lg mt-2 p-2'>
        <h1 className = {`${viga.className} text-xl text-green1`}>Channels</h1>
        <div className="flex flex-col items-start">
          <ChannelSection 
          profileURL = {'https://yt3.ggpht.com/x06r38NLRbEmnIY7wLSi5cFmpDDbeqmquc65IsdWhSx4bGHxXlfyP1MVR7WrR_W7ouAavlu1=s800-c-k-c0x00ffffff-no-rj'}  
          channelName = {'Yannick VD Electroculture sdchscdvscdgvsdcsgdcsdcgvsdcgv'} 
          creationDate = {'2007-06-13'}
          bio = {'sdhcbsbdcbhsdbhjsdvbhdhcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbskldklwedwdm,sdcsdcjnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnsdcbbdv,j123jsdcvnjksdvjnasdvn'}
          label = {true}
          statChoice = {statChoice}
          channelStats = {
              {
                subscibers:{number : 3232423 , icon : faUser},
                videos:{number : 90 , icon : faPlay},
                views:{number : 3000987670 , icon : faEye},
                
              }
            }
        />

         <ChannelSection 
          profileURL = {'https://yt3.ggpht.com/x06r38NLRbEmnIY7wLSi5cFmpDDbeqmquc65IsdWhSx4bGHxXlfyP1MVR7WrR_W7ouAavlu1=s800-c-k-c0x00ffffff-no-rj'}  
          channelName = {'Yannick VD Electroculture sdchscdvscdgvsdcsgdcsdcgvsdcgv'} 
          creationDate = {'2017-05-14'}
          bio = {'sdhcbsbdcbhsdbhjsdvbhdhcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbskldklwedwdm,sdcsdcjnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnsdcbbdv,j123jsdcvnjksdvjnasdvn'}
          label = {false}
          statChoice = {statChoice}
          channelStats = {
              {
                subscibers:{number : 2323323 , icon : faUser},
                videos:{number :80 , icon : faPlay},
                views:{number : 222987670 , icon : faEye},
                
              }
            }
            />
        </div>
        


    </div>
  )
}

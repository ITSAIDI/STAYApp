"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { viga } from "@/fonts"


export function Calendar22({title}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(undefined)


  console.log("Creation Date ",date)
  
  return (
    <div className="flex flex-col gap-1 items-center">
      <h1 className={`${viga.className} text-green1`}>{title}</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-40 justify-between font-normal"
          >
            {date ? date.toLocaleDateString("fr-FR") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

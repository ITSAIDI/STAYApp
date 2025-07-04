"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {Command,CommandGroup,CommandItem,CommandList} from "@/components/ui/command"
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover"
import {poppins } from "@/fonts"



export function Combobox({value,setValue,itemsList,text}) {
  const [open, setOpen] = React.useState(false)
  

  return (
    <Popover open={open} onOpenChange={setOpen}>

      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className= {`${poppins.className} justify-between`}
        >
          {value
            ? itemsList.find((item) => item.value === value)?.label
            : text}
          <ChevronsUpDown className="text-green1" />
        </Button>
      </PopoverTrigger>


      <PopoverContent className="p-0 w-fit">
        <Command>
          <CommandList>
            <CommandGroup>
              {itemsList.map((item) => (
                <CommandItem
                  className= {`${poppins.className}`}
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

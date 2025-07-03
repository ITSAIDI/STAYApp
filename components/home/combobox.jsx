"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {Command,CommandGroup,CommandItem,CommandList} from "@/components/ui/command"
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover"
import {poppins } from "@/fonts"


const frameworks = [
  {
    value: "views",
    label: "Number of views",
  },
  {
    value: "subscribers",
    label: "Number of subscribers",
  },
  {
    value: "videos",
    label: "Number of videos",
  }
]

export function Combobox({value,setValue}) {
  const [open, setOpen] = React.useState(false)
  

  return (
    <Popover open={open} onOpenChange={setOpen}>

      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className= {`${poppins.className} w-[200px] justify-between`}
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Sort channels"}
          <ChevronsUpDown className="text-green1" />
        </Button>
      </PopoverTrigger>


      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  className= {`${poppins.className}`}
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
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

"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ChevronDownIcon, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { PopoverProps } from "@radix-ui/react-popover";
interface ComboboxProps extends PopoverProps {
  className?: string;
  items: { label: string; value: string; icon?: React.ReactNode }[];
  disabled?: boolean;
  showTrigger?: boolean;
  value: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

export function Combobox({
  items,

  placeholder,
  value,
  onValueChange,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedItem = useMemo(
    () => items.find((item) => item.value === value),
    [items, value]
  );
  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "rounded-full h-11 font-normal justify-between",
            selectedItem ? "text-foreground" : "text-muted-foreground"
          )}
          aria-expanded={open}
          role="combobox"
          variant="outline"
        >
          <span className="row gap-2">
            {selectedItem && selectedItem.icon}
            {selectedItem ? selectedItem.label : placeholder}
          </span>

          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No Items found</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  key={item.value}
                >
                  {item.icon}
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
  );
}

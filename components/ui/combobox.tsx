"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  values,
  value,
  setValue,
  classNames,
  placeholder,
  searchPlaceholder,
  selectFirstOption,
}: {
  values: string[];
  value: string;
  setValue: (v: string) => void;
  classNames?: {
    trigger?: string;
    content?: string;
  };
  placeholder?: string;
  searchPlaceholder?: string;
  selectFirstOption?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between gap-2",
            !value ? "text-muted-foreground hover:text-muted-foreground" : "",
            classNames?.trigger,
          )}
        >
          {value ? values.find((v) => v === value) : placeholder}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popper-anchor-width)] p-0",
          classNames?.content,
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder || ""} />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup className="scroll-auto">
              {!values.length && selectFirstOption ? (
                <CommandItem
                  key={"-"}
                  value={"-"}
                  onSelect={(currentValue) => {
                    setOpen(false);
                  }}
                >
                  {selectFirstOption}
                </CommandItem>
              ) : (
                values.map((v) => (
                  <CommandItem
                    key={v}
                    value={v}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === v ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {v}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

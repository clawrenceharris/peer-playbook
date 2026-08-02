"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

type ComboboxMultipleProps = {
  items: string[];
  emptyMessage?: string;
  placeholder?: string;
  className?: string;
  onValueChange: (value: string[]) => void;
};
export function ComboboxMultiple({
  items,
  placeholder,
  emptyMessage,
  onValueChange,
  className,
}: ComboboxMultipleProps) {
  const anchor = useComboboxAnchor();
  return (
    <Combobox
      onValueChange={onValueChange}
      multiple
      autoHighlight
      items={items}
    >
      <ComboboxChips ref={anchor} className={cn("w-full max-w-xs", className)}>
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={placeholder} />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent side="bottom" align="start" anchor={anchor}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

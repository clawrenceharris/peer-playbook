import React, { SVGProps } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface FilterItemProps {
  label: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  options: { label: string; value: string }[];
  onToggle: (value: string) => void;
  value?: string;
  className?: string;
}
export function FilterItem({
  label,
  icon: Icon,
  options,
  onToggle,
  value,
  className,
}: FilterItemProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "bg-surface text-muted-foreground hover:text-muted-foreground hover:[&_path]:stroke-muted-foreground [&_path]:stroke-muted-foreground rounded-full text-sm shadow-xs",
            className,
          )}
          variant="outline"
        >
          {<Icon className="size-5" />}
          <span>
            {`${label}${value ? ": " : ""}`}

            {value && <span className="text-primary-400">{value}</span>}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="border-none bg-transparent shadow-none"
      >
        {options.map((option) => (
          <DropdownMenuItem
            className={cn(
              "bg-primary-foreground mb-3 justify-between rounded-full border shadow-md",
              value === option.value ? "text-primary-400" : "",
            )}
            key={option.value}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
            {value === option.value && (
              <X className="text-muted-foreground size-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

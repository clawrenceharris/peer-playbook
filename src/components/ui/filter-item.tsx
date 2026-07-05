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
            "rounded-full text-md text-muted-foreground hover:text-accent-foreground hover:[&_path]:stroke-accent-foreground [&_path]:stroke-muted-foreground ",
            className,
          )}
          variant="outline"
        >
          {<Icon className="size-5 " />}
          <span>
            {`${label}${value ? ": " : ""}`}

            {value && <span className="text-primary-400">{value}</span>}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-transparent  shadow-none border-none"
      >
        {options.map((option) => (
          <DropdownMenuItem
            className={cn(
              "rounded-full shadow-md border mb-3 bg-primary-foreground",
              value === option.value ? "text-primary-400" : "",
            )}
            key={option.value}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
            {value === option.value && (
              <X className="size-4 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

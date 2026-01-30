"use client";
import React from "react";
import { FilterItem, Toggle } from "@/components/ui";
import { Book } from "lucide-react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { Playbook, Star } from "@/components/icons";
import { useMyFavoritePlaybooks } from "@/features/playbooks/hooks";
import { useUser } from "@/app/providers";

interface PlaybookFiltersProps {
  onFilterChange: (filters: PlaybookFilterState) => void;
  filters: PlaybookFilterState;
  availableCourses?: string[];
}

export interface PlaybookFilterState {
  recent?: boolean;
  course?: string;
  favorite?: boolean;
  published?: boolean;
}

export const PlaybookFilters = ({
  onFilterChange,
  filters,
  availableCourses = [],
}: PlaybookFiltersProps) => {
  const handleToggle = (
    key: keyof PlaybookFilterState,
    value: ValueOf<PlaybookFilterState>,
  ) => {
    const newFilter = filters[key] === value ? "" : value;
    onFilterChange({ ...filters, [key]: newFilter });
  };
  return (
    <div className="flex flex-wrap gap-6">
      <Toggle
        className="text-muted-foreground bg-primary-foreground shadow-sm border-1 hover:bg-background transition-[background] duration-200"
        pressed={filters.favorite === true}
        onPressedChange={() => handleToggle("favorite", !filters.favorite)}
        size="lg"
        variant="outline"
      >
        <Star />
        Favorites
      </Toggle>

      {availableCourses.length > 0 && (
        <FilterItem
          label="Courses"
          icon={Playbook}
          options={availableCourses.map((c) => ({ label: c, value: c }))}
          onToggle={(value) => handleToggle("course", value)}
          value={filters.course}
        />
      )}
    </div>
  );
};

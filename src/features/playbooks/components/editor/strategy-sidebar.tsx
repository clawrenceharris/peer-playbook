"use client";

import React from "react";
import { PlaybookStrategy } from "@/features/playbooks/domain";
import { cn } from "@/lib/utils";
import { getCardBackgroundColor } from "@/utils";

interface StrategySidebarProps {
  strategies: PlaybookStrategy[];
  activeStrategyId?: string | null;
  onStrategyClick: (strategyId: string) => void;
}

export function StrategySidebar({
  strategies,
  activeStrategyId,
  onStrategyClick,
}: StrategySidebarProps) {
  return (
    <div className="w-full shrink-0 overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 pr-2">
        {strategies.map((strategy) => {
          const stepsPreview = strategy.steps?.[0] ?? "Add steps";
          return (
            <button
              key={strategy.id}
              type="button"
              onClick={() => onStrategyClick(strategy.id)}
              className={cn(
                "min-w-[220px] shrink-0 rounded-lg border px-3 py-2 text-left transition hover:bg-muted/40",
                activeStrategyId === strategy.id
                  ? "border-primary-400 bg-muted/60"
                  : "border-border",
              )}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-1 size-2 rounded-full",
                    getCardBackgroundColor(strategy.phase),
                  )}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold line-clamp-1">
                    {strategy.title}
                  </div>
                  <div className="text-xs uppercase text-muted-foreground">
                    {strategy.phase}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {stepsPreview}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

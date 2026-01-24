import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { StrategyCard, StrategyCardProps } from "./";

interface SortableStrategyCardProps extends StrategyCardProps {
  onReplaceClick?: () => void;
  onSaveClick?: () => void;
  isSaved?: boolean;
}

export function SortableStrategyCard({
  strategy,
  onReplaceClick,
  onSaveClick,
  isSaved = false,
  ...props
}: SortableStrategyCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    index,
    isDragging,
  } = useSortable({ id: strategy.id });

  const style: React.CSSProperties = {
    // during drag: don't move the real card
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <StrategyCard
      ref={setNodeRef}
      style={style}
      strategy={strategy}
      phase={index === 0 ? "warmup" : index === 1 ? "workout" : "closer"}
      onReplaceClick={onReplaceClick}
      onSaveClick={onSaveClick}
      isSaved={isSaved}
      className={cn(isDragging ? "ring-2 ring-primary-500" : "")}
      {...props}
    >
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="absolute z-9 -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full
                     bg-white text-foreground shadow border border-border
                     cursor-grab active:cursor-grabbing touch-none"
      />
    </StrategyCard>
  );
}

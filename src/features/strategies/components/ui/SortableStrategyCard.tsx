import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { StrategyCard, StrategyCardProps } from "./";
import { Item, ItemTitle, ItemHeader } from "@/components/ui";
import { MoreVertical } from "lucide-react";

interface SortableStrategyCardProps extends StrategyCardProps {
  onReplaceClick?: () => void;
  onSaveClick?: () => void;
  isSaved?: boolean;
}

export function SortableStrategyCard({
  strategy,
  onReplaceClick,
  onSaveClick,
  className,
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
    <Item
      variant="outline"
      className={cn(
        "rounded-lg shadow-xs",
        isDragging && "ring-primary-500 ring-2",
        className,
      )}
      ref={setNodeRef}
      style={style}
      {...props}
    >
      <ItemHeader>
        <ItemTitle>{strategy.title}</ItemTitle>
        <MoreVertical />
      </ItemHeader>
    </Item>
  );
  // return (
  //   <PlaybookStrategyItem
  //     ref={setNodeRef}
  //     style={style}
  //     strategy={strategy}
  //     phase={index === 0 ? "warmup" : index === 1 ? "workout" : "closer"}
  //     onReplaceClick={onReplaceClick}
  //     onSaveClick={onSaveClick}
  //     isSaved={isSaved}
  //     className={cn(isDragging && "ring-primary-500 ring-2", className)}
  //     {...props}
  //   >
  //     <button
  //       ref={setActivatorNodeRef}
  //       {...attributes}
  //       {...listeners}
  //       aria-label="Drag to reorder"
  //       className="text-foreground border-border absolute -top-3 left-1/2 z-9 h-6 w-6 -translate-x-1/2 cursor-grab touch-none rounded-full border bg-white shadow active:cursor-grabbing"
  //     />
  //   </StrategyCard>
  // );
}

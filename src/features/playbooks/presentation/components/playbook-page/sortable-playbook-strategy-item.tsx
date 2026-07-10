import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { PlaybookStrategyCardDTO } from "@/features/playbooks/application/dto";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import {
  EllipsisVertical,
  LucideIcon,
  LucideProps,
  MoreVertical,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { HTMLAttributes, useState } from "react";
import { PHASE_STYLES } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

type StrategyItem = {
  id: string;
  title: string;
  duration: string;
  phase: PhaseIntent;
  Icon: React.ComponentType<LucideProps>;
};

type StrategyItemProps = {
  strategy: StrategyItem;
  onClick?: () => void;
  isSelected?: boolean;
} & HTMLAttributes<HTMLDivElement>;
export function SortablePlaybookStrategyItem({
  strategy,
  onClick,
  isSelected,
  ...props
}: StrategyItemProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: strategy.id,
  });
  const style: React.CSSProperties = {
    // during drag: don't move the real card
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  const styles = PHASE_STYLES[strategy.phase];
  return (
    <Item
      ref={setNodeRef}
      style={style}
      key={strategy.id}
      tabIndex={0}
      onClick={onClick}
      className={cn(
        "rounded-none shadow-xs",
        isDragging && "ring-primary-500 ring-2",
        "group hover:bg-muted/50 cursor-pointer px-4 py-3",
        isSelected && styles.active,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="text-muted-foreground/70 group-hover:text-foreground mr-2 flex shrink-0 cursor-grab transition-colors"
      >
        <span className="tracking-[-2px]">⋮⋮</span>
      </div>

      <ItemContent className="min-w-0 gap-1">
        <ItemTitle className="truncate text-sm font-semibold">
          {strategy.title}
        </ItemTitle>
      </ItemContent>

      <ItemActions className="ml-auto shrink-0 gap-2 self-center">
        <span className="bg-background text-muted-foreground rounded-full border px-2 py-1 text-xs font-medium">
          {strategy.duration}
        </span>

        <Button
          type="button"
          size="icon-xs"
          variant="outline"
          aria-label={`More options for ${strategy.title}`}
          onClick={(event) => {
            event.stopPropagation();
            // Replace with DropdownMenu later.
          }}
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-1 transition-colors"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </ItemActions>
    </Item>
  );
}

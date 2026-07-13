import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import {
  EllipsisVertical,
  GripVertical,
  LucideProps,
  Repeat2,
  Trash2,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { HTMLAttributes } from "react";
import { PHASE_STYLES } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

type StrategyItem = {
  id: string;
  playbookPhaseId: string;
  title: string;
  duration: string;
  phase: PhaseIntent;
  Icon: React.ComponentType<LucideProps>;
};

type StrategyItemProps = {
  strategy: StrategyItem;
  onClick?: () => void;
  onReplaceClick?: () => void;
  onRemoveClick?: () => void;
  isSelected?: boolean;
} & HTMLAttributes<HTMLDivElement>;
export function SortablePlaybookStrategyItem({
  strategy,
  onClick,
  onReplaceClick,
  onRemoveClick,
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
    <ContextMenu>
      <ContextMenuTrigger>
        <Item
          ref={setNodeRef}
          style={style}
          key={strategy.id}
          tabIndex={0}
          onClick={onClick}
          className={cn(
            "relative flex-1 overflow-hidden rounded-none shadow-xs",
            isDragging && "ring-primary-500 ring-2",
            "group cursor-pointer px-4 py-4",
            isSelected && styles.activeStrategy,
          )}
          {...props}
        >
          <span
            aria-hidden
            className={cn(
              "absolute bottom-0 left-0 h-full w-[3.6px] bg-transparent",
              {
                "bg-intent-activate": strategy.phase === PhaseIntent.ACTIVATE,
                "bg-intent-explore": strategy.phase === PhaseIntent.EXPLORE,
                "bg-intent-apply": strategy.phase === PhaseIntent.APPLY,
                "bg-intent-reflect": strategy.phase === PhaseIntent.REFLECT,
              },
              !isSelected && "bg-transparent",
            )}
          />
          <div
            aria-hidden="true"
            className="text-muted-foreground/70 group-hover:text-foreground mr-2 flex shrink-0 cursor-grab transition-colors"
          >
            <GripVertical className="size-4" />
          </div>

          <ItemContent className="min-w-0 gap-1">
            <ItemTitle className="line-clamp-1 max-w-[200px] truncate text-sm font-semibold select-none">
              {strategy.title}
            </ItemTitle>
          </ItemContent>
        </Item>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem variant="destructive" onClick={onRemoveClick}>
          <Trash2 />
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

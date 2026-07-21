import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ItemMedia,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import {
  EllipsisVertical,
  GripVertical,
  LucideProps,
  Trash2,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { HTMLAttributes } from "react";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

type StrategyItem = {
  id: string;
  playbookPhaseId: string;
  title: string;
  duration: string | null;
  phase: PhaseIntent;
  Icon: React.ComponentType<LucideProps>;
  steps: string[];
};

type StrategyItemProps = {
  strategy: StrategyItem;
  onClick?: () => void;
  onRemoveClick?: () => void;
  isSelected?: boolean;
} & HTMLAttributes<HTMLDivElement>;
export function SortablePlaybookStrategyItem({
  strategy,
  onClick,
  onRemoveClick,
  isSelected,
  ...props
}: StrategyItemProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: strategy.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
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
            "group border-b-border relative flex-1 cursor-default overflow-hidden rounded-none border-b px-4 py-4",
            isDragging && "ring-primary ring-2",
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
          <ItemMedia className="border-0 bg-transparent" variant="icon">
            <Button
              ref={setActivatorNodeRef}
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground/70 group-hover:text-foreground mr-2 shrink-0 cursor-grab touch-none active:cursor-grabbing"
              onClick={(event) => event.stopPropagation()}
              aria-label={`Reorder ${strategy.title}`}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4" />
            </Button>
          </ItemMedia>
          <ItemContent className="min-w-0 gap-1">
            <div className="flex items-center gap-1">
              <ItemTitle className="line-clamp-1 max-w-50 truncate text-sm font-semibold select-none">
                {strategy.title}
              </ItemTitle>
              {strategy.duration ? (
                <span className="text-muted-foreground text-xs">
                  {strategy.duration}
                </span>
              ) : null}
            </div>
            <ItemDescription className="line-clamp-1 text-xs">
              {strategy.steps?.[0]}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Strategy options for ${strategy.title}`}
                >
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem variant="destructive" onClick={onRemoveClick}>
                  <Trash2 />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
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

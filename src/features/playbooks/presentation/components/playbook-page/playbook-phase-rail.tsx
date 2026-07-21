"use client";

import { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Plus, Trash2 } from "lucide-react";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { PHASE_STYLES } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { phaseIntentCatalog } from "@/features/reference-data/phase-intents/infrastructure/catalogs/phase-intent";
import type { PlaybookWorkspacePhase } from "../../workspace";
import { Icon } from "@/components/shared";
import { assets } from "@/lib/constants";

type PlaybookPhaseRailProps = {
  phases: PlaybookWorkspacePhase[];
  activePhaseId: string;
  onSelectPhase: (phaseId: string) => void;
  onAddPhase: (intentKey: "activate" | "explore" | "apply" | "reflect") => void;
  onReorderPhases: (phaseIds: string[]) => void;
  onDeletePhase: (phaseId: string) => void;
  onPhaseIntentChange: (
    phaseId: string,
    intent: "activate" | "explore" | "apply" | "reflect",
  ) => void;
  onTitleChange: (phaseId: string, title: string) => void;
  onEstimatedMinutesChange: (
    phaseId: string,
    estimatedMinutes: number | null,
  ) => void;
};

function SortablePhaseChip({
  phase,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: {
  phase: PlaybookWorkspacePhase;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: phase.id });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Item
          ref={setNodeRef}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
          }}
          onClick={onSelect}
          tabIndex={0}
          aria-label={`Select ${phase.title} phase`}
          aria-current={isActive ? "true" : undefined}
          className={cn(
            "hover:bg-muted/80 bg-surface relative flex h-full w-full min-w-75 flex-1 cursor-pointer flex-nowrap items-center justify-center overflow-hidden rounded-none",
            isDragging && "z-10 opacity-80",
          )}
        >
          <ItemMedia
            className={cn(
              "flex-cc size-10 rounded-full",
              PHASE_STYLES[phase.intent].icon,
            )}
          >
            <phase.Icon strokeWidth={2.5} />
          </ItemMedia>
          {isActive ? (
            <span
              aria-hidden
              className={cn("absolute bottom-0 h-1 w-full", {
                "bg-intent-activate": phase.intent === PhaseIntent.ACTIVATE,
                "bg-intent-explore": phase.intent === PhaseIntent.EXPLORE,
                "bg-intent-apply": phase.intent === PhaseIntent.APPLY,
                "bg-intent-reflect": phase.intent === PhaseIntent.REFLECT,
                "bg-intent-transition": phase.intent === PhaseIntent.TRANSITION,
              })}
            />
          ) : null}
          <ItemContent>
            <div className="flex w-full items-center gap-2">
              <ItemTitle
                title={phase.title}
                className="line-clamp-1 max-w-25 truncate text-sm font-medium whitespace-nowrap"
              >
                {phase.title}
              </ItemTitle>
              <span className="text-muted-foreground text-xs">
                ({phase.estimatedMinutes ?? 0} min)
              </span>
            </div>
          </ItemContent>
          <ItemActions>
            <button
              type="button"
              onClick={onSelect}
              // Drag from the chip itself; click still selects the phase.
              {...attributes}
              {...listeners}
              className={cn(
                "group/phase relative flex w-full cursor-grab items-center justify-center overflow-hidden p-0 transition-all duration-200 hover:scale-107 active:cursor-grabbing",
              )}
              aria-label={`${phase.title} phase`}
              aria-current={isActive ? "true" : undefined}
            >
              <GripVertical className="size-4" />
            </button>
          </ItemActions>
        </Item>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onEdit}>
          <Icon src={assets.pencilEdit} alt="Edit" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function PlaybookPhaseRail({
  phases,
  onSelectPhase,
  onAddPhase,
  onReorderPhases,
  onDeletePhase,
  onPhaseIntentChange,
  onTitleChange,
  onEstimatedMinutesChange,
  activePhaseId,
}: PlaybookPhaseRailProps) {
  const [displayPhases, setDisplayPhases] = useState(phases);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  // Remount the select after each pick so choosing the same intent twice still fires.
  const [addIntentSelectKey, setAddIntentSelectKey] = useState(0);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  useEffect(() => {
    setDisplayPhases(phases);
  }, [phases]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayPhases.findIndex((phase) => phase.id === active.id);
    const newIndex = displayPhases.findIndex((phase) => phase.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(displayPhases, oldIndex, newIndex);
    setDisplayPhases(next);
    onReorderPhases(next.map((phase) => phase.id));
  }
  function handleEditClick(phaseId: string) {
    onSelectPhase(phaseId);
    setEditingPhaseId(phaseId);
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditingPhaseId(null);
  }
  return (
    <>
      <div className="bg-muted relative flex w-full flex-row items-center overflow-hidden rounded-lg border shadow-xs">
        <div className="flex w-full flex-1 flex-row items-center divide-x overflow-hidden overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayPhases.map((phase) => phase.id)}
              strategy={horizontalListSortingStrategy}
            >
              {displayPhases.map((phase) => (
                <Popover key={phase.id} open={editingPhaseId === phase.id}>
                  <div className="relative flex">
                    {activePhaseId === phase.id ? (
                      <PopoverAnchor>
                        <SortablePhaseChip
                          key={phase.id}
                          phase={phase}
                          isActive={activePhaseId === phase.id}
                          onSelect={() => onSelectPhase(phase.id)}
                          onEdit={() => handleEditClick(phase.id)}
                          onDelete={() => onDeletePhase(phase.id)}
                        />
                      </PopoverAnchor>
                    ) : (
                      <SortablePhaseChip
                        key={phase.id}
                        phase={phase}
                        isActive={activePhaseId === phase.id}
                        onSelect={() => onSelectPhase(phase.id)}
                        onEdit={() => handleEditClick(phase.id)}
                        onDelete={() => onDeletePhase(phase.id)}
                      />
                    )}
                    <div className="bg-border h-full w-px" />
                  </div>
                  <PopoverContent hidden={activePhaseId !== phase.id}>
                    <form
                      className="flex flex-wrap items-center gap-3"
                      onSubmit={handleSubmit}
                    >
                      <FieldGroup>
                        <div className="flex flex-row flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Field className="w-fit">
                              <FieldLabel className="sr-only">
                                Instructional phase intent
                              </FieldLabel>

                              <Select
                                value={phase.intent}
                                onValueChange={(value) => {
                                  onPhaseIntentChange(
                                    phase.id,
                                    value as
                                      | "activate"
                                      | "explore"
                                      | "apply"
                                      | "reflect",
                                  );
                                }}
                              >
                                <SelectTrigger
                                  triggerClassName={cn(
                                    PHASE_STYLES[phase.intent].icon,
                                    "bg-transparent",
                                  )}
                                  className={cn(
                                    "flex max-w-fit items-center justify-center border-0 border-none bg-transparent shadow-none",
                                    PHASE_STYLES[phase.intent].icon,
                                  )}
                                >
                                  <SelectValue>
                                    <phase.Icon
                                      strokeWidth={2.5}
                                      className={cn(
                                        "size-4.5",
                                        PHASE_STYLES[phase.intent].icon,
                                        "bg-transparent",
                                      )}
                                    />
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent side="bottom" align="end">
                                  {phaseIntentCatalog.map((intent) => (
                                    <SelectItem
                                      key={intent.key}
                                      value={intent.key}
                                    >
                                      <intent.Icon className="size-4" />
                                      <span>{intent.label}</span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field className="w-full flex-1">
                              <FieldLabel
                                htmlFor={`${phase.id}-phase-title`}
                                className="sr-only"
                              >
                                Phase title
                              </FieldLabel>
                              <Input
                                id={`${phase.id}-phase-title`}
                                className="w-full rounded-md focus-visible:ring-0"
                                aria-label={`${phase.title} phase title`}
                                value={phase.title}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) =>
                                  onTitleChange(phase.id, event.target.value)
                                }
                              />
                            </Field>
                          </div>

                          <Field>
                            <FieldLabel
                              htmlFor={`${phase.id}-phase-duration`}
                              className="sr-only"
                            >
                              Estimated duration in minutes
                            </FieldLabel>

                            <InputGroup className="w-32 rounded-md">
                              <InputGroupInput
                                id={`${phase.id}-phase-duration`}
                                aria-label={`${phase.title} phase duration in minutes`}
                                type="number"
                                min={0}
                                value={phase.estimatedMinutes ?? ""}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  // Keep empty string as null; reject NaN so the controlled input stays usable.
                                  if (value === "") {
                                    onEstimatedMinutesChange(phase.id, null);
                                    return;
                                  }
                                  const next = Number(value);
                                  onEstimatedMinutesChange(
                                    phase.id,
                                    Number.isFinite(next) ? next : null,
                                  );
                                }}
                              />
                              <InputGroupAddon
                                align="inline-end"
                                className="text-muted-foreground text-sm"
                              >
                                min
                              </InputGroupAddon>
                            </InputGroup>
                          </Field>
                        </div>
                      </FieldGroup>
                      <Field>
                        <Button
                          type="submit"
                          onClick={() => setEditingPhaseId(null)}
                          variant="primary"
                        >
                          <Check strokeWidth={3} />
                          Save
                        </Button>
                      </Field>
                    </form>
                  </PopoverContent>
                </Popover>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <TooltipProvider>
          <DropdownMenu key={addIntentSelectKey}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger
                  className="bg-surface border-border absolute top-1/2 right-2 flex aspect-square min-w-13 -translate-y-1/2 items-center justify-center rounded-md border shadow-xs"
                  aria-label="Add phase"
                >
                  <Plus
                    className="text-accent-foreground size-5"
                    strokeWidth={2.5}
                  />
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Add a phase</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="end">
              {phaseIntentCatalog.map((intent) => (
                <DropdownMenuItem
                  key={intent.key}
                  onClick={() => {
                    onAddPhase(intent.key);
                    setAddIntentSelectKey((current) => current + 1);
                  }}
                >
                  <intent.Icon className="size-4" />
                  <span>{intent.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </>
  );
}

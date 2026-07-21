"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  ButtonGroup,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldTitle,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { GripVertical, Plus, X } from "lucide-react";
import type {
  BuildPlaybookFormValues,
  PhaseIntentKey,
  PlaybookPhaseFormValues,
  StrategyRef,
} from "@/lib/validation";

import { cn } from "@/lib/utils";
import { InstructionalModelDTO } from "@/features/reference-data/instructional-models/application/dto/InstructionalModelDTO";
import { SelectField } from "@/components/form/select-field";
import { StrategyPanel, StrategyPickerItem } from "@/components/shared";
import {
  PHASE_INTENT_ICONS,
  PHASE_STYLES,
} from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

const intentOptions: {
  key: PhaseIntentKey;
  label: string;
  legacyPhase: "warmup" | "workout" | "closer";
}[] = [
  { key: "activate", label: "Activate", legacyPhase: "warmup" },
  { key: "explore", label: "Explore", legacyPhase: "workout" },
  { key: "apply", label: "Apply", legacyPhase: "workout" },
  { key: "reflect", label: "Reflect", legacyPhase: "closer" },
];

const defaultPhaseTitles: Record<PhaseIntentKey, string> = {
  activate: "Introduction",
  explore: "Investigation",
  apply: "Practice",
  reflect: "Debrief",
};

function getLegacyPhase(intentKey: PhaseIntentKey) {
  return (
    intentOptions.find((intent) => intent.key === intentKey)?.legacyPhase ??
    "workout"
  );
}

function buildCustomPhase(position: number) {
  const nextIntent = intentOptions[position]?.key ?? "apply";
  return {
    title: defaultPhaseTitles[nextIntent],
    intentKey: nextIntent,
    templatePhaseKey: undefined,
    legacyPhase: getLegacyPhase(nextIntent),
    position,
    strategies: [],
  };
}

function phasesMatchInstructionalModel(
  phases: PlaybookPhaseFormValues[],
  model: InstructionalModelDTO,
) {
  const modelPhases = [...model.phases].sort((a, b) => a.position - b.position);

  if (phases.length !== modelPhases.length) {
    return false;
  }

  return modelPhases.every((modelPhase, index) => {
    const phase = phases[index];
    return (
      phase?.title?.trim() === modelPhase.label.trim() &&
      phase.intentKey === modelPhase.intentKey
    );
  });
}

function getMatchingInstructionalModelId(
  phases: PlaybookPhaseFormValues[],
  instructionalModels: InstructionalModelDTO[],
) {
  return instructionalModels.find(
    (model) =>
      model.id !== "custom" && phasesMatchInstructionalModel(phases, model),
  )?.id;
}

type PhaseRowProps = {
  sortableId: string;
  index: number;
  canRemove: boolean;
  isTemplateLocked: boolean;
  mode: "structure" | "strategies";
  systemItems: StrategyPickerItem[];
  savedItems: StrategyPickerItem[];
  userItems: StrategyPickerItem[];
  titleByKey: Map<string, string>;
  onRemove: () => void;
};
function keyOf(ref: StrategyRef) {
  return `${ref.sourceType}:${ref.sourceId}`;
}
function PhaseRow({
  sortableId,
  index,
  canRemove,
  isTemplateLocked,
  mode,
  systemItems,
  savedItems,
  userItems,
  titleByKey,
  onRemove,
}: PhaseRowProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });
  const form = useFormContext<BuildPlaybookFormValues>();
  const strategies = useFieldArray({
    control: form.control,
    name: `phases.${index}.strategies`,
  });
  const phase = useWatch({
    control: form.control,
    name: `phases.${index}`,
  }) as PlaybookPhaseFormValues | undefined;
  const refs = (strategies.fields ?? []) as unknown as StrategyRef[];
  const disabledKeys = refs.map((ref) => keyOf(ref));
  const activeIntent = phase?.intentKey ?? "activate";
  const phaseTitle = phase?.title?.trim() || `Phase ${index + 1}`;
  const [isStrategyPanelOpen, setIsStrategyPanelOpen] = useState(false);

  function handleIntentChange(intentKey: PhaseIntentKey) {
    form.setValue(`phases.${index}.intentKey`, intentKey, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(`phases.${index}.legacyPhase`, getLegacyPhase(intentKey), {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(`phases.${index}.templatePhaseKey`, undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("instructionalModelId", "custom", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }
  const Icon = PHASE_INTENT_ICONS[phase?.intentKey ?? "activate"];
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      ref={setNodeRef}
      variant="outline"
      style={style}
      className={cn(
        "relative w-full min-w-111.25 overflow-hidden",
        isDragging && "ring-primary-400 bg-background z-10 shadow-lg ring-2",
      )}
    >
      <FieldSet className="w-full">
        <span
          aria-hidden
          className={cn("absolute bottom-0 left-0 h-full w-[5.9px]", {
            "bg-intent-activate": phase?.intentKey === PhaseIntent.ACTIVATE,
            "bg-intent-explore": phase?.intentKey === PhaseIntent.EXPLORE,
            "bg-intent-apply": phase?.intentKey === PhaseIntent.APPLY,
            "bg-intent-reflect": phase?.intentKey === PhaseIntent.REFLECT,
          })}
        />
        <ItemHeader>
          {mode === "structure" && (
            <Button
              ref={setActivatorNodeRef}
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Reorder ${phaseTitle}`}
              className="text-muted-foreground hover:text-foreground mr-1 shrink-0 cursor-grab touch-none active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical aria-hidden="true" />
            </Button>
          )}
          <ItemMedia
            variant="icon"
            className={cn(
              "flex size-10 items-center justify-center rounded-full border-0",
              PHASE_STYLES[phase?.intentKey ?? "activate"].icon,
            )}
          >
            <Icon className="size-6" />
          </ItemMedia>

          {mode === "structure" ? (
            <Input
              readOnly={mode !== "structure"}
              aria-label={`Phase ${index + 1} title`}
              className={cn("rounded-lg text-base font-semibold", {
                "focus-visible:ring-intent-activate/50":
                  phase?.intentKey === PhaseIntent.ACTIVATE,
                "focus-visible:ring-intent-explore/50":
                  phase?.intentKey === PhaseIntent.EXPLORE,
                "focus-visible:ring-intent-apply/50":
                  phase?.intentKey === PhaseIntent.APPLY,
                "focus-visible:ring-intent-reflect/50":
                  phase?.intentKey === PhaseIntent.REFLECT,
              })}
              {...form.register(`phases.${index}.title`, {
                onChange: () => {
                  if (isTemplateLocked) {
                    form.setValue(
                      `phases.${index}.templatePhaseKey`,
                      undefined,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                    form.setValue("instructionalModelId", "custom", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                },
              })}
            />
          ) : (
            <ItemTitle
              className={cn("flex-1 text-lg font-semibold", {
                "text-intent-activate":
                  phase?.intentKey === PhaseIntent.ACTIVATE,
                "text-intent-explore": phase?.intentKey === PhaseIntent.EXPLORE,
                "text-intent-apply": phase?.intentKey === PhaseIntent.APPLY,
                "text-intent-reflect": phase?.intentKey === PhaseIntent.REFLECT,
              })}
            >
              {phaseTitle}
            </ItemTitle>
          )}
          <ItemActions>
            {mode === "structure" && (
              <ButtonGroup>
                {intentOptions.map((intent) => (
                  <Button
                    key={intent.key}
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "hover:bg-muted-foreground/10",
                      activeIntent === intent.key &&
                        PHASE_STYLES[intent.key].button,
                    )}
                    onClick={() => handleIntentChange(intent.key)}
                  >
                    {intent.label}
                  </Button>
                ))}
              </ButtonGroup>
            )}
            {canRemove && mode === "structure" && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove phase"
                className="hover:bg-foreground/10"
                onClick={onRemove}
              >
                <X strokeWidth={3} />
              </Button>
            )}
          </ItemActions>
        </ItemHeader>

        {mode === "strategies" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Strategies</FieldTitle>
                  <FieldDescription>
                    Add strategies here. You can reorder or remove them later in
                    the workspace.
                  </FieldDescription>
                </FieldContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsStrategyPanelOpen(true)}
                >
                  <Plus />
                  Add strategy
                </Button>
              </Field>
              <StrategyPanel
                phaseTitle={phaseTitle}
                systemItems={systemItems}
                savedItems={savedItems}
                userItems={userItems}
                disabledKeys={disabledKeys}
                onPick={(ref) => strategies.append(ref as StrategyRef)}
                open={isStrategyPanelOpen}
                onOpenChange={setIsStrategyPanelOpen}
              />
            </div>

            {refs.length > 0 ? (
              <>
                <div className="bg-surface grid gap-2">
                  {refs.map((ref, strategyIndex) => {
                    const key = keyOf(ref);
                    return (
                      <div
                        key={`${key}-${strategyIndex}`}
                        className="border-border flex min-h-12 items-center justify-between rounded-lg border px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {titleByKey.get(key) ?? key}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {ref.sourceType === "system"
                              ? "PeerPlaybook"
                              : "Created by you"}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${titleByKey.get(key) ?? "strategy"} from ${phaseTitle}`}
                          onClick={() => strategies.remove(strategyIndex)}
                        >
                          <X />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                No strategies yet for this phase.
              </p>
            )}
          </>
        ) : null}
      </FieldSet>
    </Item>
  );
}

type ManualStrategyBuilderSectionProps = {
  instructionalModels: InstructionalModelDTO[];
  mode?: "all" | "structure" | "strategies";
};

export function ManualStrategyBuilderSection({
  instructionalModels,
  mode = "all",
}: ManualStrategyBuilderSectionProps) {
  const form = useFormContext<BuildPlaybookFormValues>();
  const phases = useFieldArray({ control: form.control, name: "phases" });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const selectedModelId = useWatch({
    control: form.control,
    name: "instructionalModelId",
  });
  const watchedPhases = useWatch({
    control: form.control,
    name: "phases",
  }) as PlaybookPhaseFormValues[] | undefined;

  const selectedModel =
    instructionalModels.find((model) => model.id === selectedModelId) ??
    instructionalModels[0];

  const { data: systemStrategies = [] } = { data: [] };
  const { data: savedStrategies = [] } = { data: [] };
  const { data: userStrategies = [] } = { data: [] };

  function buildPhasesFromModel(
    id: string,
    currentPhases: PlaybookPhaseFormValues[],
  ) {
    const model = instructionalModels.find((model) => model.id === id);
    if (!model) {
      return currentPhases;
    }
    if (model.phases.length === 0) {
      return currentPhases.map((phase, position) => ({
        ...phase,
        position,
      }));
    }

    return model.phases.map((phase, position) => ({
      title: phase.label,
      intentKey: phase.intentKey,
      templatePhaseKey: phase.key,
      legacyPhase: getLegacyPhase(phase.intentKey),
      position,
      strategies: currentPhases[position]?.strategies ?? [],
    }));
  }

  useEffect(() => {
    if (!selectedModel && instructionalModels[0]) {
      form.setValue("instructionalModelId", instructionalModels[0].id, {
        shouldDirty: false,
      });
    }
  }, [form, instructionalModels, selectedModel]);

  useEffect(() => {
    if (!watchedPhases) return;

    const matchingModelId = getMatchingInstructionalModelId(
      watchedPhases,
      instructionalModels,
    );
    const customModelId = instructionalModels.some(
      (model) => model.id === "custom",
    )
      ? "custom"
      : undefined;
    const nextModelId = matchingModelId ?? customModelId;

    if (nextModelId && nextModelId !== selectedModelId) {
      form.setValue("instructionalModelId", nextModelId, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [form, instructionalModels, selectedModelId, watchedPhases]);

  const systemItems: StrategyPickerItem[] = useMemo(
    () =>
      systemStrategies.map((strategy: { id: string; title: string }) => ({
        sourceType: "system",
        sourceId: strategy.id,
        title: strategy.title,
      })),
    [systemStrategies],
  );

  const savedItems: StrategyPickerItem[] = useMemo(
    () =>
      savedStrategies.map((strategy: { id: string; title: string }) => ({
        sourceType: "system",
        sourceId: strategy.id,
        title: strategy.title,
      })),
    [savedStrategies],
  );

  const userItems: StrategyPickerItem[] = useMemo(
    () =>
      userStrategies.map((strategy: { id: string; title: string }) => ({
        sourceType: "user",
        sourceId: strategy.id,
        title: strategy.title,
      })),
    [userStrategies],
  );

  const titleByKey = useMemo(() => {
    const map = new Map<string, string>();
    for (const strategy of systemItems)
      map.set(keyOf(strategy), strategy.title);
    for (const strategy of savedItems) map.set(keyOf(strategy), strategy.title);
    for (const strategy of userItems) map.set(keyOf(strategy), strategy.title);
    return map;
  }, [savedItems, systemItems, userItems]);
  function applyInstructionalModel(id: string) {
    const currentPhases =
      (form.getValues("phases") as PlaybookPhaseFormValues[]) ?? [];
    const nextPhases =
      id === "custom" && currentPhases.length === 0
        ? [buildCustomPhase(0)]
        : buildPhasesFromModel(id, currentPhases);

    form.setValue("instructionalModelId", id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("phases", nextPhases, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function appendPhase() {
    phases.append(buildCustomPhase(phases.fields.length));
    form.setValue("instructionalModelId", "custom", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handlePhaseDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = phases.fields.findIndex((phase) => phase.id === active.id);
    const newIndex = phases.fields.findIndex((phase) => phase.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const currentPhases =
      (form.getValues("phases") as PlaybookPhaseFormValues[]) ?? [];
    const nextPhases = arrayMove(currentPhases, oldIndex, newIndex).map(
      (phase, position) => ({
        ...phase,
        position,
      }),
    );

    phases.replace(nextPhases);
    form.setValue("instructionalModelId", "custom", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function removePhase(index: number) {
    const currentPhases =
      (form.getValues("phases") as PlaybookPhaseFormValues[]) ?? [];
    const nextPhases = currentPhases
      .filter((_, phaseIndex) => phaseIndex !== index)
      .map((phase, position) => ({
        ...phase,
        position,
      }));

    phases.replace(nextPhases);
    form.setValue("instructionalModelId", "custom", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <FieldGroup>
      {mode !== "strategies" ? (
        <SelectField
          name="instructionalModelId"
          label="Instructional Model"
          className="max-w-md"
          onValueSelect={(value) => applyInstructionalModel(value)}
          items={instructionalModels.map((model) => ({
            value: model.id,
            label: model.label,
            description: model.description,
          }))}
        />
      ) : (
        <Item variant="outline" className="max-w-lg shadow-xs">
          <ItemContent>
            <ItemTitle>{selectedModel?.label}</ItemTitle>
            <ItemDescription>{selectedModel?.description}</ItemDescription>
          </ItemContent>
        </Item>
      )}
      <FieldSet>
        <Field orientation="horizontal">
          <FieldContent className="gap-0">
            <FieldLegend variant="label" className="mb-1">
              {mode === "strategies" ? "Strategies" : "Instructional Phases"}
            </FieldLegend>
            <FieldDescription>
              {mode === "strategies"
                ? "Add learning strategies to guide your session, or do this part later in the workspace."
                : "Add or rename phases to outline the session flow. You can reorder or edit them later."}
            </FieldDescription>
          </FieldContent>
          {mode !== "strategies" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={appendPhase}
            >
              <Plus />
              Add phase
            </Button>
          )}
        </Field>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[
            restrictToVerticalAxis,
            restrictToFirstScrollableAncestor,
          ]}
          onDragEnd={handlePhaseDragEnd}
        >
          <SortableContext
            items={phases.fields.map((phase) => phase.id)}
            strategy={verticalListSortingStrategy}
          >
            <FieldGroup>
              {phases.fields.map((phase, index) => (
                <PhaseRow
                  key={phase.id}
                  sortableId={phase.id}
                  index={index}
                  canRemove={phases.fields.length > 1}
                  isTemplateLocked={selectedModel?.id !== "custom"}
                  mode={mode === "structure" ? "structure" : "strategies"}
                  systemItems={systemItems}
                  savedItems={savedItems}
                  userItems={userItems}
                  titleByKey={titleByKey}
                  onRemove={() => removePhase(index)}
                />
              ))}
            </FieldGroup>
          </SortableContext>
        </DndContext>
      </FieldSet>
    </FieldGroup>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  Button,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  Input,
} from "@/components/ui";
import { Plus, X } from "lucide-react";
import type {
  CreatePlaybookFormValues,
  PhaseIntentKey,
  PlaybookPhaseFormValues,
  StrategyRef,
} from "@/lib/validation";

import {
  useMySavedStrategiesWithDetails,
  useMyUserStrategies,
  useStrategies,
} from "@/features/strategies/hooks";
import { useUser } from "@/components/providers";
import { cn } from "@/lib/utils";
import { InstructionalModelDTO } from "@/features/reference-data/instructional-models/application/dto/InstructionalModelDTO";
import { SelectField } from "@/components/form/select-field";
import { StrategyPanel, StrategyPickerItem } from "@/components/shared";

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

type PhaseRowProps = {
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
  const form = useFormContext<CreatePlaybookFormValues>();
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

  return (
    <FieldSet className="border-border bg-background flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-52 flex-1">
          <Input
            aria-label={`Phase ${index + 1} title`}
            className="rounded-lg text-base font-semibold"
            {...form.register(`phases.${index}.title`, {
              onChange: () => {
                if (isTemplateLocked) {
                  form.setValue(`phases.${index}.templatePhaseKey`, undefined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  form.setValue("instructionalModelId", "custom", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              },
            })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {intentOptions.map((intent) => (
            <Button
              key={intent.key}
              type="button"
              variant={activeIntent === intent.key ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "h-9 rounded-full px-3",
                activeIntent === intent.key && "border-primary/30",
              )}
              onClick={() => handleIntentChange(intent.key)}
            >
              {intent.label}
            </Button>
          ))}
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove phase"
            onClick={onRemove}
          >
            <X />
          </Button>
        )}
      </div>

      {mode === "strategies" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <FieldLegend variant="label">Strategies</FieldLegend>
              <FieldDescription>
                Add strategies when you are ready. You can refine order later in
                the workspace.
              </FieldDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStrategyPanelOpen(true)}
            >
              <Plus />
              Add strategy
            </Button>
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
            <div className="grid gap-2">
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
          ) : (
            <p className="text-muted-foreground text-sm">
              No strategies yet for this phase.
            </p>
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {refs.length} {refs.length === 1 ? "strategy" : "strategies"} added.
        </p>
      )}
    </FieldSet>
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
  const { user } = useUser();
  const form = useFormContext<CreatePlaybookFormValues>();
  const phases = useFieldArray({ control: form.control, name: "phases" });
  const [isStrategyPanelOpen, setIsStrategyPanelOpen] = useState(false);
  const selectedModelId = useWatch({
    control: form.control,
    name: "instructionalModelId",
  });

  const selectedModel =
    instructionalModels.find((model) => model.id === selectedModelId) ??
    instructionalModels[0];

  const { data: systemStrategies = [] } = useStrategies();
  const { data: savedStrategies = [] } = useMySavedStrategiesWithDetails(
    user.id,
  );
  const { data: userStrategies = [] } = useMyUserStrategies(user.id);

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

  const systemItems: StrategyPickerItem[] = useMemo(
    () =>
      systemStrategies.map((strategy) => ({
        sourceType: "system",
        sourceId: strategy.id,
        title: strategy.title,
      })),
    [systemStrategies],
  );

  const savedItems: StrategyPickerItem[] = useMemo(
    () =>
      savedStrategies.map((strategy) => ({
        sourceType: "system",
        sourceId: strategy.id,
        title: strategy.title,
      })),
    [savedStrategies],
  );

  const userItems: StrategyPickerItem[] = useMemo(
    () =>
      userStrategies.map((strategy) => ({
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

  return (
    <FieldGroup>
      <SelectField
        name="instructionalModelId"
        label="Instructional Model"
        onValueSelect={(value) => applyInstructionalModel(value)}
        items={instructionalModels.map((model) => ({
          value: model.id,

          label: model.label,
        }))}
      />

      <div className="flex items-center justify-between gap-3">
        <div>
          <FieldLegend variant="label">
            {mode === "strategies" ? "Strategies" : "Phase Outline"}
          </FieldLegend>
          <FieldDescription>
            {mode === "strategies"
              ? "Open a phase to add strategies from PeerPlaybook, saved items, or your own library."
              : "Phase names are user-facing. Purpose keeps instructional meaning for guidance and organization."}
          </FieldDescription>
        </div>
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
      </div>

      <div className="grid gap-4">
        {phases.fields.map((phase, index) => (
          <PhaseRow
            key={phase.id}
            index={index}
            canRemove={phases.fields.length > 1}
            isTemplateLocked={selectedModel?.id !== "custom"}
            mode={mode === "structure" ? "structure" : "strategies"}
            systemItems={systemItems}
            savedItems={savedItems}
            userItems={userItems}
            titleByKey={titleByKey}
            onRemove={() => {
              phases.remove(index);
              form.setValue("instructionalModelId", "custom", {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
        ))}
      </div>
    </FieldGroup>
  );
}

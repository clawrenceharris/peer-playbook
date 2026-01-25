"use client";

import React, { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FieldGroup, FieldLegend, FieldSet, Button } from "@/components/ui";
import { X } from "lucide-react";
import type {
  CreatePlaybookFormValues,
  StrategyRef,
} from "@/features/playbooks/domain";
import { StrategyPicker, type StrategyPickerItem } from "./strategy-picker";
import {
  useMySavedStrategiesWithDetails,
  useMyUserStrategies,
  useStrategies,
} from "@/features/strategies/hooks";
import { useUser } from "@/app/providers";

type Phase = "warmup" | "workout" | "closer";

const phaseLabels: Record<Phase, string> = {
  warmup: "Warmup",
  workout: "Workout",
  closer: "Closer",
};

function keyOf(ref: StrategyRef) {
  return `${ref.sourceType}:${ref.sourceId}`;
}

export function ManualStrategyBuilderSection() {
  const { user } = useUser();
  const form = useFormContext<CreatePlaybookFormValues>();

  const { data: systemStrategies = [] } = useStrategies();
  const { data: savedStrategies = [] } = useMySavedStrategiesWithDetails(user.id);
  const { data: userStrategies = [] } = useMyUserStrategies(user.id);

  const warmup = useFieldArray({ control: form.control, name: "warmup" });
  const workout = useFieldArray({ control: form.control, name: "workout" });
  const closer = useFieldArray({ control: form.control, name: "closer" });

  const systemItems: StrategyPickerItem[] = useMemo(
    () =>
      systemStrategies.map((s) => ({
        sourceType: "system",
        sourceId: s.id,
        title: s.title,
      })),
    [systemStrategies],
  );

  // Saved strategies are still system strategies (they live in `strategies`)
  const savedItems: StrategyPickerItem[] = useMemo(
    () =>
      savedStrategies.map((s) => ({
        sourceType: "system",
        sourceId: s.id,
        title: s.title,
      })),
    [savedStrategies],
  );

  const userItems: StrategyPickerItem[] = useMemo(
    () =>
      userStrategies.map((s) => ({
        sourceType: "user",
        sourceId: s.id,
        title: s.title,
      })),
    [userStrategies],
  );

  const titleByKey = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of systemItems) map.set(keyOf(s), s.title);
    // Saved is a subset; no need to overwrite but safe
    for (const s of savedItems) map.set(keyOf(s), s.title);
    for (const s of userItems) map.set(keyOf(s), s.title);
    return map;
  }, [savedItems, systemItems, userItems]);

  const renderPhase = (phase: Phase) => {
    const fa = phase === "warmup" ? warmup : phase === "workout" ? workout : closer;
    const refs = (fa.fields ?? []) as unknown as StrategyRef[];
    const disabledKeys = refs.map((r) => keyOf(r));

    return (
      <FieldSet key={phase} className="flex flex-col gap-3">
        <FieldLegend variant="label">{phaseLabels[phase]}</FieldLegend>

        <StrategyPicker
          label={`Add to ${phaseLabels[phase]}`}
          description="Pick a strategy to add. You can add multiple and reorder later."
          systemItems={systemItems}
          savedItems={savedItems}
          userItems={userItems}
          disabledKeys={disabledKeys}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPick={(ref) => fa.append(ref as any)}
        />

        {refs.length > 0 ? (
          <div className="flex flex-col gap-2">
            {refs.map((r, idx) => {
              const k = keyOf(r);
              return (
                <div
                  key={`${k}-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {titleByKey.get(k) ?? k}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.sourceType}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fa.remove(idx)}
                  >
                    <X />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No strategies yet for this phase.
          </p>
        )}
      </FieldSet>
    );
  };

  return (
    <FieldGroup>
      <FieldLegend variant="label">Strategies</FieldLegend>
      <div className="flex flex-col gap-6">
        {renderPhase("warmup")}
        {renderPhase("workout")}
        {renderPhase("closer")}
      </div>
    </FieldGroup>
  );
}


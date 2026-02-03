/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Combobox,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import type { StrategyRef } from "@/features/playbooks/domain";

export type StrategyPickerSource = "system" | "saved" | "user";

export interface StrategyPickerItem {
  sourceType: StrategyRef["sourceType"];
  sourceId: StrategyRef["sourceId"];
  title: string;
}

export interface StrategyPickerProps {
  label?: string;
  description?: string;
  onPick: (ref: StrategyRef) => void;
  disabledKeys?: string[]; // `${sourceType}:${sourceId}`
  systemItems: StrategyPickerItem[];
  savedItems?: StrategyPickerItem[];
  userItems?: StrategyPickerItem[];
  defaultSource?: StrategyPickerSource;
}

const keyOf = (item: Pick<StrategyPickerItem, "sourceType" | "sourceId">) =>
  `${item.sourceType}:${item.sourceId}`;

export function StrategyPicker({
  label = "Add strategy",
  description = "Choose a strategy to add to this phase.",
  onPick,
  disabledKeys = [],
  systemItems,
  savedItems = [],
  userItems = [],
  defaultSource = "system",
}: StrategyPickerProps) {
  const [source, setSource] = useState<StrategyPickerSource>(defaultSource);
  const [value, setValue] = useState("");

  const items = useMemo(() => {
    const active =
      source === "system"
        ? systemItems
        : source === "saved"
        ? savedItems
        : userItems;
    return active.map((i) => ({
      label: i.title,
      value: keyOf(i),
    }));
  }, [savedItems, source, systemItems, userItems]);

  const isDisabled = (k: string) => disabledKeys.includes(k);

  const selectedDisabled = value ? isDisabled(value) : false;

  return (
    <Field>
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </FieldContent>

      <FieldContent className="flex flex-col gap-3">
        <Tabs value={source} onValueChange={(v) => setSource(v as any)}>
          <TabsList>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="user">Yours</TabsTrigger>
          </TabsList>
          <TabsContent value={source} className="mt-3">
            <div className="flex gap-2 items-center">
              <Combobox
                value={value}
                placeholder="Select a strategy"
                items={items}
                onValueChange={(v) => setValue(v)}
              />
              <Button
                type="button"
                variant="secondary"
                disabled={!value || selectedDisabled}
                onClick={() => {
                  if (!value) return;
                  if (isDisabled(value)) return;
                  const [sourceType, sourceId] = value.split(":");
                  if (!sourceType || !sourceId) return;
                  onPick({ sourceType: sourceType as any, sourceId });
                  setValue("");
                }}
              >
                Add
              </Button>
            </div>
            {selectedDisabled ? (
              <p className="text-sm text-muted-foreground mt-2">
                Already added.
              </p>
            ) : null}
          </TabsContent>
        </Tabs>
      </FieldContent>
    </Field>
  );
}

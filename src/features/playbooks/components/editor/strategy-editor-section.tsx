"use client";

import React, { useMemo, useRef } from "react";
import { Plate, usePlateEditor } from "platejs/react";
import type { Value } from "platejs";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { Card, CardContent } from "@/components/ui";
import { PlaybookStrategy } from "@/features/playbooks/domain";

type StrategyHeaderNode = {
  type: "strategyHeader";
  title?: string;
  phase?: PlaybookStrategy["phase"];
  steps?: string[];
  children: { text: string }[];
};

const isStrategyHeaderNode = (node: unknown): node is StrategyHeaderNode => {
  if (!node || typeof node !== "object") return false;
  const obj = node as { type?: unknown };
  return obj.type === "strategyHeader";
};

const arrayShallowEqual = (a: string[], b: string[]) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const defaultEditorValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

interface StrategyEditorSectionProps {
  strategy: PlaybookStrategy;
  onUpdate: (strategyId: string, updates: Partial<PlaybookStrategy>) => void;
  sectionRef?: (node: HTMLDivElement | null) => void;
}

export function StrategyEditorSection({
  strategy,
  onUpdate,
  sectionRef,
}: StrategyEditorSectionProps) {
  const value = useMemo<Value>(() => {
    const rawBody =
      (strategy.detailsRich as Value | undefined) ?? defaultEditorValue;

    const bodyWithoutHeader = Array.isArray(rawBody)
      ? (rawBody.filter((n) => !isStrategyHeaderNode(n)) as Value)
      : defaultEditorValue;

    const header: StrategyHeaderNode = {
      type: "strategyHeader",
      title: strategy.title ?? "",
      phase: strategy.phase ?? "warmup",
      steps: strategy.steps ?? [],
      children: [{ text: "" }],
    };

    return [header as unknown as Value[number], ...bodyWithoutHeader];
  }, [strategy.detailsRich, strategy.phase, strategy.steps, strategy.title]);

  const editor = usePlateEditor({
    id: `strategy-${strategy.id}`,
    plugins: EditorKit,
    value,
  });

  const lastSnapshotRef = useRef<{
    title: string;
    phase: PlaybookStrategy["phase"];
    steps: string[];
    body: Value;
  } | null>(null);

  const handleEditorChange = (nextValue: Value) => {
    const maybeHeader = nextValue[0] as unknown;
    const header = isStrategyHeaderNode(maybeHeader)
      ? maybeHeader
      : ({
          type: "strategyHeader",
          title: strategy.title ?? "",
          phase: strategy.phase ?? "warmup",
          steps: strategy.steps ?? [],
          children: [{ text: "" }],
        } as StrategyHeaderNode);

    const nextTitle = header.title ?? "";
    const nextPhase = (header.phase ?? "warmup") as PlaybookStrategy["phase"];
    const nextSteps = (header.steps ?? []) as string[];

    const nextBody =
      (nextValue.filter((n) => !isStrategyHeaderNode(n)) as Value) ??
      defaultEditorValue;

    const prev = lastSnapshotRef.current ?? {
      title: strategy.title ?? "",
      phase: strategy.phase ?? "warmup",
      steps: strategy.steps ?? [],
      body: ((strategy.detailsRich as Value | undefined) ??
        defaultEditorValue) as Value,
    };

    const patch: Partial<PlaybookStrategy> = {};
    if (prev.title !== nextTitle) patch.title = nextTitle;
    if (prev.phase !== nextPhase) patch.phase = nextPhase;
    if (!arrayShallowEqual(prev.steps, nextSteps)) patch.steps = nextSteps;

    // Persist editor body (excluding the stitched header node)
    patch.detailsRich = nextBody;

    // Avoid useless state updates if only header changed? We still include detailsRich.
    onUpdate(strategy.id, patch);

    lastSnapshotRef.current = {
      title: nextTitle,
      phase: nextPhase,
      steps: nextSteps,
      body: nextBody,
    };
  };

  return (
    <div ref={sectionRef} data-strategy-id={strategy.id} className="h-full">
      <Card className="border-border/70 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">
                Strategy content (add links, images, tables, etc.)
              </label>
            </div>
            <Plate
              editor={editor}
              onChange={({ value }) => handleEditorChange(value)}
            >
              <EditorContainer className="rounded-lg border border-border/70 bg-white">
                <Editor variant="fullWidth" className="min-h-[200px]" />
              </EditorContainer>
            </Plate>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

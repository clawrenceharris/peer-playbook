"use client";

import * as React from "react";
import type { LucideProps } from "lucide-react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { SortablePlaybookStrategyItem } from "./sortable-playbook-strategy-item";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { PHASE_STYLES } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { cn } from "@/lib/utils";

type StrategyItem = {
  id: string;
  playbookPhaseId: string;
  title: string;
  duration: string | null;
  steps: string[];
  phase: PhaseIntent;
  Icon: React.ComponentType<LucideProps>;
};

type StrategyListPanelProps = {
  phaseId: string;
  onAddStrategyClick: () => void;
  strategies: StrategyItem[];
  onStrategyClick: (id: string) => void;
  selectedStrategyId: string | null;
  onReorder: (
    phaseId: string,
    strategies: Array<
      Pick<StrategyItem, "id" | "title" | "phase" | "playbookPhaseId">
    >,
  ) => void;
  onRemoveStrategyClick?: (strategyId: string) => void;
};
export function StrategyListPanel({
  phaseId,
  onAddStrategyClick,
  strategies,
  onStrategyClick,
  selectedStrategyId,
  onReorder,
  onRemoveStrategyClick,
}: StrategyListPanelProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [displayStrategies, setDisplayStrategies] =
    useState<StrategyItem[]>(strategies);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  useEffect(() => {
    setDisplayStrategies(strategies);
  }, [strategies]);

  return (
    <div className="bg-surface flex min-h-0 w-69 flex-col overflow-hidden rounded-2xl border shadow-xs">
      <header className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-foreground text-lg font-semibold">Strategies</h2>

        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 rounded-xl"
          onClick={onAddStrategyClick}
        >
          <Plus className="size-4" />
          Add
        </Button>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToFirstScrollableAncestor, restrictToWindowEdges]}
        onDragStart={({ active }) => {
          setActiveId(String(active.id));
          document.body.style.overscrollBehavior = "contain";
          document.body.style.cursor = "grabbing";
        }}
        onDragEnd={({ active, over }) => {
          document.body.style.overscrollBehavior = "";
          document.body.style.cursor = "";
          setActiveId(null);

          if (!over || active.id === over.id) return;
          const oldIndex = displayStrategies.findIndex(
            (c) => c.id === active.id,
          );
          const newIndex = displayStrategies.findIndex((c) => c.id === over.id);
          const next = arrayMove(displayStrategies, oldIndex, newIndex);
          setDisplayStrategies(next);
          onReorder(phaseId, next);
        }}
        onDragCancel={() => {
          document.body.style.overscrollBehavior = "";
          document.body.style.cursor = "";
          setActiveId(null);
        }}
      >
        <SortableContext
          items={displayStrategies}
          strategy={verticalListSortingStrategy}
        >
          <ItemGroup className="flex-1">
            {displayStrategies.map((strategy) => (
              <SortablePlaybookStrategyItem
                key={strategy.id}
                isSelected={selectedStrategyId === strategy.id}
                strategy={strategy}
                onClick={() => onStrategyClick(strategy.id)}
                onRemoveClick={() => onRemoveStrategyClick?.(strategy.id)}
              />
            ))}
          </ItemGroup>
        </SortableContext>

        {/*This lifts the dragged card out of the layout for buttery effect */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeId ? (
            <CardGhost
              phase={displayStrategies.find((c) => c.id === activeId)!.phase}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function CardGhost({ phase }: { phase: PhaseIntent }) {
  // Simple CardGhost for dragging a strategy card
  return (
    <div
      className={cn(
        "rounded-md border-2 border-dashed bg-white px-4 py-3 font-semibold text-gray-700 opacity-90 shadow-lg select-none",
        PHASE_STYLES[phase].icon,
      )}
    ></div>
  );
}

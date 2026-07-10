"use client";

import * as React from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import {
  EllipsisVertical,
  ImageIcon,
  Network,
  Plus,
  Repeat2,
  Snowflake,
  Star,
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { SortablePlaybookStrategyItem } from "./sortable-playbook-strategy-item";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useIsMobile } from "@/hooks";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { CardGhost } from "@/features/strategies/components";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

type StrategyItem = {
  id: string;
  title: string;
  duration: string;
  phase: PhaseIntent;
  Icon: React.ComponentType<LucideProps>;
};

type StrategyListPanelProps = {
  onAddStrategyClick: () => void;
  strategies: StrategyItem[];
  onStrategyClick: (id: string) => void;
};
export function StrategyListPanel({
  onAddStrategyClick,
  strategies,
  onStrategyClick,
}: StrategyListPanelProps) {
  const isMobile = useIsMobile();
  const [isDirty, setIsDirty] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const phaseOrder = [
    PhaseIntent.ACTIVATE,
    PhaseIntent.EXPLORE,
    PhaseIntent.APPLY,
    PhaseIntent.REFLECT,
  ];
  const [reorderedStrategies, setReorderedStrategies] =
    useState<StrategyItem[]>(strategies);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  return (
    <aside className="bg-surface flex min-h-0 min-w-64 flex-col overflow-hidden rounded-2xl border shadow-xs">
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
          const oldIndex = strategies.findIndex((c) => c.id === active.id);
          const newIndex = strategies.findIndex((c) => c.id === over.id);
          const next = arrayMove(strategies, oldIndex, newIndex).map(
            (c, i) => ({
              ...c,
              phase: phaseOrder[i] ?? c.phase,
            }),
          );
          setReorderedStrategies(next);
          setIsDirty(true);
        }}
        onDragCancel={() => {
          document.body.style.overscrollBehavior = "";
          document.body.style.cursor = "";
          setActiveId(null);
        }}
      >
        <SortableContext
          items={strategies}
          strategy={
            isMobile ? verticalListSortingStrategy : rectSortingStrategy
          }
        >
          <ItemGroup className="min-h-0 flex-1 divide-y">
            {strategies.map((strategy) => (
              <SortablePlaybookStrategyItem
                key={strategy.id}
                strategy={strategy}
                onClick={() => onStrategyClick(strategy.id)}
              />
            ))}
          </ItemGroup>
        </SortableContext>

        {/*This lifts the dragged card out of the layout for buttery effect */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeId ? (
            <CardGhost
              phase={
                strategies.find((c) => c.id === activeId)!.phase as unknown as
                  "warmup" | "workout" | "closer"
              }
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="p-3">
        <Button
          variant="outline"
          className="text-muted-foreground hover:text-primary h-20 w-full gap-2 border-dashed"
        >
          <Plus className="size-5" />
          Add Strategy
        </Button>
      </div>
    </aside>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AppSkeleton, Button, useSidebar } from "@/components/ui";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { EmptyState, ErrorState } from "@/components/states";
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useIsMobile } from "@/hooks";
import {
  CardGhost,
  SortableStrategyCard,
} from "@/features/strategies/components";
import { CheckCircle, ChevronLeft, Loader2, Plus } from "lucide-react";
import {
  usePlaybook,
  usePlaybookActions,
  usePlaybookSortedStrategies,
  useReorderStrategies,
} from "@/features/playbooks/hooks";
import { PlaybookStrategy } from "@/features/playbooks/domain";
import { useSessionActions } from "@/features/sessions/hooks";
import {
  useMySavedStrategies,
  useStrategyActions,
} from "@/features/strategies/hooks";
import { BeforeUnload } from "@/components/form";
import { useUser } from "@/app/providers";
import { getUserErrorMessage } from "@/utils";
import { PlaybookCard } from "@/features/playbooks/components";
import { usePendingMutations } from "@/hooks";

const phaseOrder = { warmup: 0, workout: 1, closer: 2 };
interface PlaybookPageProps {
  playbookId: string;
  onBackClick?: () => void;
}
export default function PlaybookPage({
  playbookId,
  onBackClick,
}: PlaybookPageProps) {
  const isMobile = useIsMobile();
  const { user } = useUser();
  const { createSession } = useSessionActions();
  const { mutateAsync: reorderStrategies } = useReorderStrategies();
  const { data: playbook, error, isLoading } = usePlaybook(playbookId);
  const { data: sortedStrategies = [] } =
    usePlaybookSortedStrategies(playbookId);
  const { replaceStrategy } = usePlaybookActions();
  const [reorderedStrategies, setReorderedStrategies] = useState<
    PlaybookStrategy[]
  >([]);
  const { setOpen: setSidebarOpen } = useSidebar();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toggleSave } = useStrategyActions();
  const { data: savedStrategies = [] } = useMySavedStrategies(user.id);
  const { pending: isUpdating } = usePendingMutations({
    mutationKey: ["update-playbook"],
  });
  const [isDirty, setIsDirty] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const strategies = useMemo(
    () =>
      reorderedStrategies.length > 0 ? reorderedStrategies : sortedStrategies,
    [reorderedStrategies, sortedStrategies]
  );
  const handleSave = async () => {
    try {
      await reorderStrategies({ playbookId, strategies });
      setIsDirty(false);
    } catch {}
  };
  useEffect(() => {
    if (!onBackClick) {
      setSidebarOpen(false);
    }
  }, [onBackClick, setSidebarOpen]);
  if (isLoading) {
    return <AppSkeleton />;
  }

  if (error) {
    return <ErrorState variant="card" message={getUserErrorMessage(error)} />;
  }

  if (!playbook) {
    return (
      <>
        <header className="header">
          <Button variant="outline" size="icon" onClick={onBackClick}>
            <ChevronLeft className="size-6" />
          </Button>
        </header>
        <div className="container items-center justify-center">
          <EmptyState
            actionLabel="Go to playbooks"
            onAction={onBackClick}
            variant="card"
            title="Playbook Not Found"
            message="The playbook you're looking for doesn't exist or may have been deleted."
          />
        </div>
      </>
    );
  }
  return (
    <BeforeUnload disabled={!isDirty}>
      <header className="header justify-start">
        {onBackClick && (
          <Button variant="outline" size="icon" onClick={onBackClick}>
            <ChevronLeft className="size-6" />
          </Button>
        )}
        <PlaybookCard
          canEdit={false}
          playbook={playbook}
          hoverDisabled
          titleTextClassName="text-xl"
          className="shadow-none border-border cursor-auto"
        />
      </header>
      <div className="secondary-header flex justify-between flex-row">
        <div className="flex items-center gap-3 justify-end w-full">
          <Button
            variant="outline"
            onClick={() =>
              createSession({
                defaultValues: {
                  courseName: playbook.courseName,
                  topic: playbook.topic,
                  subject: playbook.subject,
                  playbookId: playbookId,
                  mode: playbook.modes.length ? playbook.modes[0] : undefined,
                },
              })
            }
          >
            <Plus /> Create Session
          </Button>
          <Button disabled={!isDirty || isUpdating} onClick={handleSave}>
            {isUpdating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle />
            )}
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className="container">
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
                phase: Object.keys(phaseOrder)[i] as PlaybookStrategy["phase"],
              })
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
            <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 w-full">
              {strategies.map((strategy) => (
                <SortableStrategyCard
                  headerClassName="rounded-t-2xl"
                  onReplaceClick={() => replaceStrategy(playbookId, strategy)}
                  key={strategy.id}
                  onSaveClick={() => {
                    if (strategy.id) {
                      toggleSave(
                        strategy.id,
                        savedStrategies.some((id) => id === strategy.id)
                      );
                    }
                  }}
                  isSaved={savedStrategies.some((id) => id === strategy.id)}
                  strategy={strategy}
                />
              ))}
            </ul>
          </SortableContext>

          {/*This lifts the dragged card out of the layout for buttery effect */}
          <DragOverlay dropAnimation={{ duration: 150 }}>
            {activeId ? (
              <CardGhost
                phase={strategies.find((c) => c.id === activeId)!.phase}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </BeforeUnload>
  );
}

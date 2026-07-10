"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  AppSkeleton,
  Button,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  useSidebar,
} from "@/components/ui";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";

import {
  Brain,
  Check,
  CheckCircle,
  ChevronLeft,
  Dumbbell,
  Lightbulb,
  Loader2,
  LucideProps,
  Plus,
} from "lucide-react";
import { useReorderStrategies } from "@/features/playbooks/presentation/hooks";
import {
  useMySavedStrategiesWithDetails,
  useMyUserStrategies,
  useStrategies,
} from "@/features/strategies/hooks";
import { BeforeUnload } from "@/components/form";
import { useUser } from "@/components/providers";
import { useModals, usePendingMutations } from "@/hooks";
import {
  GetPlaybookPageOutput,
  PlaybookPagePhaseDTO,
  PlaybookStrategyDetailDTO,
} from "@/features/playbooks/application/dto";
import { cn, timeAgo } from "@/lib/utils";
import { Playbook } from "@/components/icons";
import { StrategyListPanel } from "@/features/playbooks/presentation/components/playbook-page/strategy-list-panel";
import { StrategyDetails } from "@/features/playbooks/presentation/components/playbook-page/strategy-details";
import {
  PHASE_INTENT_ICONS,
  PHASE_STYLES,
} from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Icon } from "@/components/icons/icon";
import { assets } from "@/lib/constants";
import { StrategyPanel } from "@/components/shared";

interface PlaybookPageProps {
  page: GetPlaybookPageOutput;
  onBackClick?: () => void;
}

const legacyPhaseIntentMap: Record<string, PhaseIntent> = {
  warmup: PhaseIntent.ACTIVATE,
  workout: PhaseIntent.APPLY,
  closer: PhaseIntent.REFLECT,
  activate: PhaseIntent.ACTIVATE,
  explore: PhaseIntent.EXPLORE,
  apply: PhaseIntent.APPLY,
  reflect: PhaseIntent.REFLECT,
};

const fallbackPhases: {
  id: PhaseIntent;
  label: string;
  title: string;
  intent: PhaseIntent;
  position: number;
  Icon: React.ComponentType<LucideProps>;
}[] = [
  {
    id: PhaseIntent.ACTIVATE,
    label: "Activate",
    title: "Activate",
    intent: PhaseIntent.ACTIVATE,
    position: 0,
    Icon: Brain,
  },
  {
    id: PhaseIntent.EXPLORE,
    label: "Explore",
    title: "Explore",
    intent: PhaseIntent.EXPLORE,
    position: 1,
    Icon: Dumbbell,
  },
  {
    id: PhaseIntent.APPLY,
    label: "Apply",
    title: "Apply",
    intent: PhaseIntent.APPLY,
    position: 2,
    Icon: Lightbulb,
  },
  {
    id: PhaseIntent.REFLECT,
    label: "Reflect",
    title: "Reflect",
    intent: PhaseIntent.REFLECT,
    position: 3,
    Icon: Lightbulb,
  },
];

function getPhaseIntentKey(phase: PlaybookPagePhaseDTO): PhaseIntent {
  return (phase.intent.key as PhaseIntent) ?? PhaseIntent.ACTIVATE;
}

function getStrategyIntent(strategy: PlaybookStrategyDetailDTO): PhaseIntent {
  return legacyPhaseIntentMap[strategy.phase] ?? PhaseIntent.ACTIVATE;
}

export default function PlaybookPage({ page, onBackClick }: PlaybookPageProps) {
  const { playbook } = page;
  const { user } = useUser();
  const { mutateAsync: reorderStrategies } = useReorderStrategies();
  const { data: userStrategies = [] } = useMyUserStrategies(user.id);
  const [isStrategyPanelOpen, setIsStrategyPanelOpen] = useState(false);
  const [reorderedStrategies, setReorderedStrategies] = useState<
    PlaybookStrategyDetailDTO[]
  >([]);
  const { setOpen: setSidebarOpen } = useSidebar();
  const { data: savedStrategies = [] } = useMySavedStrategiesWithDetails(
    user.id,
  );
  const [strategyIndex, setStrategyIndex] = useState(0);
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [phaseEdits, setPhaseEdits] = useState<
    Record<string, { title: string; intent: PhaseIntent }>
  >({});
  const { pending: isUpdating } = usePendingMutations({
    mutationKey: ["update-playbook"],
  });
  const phases: {
    id: string;
    label: string;
    title: string;
    intent: PhaseIntent;
    position: number;
    Icon: React.ComponentType<LucideProps>;
    strategies: PlaybookStrategyDetailDTO[];
  }[] = useMemo(() => {
    const strategiesHavePhaseLinks = page.strategies.some(
      (strategy) => strategy.playbookPhaseId,
    );

    if (playbook.phases.length > 0) {
      return playbook.phases.map((phase) => {
        const intent = getPhaseIntentKey(phase);
        const edit = phaseEdits[phase.id];
        const phaseTitle = edit?.title ?? phase.title;
        const phaseIntent = edit?.intent ?? intent;
        return {
          id: phase.id,
          label: phaseTitle,
          title: phaseTitle,
          intent: phaseIntent,
          position: phase.position,
          Icon: PHASE_INTENT_ICONS[phaseIntent],
          strategies: page.strategies.filter((strategy) => {
            if (strategiesHavePhaseLinks) {
              return strategy.playbookPhaseId === phase.id;
            }

            return getStrategyIntent(strategy) === intent;
          }),
        };
      });
    }

    return fallbackPhases.map((phase) => ({
      ...phase,
      strategies: page.strategies.filter(
        (strategy) => getStrategyIntent(strategy) === phase.intent,
      ),
    }));
  }, [page.strategies, phaseEdits, playbook.phases]);
  const metadata: { label: string; value: string }[] = useMemo(() => {
    return [
      playbook.creator
        ? {
            label: "Created by",
            value: playbook.creator.displayName,
          }
        : null,
      playbook.updatedAt &&
      playbook.updatedAt.toISOString() !== playbook.createdAt.toISOString()
        ? {
            label: "Updated",
            value: timeAgo(playbook.updatedAt?.toISOString()),
          }
        : null,
      {
        label: "",
        value: timeAgo(playbook.createdAt?.toISOString()),
      },
    ].filter(Boolean) as { label: string; value: string }[];
  }, [playbook]);
  const [isDirty, setIsDirty] = useState(false);
  const isPhaseDirty = Object.keys(phaseEdits).length > 0;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const { data: systemStrategies = [] } = useStrategies();

  const [isEditingPhaseTitle, setIsEditingPhaseTitle] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const activePhase = phases[phaseIndex] ?? phases[0];
  const activeStrategies = activePhase?.strategies ?? [];
  const activeStrategy = activeStrategies[strategyIndex] ?? null;

  const strategies = useMemo(
    () =>
      reorderedStrategies.length > 0 ? reorderedStrategies : page.strategies,
    [reorderedStrategies, page.strategies],
  );
  const {
    modals: { "session:create": createSessionModal },
  } = useModals();
  const handleSave = async () => {
    try {
      setIsSavingWorkspace(true);
      const updates: Promise<unknown>[] = [];

      if (isDirty) {
        updates.push(
          reorderStrategies({
            playbookId: playbook.id,
            strategies,
          }),
        );
      }

      if (isPhaseDirty && playbook.phases.length > 0) {
        updates.push(
          fetch(`/api/playbooks/${playbook.id}/phases`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phases: phases.map((phase, position) => ({
                id: phase.id,
                title: phase.title,
                intentKey: phase.intent,
                position,
              })),
            }),
          }).then(async (response) => {
            if (!response.ok) {
              const payload = await response.json().catch(() => null);
              throw new Error(payload?.error ?? "Failed to update phases");
            }
          }),
        );
      }

      await Promise.all(updates);
      setIsDirty(false);
      setPhaseEdits({});
    } catch {
    } finally {
      setIsSavingWorkspace(false);
    }
  };
  function updatePhaseTitle(id: string, title: string) {
    const currentPhase = phases.find((phase) => phase.id === id);
    if (!currentPhase) return;
    setPhaseEdits((current) => ({
      ...current,
      [id]: {
        title,
        intent: current[id]?.intent ?? currentPhase.intent,
      },
    }));
  }

  function updatePhaseIntent(id: string, intent: PhaseIntent) {
    const currentPhase = phases.find((phase) => phase.id === id);
    if (!currentPhase) return;
    setPhaseEdits((current) => ({
      ...current,
      [id]: {
        title: current[id]?.title ?? currentPhase.title,
        intent,
      },
    }));
  }
  useEffect(() => {
    if (!onBackClick) {
      setSidebarOpen(false);
    }
  }, [onBackClick, setSidebarOpen]);
  useEffect(() => {
    setStrategyIndex(0);
  }, [phaseIndex]);
  if (!page) {
    return <AppSkeleton />;
  }
  return (
    <BeforeUnload disabled={!isDirty}>
      <header className="header h-40">
        {onBackClick && (
          <Button variant="outline" size="icon" onClick={onBackClick}>
            <ChevronLeft className="size-6" />
          </Button>
        )}
        <Item
          className={cn(
            "group/scenario-card relative w-full overflow-hidden rounded-lg border-0 py-1 shadow-none transition-all",
          )}
        >
          <ItemMedia className="[&_path]:stroke-muted-foreground bg-primary-foreground flex size-18 items-center justify-center rounded-sm border">
            <Playbook className="transition-all duration-200 group-hover:scale-[1.2]" />
          </ItemMedia>
          <ItemContent>
            <div className="row gap-2">
              <CardTitle
                className={cn(
                  "text-lg font-semibold",
                  "line-clamp-2 max-w-[85%] flex-1 truncate text-lg font-semibold",
                )}
              >
                {playbook.topic}
              </CardTitle>
              {/* {playbook?.hasSession && (
                <span className="text-success-500 bg-success-100 flex items-center gap-1 rounded-full py-1 pr-2 pl-1 text-xs">
                  <Check
                    size={15}
                    className="bg-success-500 rounded-full border-white p-0.5 text-white"
                  />
                  Session Created
                </span>
              )} */}
            </div>
            {/* {isFavorite && (
                        <StarIcon className="fill-accent-400 stroke-accent-400 size-4" />
                      )} */}
            <ItemDescription className="text-xs">
              {metadata.map((item, index) => (
                <span
                  key={item.label}
                  className="text-muted-foreground text-sm font-normal"
                >
                  {index > 0 ? " • " : ""} {item.label} {item.value}
                </span>
              ))}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              onClick={() =>
                createSessionModal.open({
                  playbook: {
                    ...page.playbook,
                    createdBy: page.playbook.creator.id,
                  },
                })
              }
            >
              <Plus strokeWidth={3} /> Create Session
            </Button>
            <Button
              variant="primary"
              disabled={
                (!isDirty && !isPhaseDirty) || isUpdating || isSavingWorkspace
              }
              onClick={handleSave}
            >
              {isUpdating || isSavingWorkspace ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle />
              )}
              {isUpdating || isSavingWorkspace ? "Saving..." : "Save"}
            </Button>
          </ItemActions>
        </Item>
      </header>
      <div className="secondary-header flex h-40 flex-col overflow-hidden px-3 py-0">
        <ItemGroup
          className="flex w-full min-w-0 flex-1 flex-row items-center justify-center gap-4 overflow-x-auto"
          style={{
            gridTemplateColumns: `repeat(${Math.max(phases.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {phases.map((phase) => (
            <Item
              key={phase.id}
              onClick={() => {
                if (phase.id !== activePhase.id) {
                  setIsEditingPhaseTitle(false);
                }
                setPhaseIndex(phases.findIndex((p) => p.id === phase.id));
              }}
              tabIndex={0}
              className={cn(
                "group/phase relative flex-1 cursor-pointer overflow-hidden rounded-2xl py-1 shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1",
                PHASE_STYLES[phase.intent].card,
                activePhase?.id === phase.id &&
                  PHASE_STYLES[phase.intent].active,
              )}
            >
              <ItemContent
                className={"relative flex-row items-center gap-3 p-3"}
              >
                <ItemMedia
                  variant="icon"
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-0",
                    PHASE_STYLES[phase.intent].icon,
                    activePhase?.id === phase.id && "bg-white/50",
                  )}
                >
                  <phase.Icon className="size-6" />
                </ItemMedia>
                {isEditingPhaseTitle && phase.id === activePhase.id ? (
                  <InputGroup
                    className={cn(
                      "text-foreground h-10 w-fit rounded-lg border-transparent text-xl font-bold shadow-none",

                      {
                        "focus-visible:ring-intent-activate":
                          phase.intent === PhaseIntent.ACTIVATE,
                        "focus-visible:ring-intent-explore":
                          phase.intent === PhaseIntent.EXPLORE,
                        "focus-visible:ring-intent-apply":
                          phase.intent === PhaseIntent.APPLY,
                        "focus-visible:ring-intent-reflect":
                          phase.intent === PhaseIntent.REFLECT,
                      },
                    )}
                  >
                    {" "}
                    <InputGroupInput
                      aria-label={`${phase.label} phase title`}
                      value={phase.label}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) =>
                        updatePhaseTitle(phase.id, event.target.value)
                      }
                    />
                    <InputGroupButton
                      onClick={() => setIsEditingPhaseTitle(false)}
                      variant="ghost"
                      size="icon-sm"
                      className={cn(
                        "hover:bg-muted-foreground/10 mr-1",
                        PHASE_STYLES[phase.intent].icon,
                      )}
                    >
                      <Check strokeWidth={3} className="size-5" />
                    </InputGroupButton>
                  </InputGroup>
                ) : (
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-xl font-bold whitespace-nowrap",
                        phase.id === activePhase.id && "text-white",
                      )}
                    >
                      {phase.label}
                    </p>
                  </div>
                )}
              </ItemContent>
              <ItemActions>
                {phase.id === activePhase.id && !isEditingPhaseTitle && (
                  <Button
                    size="icon"
                    className="opacity-0 group-hover/phase:opacity-100"
                    onClick={() => setIsEditingPhaseTitle(true)}
                  >
                    <Icon
                      alt="Edit"
                      src={assets.pencilEdit}
                      className="size-5 invert"
                    />
                  </Button>
                )}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
      <div className="container flex-row gap-4">
        <StrategyListPanel
          onAddStrategyClick={() => setIsStrategyPanelOpen(true)}
          strategies={activeStrategies.map((strategy) => ({
            title: strategy.title,
            id: strategy.id,
            duration: "10 min",
            phase: activePhase?.intent ?? PhaseIntent.ACTIVATE,
            Icon: activePhase?.Icon ?? Brain,
          }))}
          onStrategyClick={(id) =>
            setStrategyIndex(
              activeStrategies.findIndex((strategy) => strategy.id === id),
            )
          }
        />
        <div className="bg-surface flex flex-1 flex-col gap-4 rounded-lg border p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-0",
                PHASE_STYLES[activePhase.intent].icon,
                {
                  "bg-intent-activate/20":
                    activePhase.intent === PhaseIntent.ACTIVATE,
                  "bg-intent-explore/20":
                    activePhase.intent === PhaseIntent.EXPLORE,
                  "bg-intent-apply/20":
                    activePhase.intent === PhaseIntent.APPLY,
                  "bg-intent-reflect/20":
                    activePhase.intent === PhaseIntent.REFLECT,
                  "bg-intent-transition/20":
                    activePhase.intent === PhaseIntent.TRANSITION,
                },
              )}
            >
              <activePhase.Icon className={cn("size-6")} />
            </div>
            <h2 className="text-foreground text-2xl font-bold">
              {activePhase.label}
            </h2>
          </div>
          {/* <p>
            {activePhase.objective}
          </p> */}
          <StrategyDetails
            strategy={
              activeStrategy
                ? {
                    ...activeStrategy,
                    phase: activePhase,
                  }
                : null
            }
          />
        </div>
      </div>
      <StrategyPanel
        open={isStrategyPanelOpen}
        onOpenChange={setIsStrategyPanelOpen}
        phaseTitle={activePhase.title}
        systemItems={systemStrategies.map((strategy) => ({
          sourceType: "system",
          sourceId: strategy.id,
          title: strategy.title,
        }))}
        savedItems={savedStrategies.map((strategy) => ({
          sourceType: "system",
          sourceId: strategy.id,
          title: strategy.title,
        }))}
        userItems={userStrategies.map((strategy) => ({
          sourceType: "user",
          sourceId: strategy.id,
          title: strategy.title,
        }))}
        disabledKeys={[]}
        onPick={() => {}}
      />
    </BeforeUnload>
  );
}

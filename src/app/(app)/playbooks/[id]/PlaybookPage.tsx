"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  AppSkeleton,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  useSidebar,
} from "@/components/ui";

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
import {
  usePlaybookPage,
  useAddPlaybookStrategy,
  useReorderStrategies,
  useRemovePlaybookStrategy,
  useUpdatePlaybookStrategy,
  useUpdatePlaybookPhases,
} from "@/features/playbooks/presentation/hooks";
import {
  useMySavedStrategiesWithDetails,
  useMyUserStrategies,
  useStrategies,
} from "@/features/strategies/hooks";
import { BeforeUnload } from "@/components/form";
import { useUser } from "@/components/providers";
import { useModals, usePendingMutations } from "@/hooks";
import { useModal } from "@/components/providers";
import {
  PlaybookPagePhaseDTO,
  PlaybookStrategyDetailDTO,
} from "@/features/playbooks/application/dto";
import { cn, timeAgo } from "@/lib/utils";
import { PencilEdit, Playbook } from "@/components/icons";
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
import { StrategyPanel } from "@/components/shared";
import { PLAYBOOK_MODAL_TYPES } from "@/features/playbooks/presentation/components/modals";
import { StrategyRef } from "@/lib/validation";
import { ErrorState } from "@/components/states";

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

function toPhaseIntentKey(
  intent: PhaseIntent,
): "activate" | "explore" | "apply" | "reflect" {
  if (
    intent === PhaseIntent.ACTIVATE ||
    intent === PhaseIntent.EXPLORE ||
    intent === PhaseIntent.APPLY ||
    intent === PhaseIntent.REFLECT
  ) {
    return intent;
  }

  return PhaseIntent.APPLY;
}

function toLegacyPhase(intent: PhaseIntent): "warmup" | "workout" | "closer" {
  if (intent === PhaseIntent.ACTIVATE) return "warmup";
  if (intent === PhaseIntent.EXPLORE) return "workout";
  if (intent === PhaseIntent.REFLECT) return "closer";
  return "workout";
}

interface PlaybookPageProps {
  playbookId: string;
  onBackClick?: () => void;
}
export default function PlaybookPage({
  playbookId,
  onBackClick,
}: PlaybookPageProps) {
  const {
    data: page,
    error,
    isLoading,
  } = usePlaybookPage({
    playbookId,
  });
  const { user } = useUser();
  const { openModal } = useModal();
  const { mutateAsync: addPlaybookStrategy } = useAddPlaybookStrategy();
  const { mutateAsync: reorderStrategies } = useReorderStrategies();
  const { mutateAsync: removePlaybookStrategy } = useRemovePlaybookStrategy();
  const { mutateAsync: updatePlaybookStrategy } = useUpdatePlaybookStrategy();
  const { data: userStrategies = [] } = useMyUserStrategies(user.id);
  const [isStrategyPanelOpen, setIsStrategyPanelOpen] = useState(false);
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
    if (!page) return [];
    const strategiesHavePhaseLinks = page.strategies.some(
      (strategy) => strategy.playbookPhaseId,
    );

    if (page.playbook.phases.length > 0) {
      return page.playbook.phases.map((phase) => {
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
  }, [page, phaseEdits]);
  const metadata: { label: string; value: string }[] = useMemo(() => {
    if (!page) return [];
    return [
      page.playbook.creator
        ? {
            label: "Created by",
            value: page.playbook.creator.displayName,
          }
        : null,
      page.playbook.updatedAt &&
      page.playbook.updatedAt.toISOString() !==
        page.playbook.createdAt.toISOString()
        ? {
            label: "Updated",
            value: timeAgo(page.playbook.updatedAt?.toISOString()),
          }
        : null,
      {
        label: "",
        value: timeAgo(page.playbook.createdAt?.toISOString()),
      },
    ].filter(Boolean) as { label: string; value: string }[];
  }, [page]);
  const isPhaseDirty = Object.keys(phaseEdits).length > 0;
  const { data: systemStrategies = [] } = useStrategies();

  const [isEditingPhaseTitle, setIsEditingPhaseTitle] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const activePhase = phases[phaseIndex] ?? phases[0];
  const activeStrategies = activePhase?.strategies ?? [];
  const activeStrategy = activeStrategies[strategyIndex] ?? null;
  const { mutateAsync: updatePlaybookPhases } = useUpdatePlaybookPhases();
  const {
    modals: { "session:create": createSessionModal },
  } = useModals();
  const strategySourceByKey = useMemo(() => {
    const entries = [
      ...systemStrategies.map(
        (strategy) => [`system:${strategy.id}`, strategy] as const,
      ),
      ...savedStrategies.map(
        (strategy) => [`system:${strategy.id}`, strategy] as const,
      ),
      ...userStrategies.map(
        (strategy) => [`user:${strategy.id}`, strategy] as const,
      ),
    ];
    return new Map(entries);
  }, [savedStrategies, systemStrategies, userStrategies]);
  const handleSave = async () => {
    try {
      if (!page) return;
      setIsSavingWorkspace(true);
      const updates: Promise<unknown>[] = [];
      if (isPhaseDirty && page.playbook.phases.length > 0) {
        updates.push(
          updatePlaybookPhases({
            playbookId: page.playbook.id,
            phases: phases.map((phase, position) => ({
              id: phase.id,
              intentKey: toPhaseIntentKey(phase.intent),
              title: phase.title,
              intent: phase.intent,
              position,
            })),
          }),
        );
      }
      await Promise.all(updates);
      setPhaseEdits({});
    } catch {
    } finally {
      setIsSavingWorkspace(false);
    }
  };
  const handleAddStrategy = async (ref: StrategyRef) => {
    if (!activePhase || !page) return;
    const source = strategySourceByKey.get(`${ref.sourceType}:${ref.sourceId}`);
    if (!source) return;

    await addPlaybookStrategy({
      playbookId: page.playbook.id,
      playbookPhaseId: activePhase.id,
      title: source.title,
      cardSlug:
        source.slug ??
        source.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      category: source.category ?? "strategy",
      steps: source.steps ?? [],
      description: source.description ?? "",
      phase: toLegacyPhase(activePhase.intent),
      position: activeStrategies.length,
      sourceId: source.id,
      sourceType: ref.sourceType,
    });
  };
  const handleReorderPhaseStrategies = async (
    phaseId: string,
    reordered: Array<
      Pick<
        (typeof activeStrategies)[number],
        "id" | "title" | "phase" | "playbookPhaseId"
      >
    >,
  ) => {
    if (!page) return;
    await reorderStrategies({
      playbookId: page.playbook.id,
      phaseId,
      strategies: reordered,
    });
  };
  const handleReplaceStrategy = (strategy: PlaybookStrategyDetailDTO) => {
    if (!page) return;
    openModal(PLAYBOOK_MODAL_TYPES.REPLACE_STRATEGY, {
      strategyToReplace: strategy,
      playbookId: page.playbook.id,
      onSubmit: async (_strategyToReplace, newStrategy) => {
        await updatePlaybookStrategy({
          playbookId: page.playbook.id,
          strategyId: strategy.id,
          data: {
            title: newStrategy.title,
            cardSlug: newStrategy.slug,
            category: newStrategy.category,
            steps: newStrategy.steps,
            description: newStrategy.description ?? "",
            sourceId: newStrategy.id,
            sourceType: "system",
          },
        });
      },
    });
  };
  async function handleRemoveStrategy(strategy: PlaybookStrategyDetailDTO) {
    if (!page) return;

    await removePlaybookStrategy({
      playbookId: page.playbook.id,
      strategyId: strategy.id,
    });
    const remaining = activeStrategies.filter(
      (item) => item.id !== strategy.id,
    );
    if (remaining.length > 0) {
      await handleReorderPhaseStrategies(
        activePhase.id,
        remaining as typeof activeStrategies,
      );
    }
  }
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
  if (isLoading) {
    return <AppSkeleton />;
  }
  if (error) {
    return <ErrorState variant="card" message={error.message} />;
  }
  if (!page) {
    return <ErrorState variant="card" message="Pag>e not found" />;
  }
  return (
    <BeforeUnload disabled={!isPhaseDirty}>
      <header className="header h-32">
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
              <ItemTitle
                className={cn(
                  "text-lg font-semibold",
                  "line-clamp-2 max-w-[85%] flex-1 truncate text-lg font-semibold",
                )}
              >
                {page.playbook.title}
              </ItemTitle>
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
            <ItemDescription className="text-xs">
              <span className="text-muted-foreground text-sm font-normal">
                {page.playbook.topic}
              </span>
              {metadata.map((item, index) => (
                <span
                  key={item.label}
                  className="text-muted-foreground text-sm font-normal"
                >
                  {index > 0 ? " • " : " • "} {item.label} {item.value}
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
              disabled={!isPhaseDirty || isUpdating || isSavingWorkspace}
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
      <div className="secondary-header">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-full border-0",
              PHASE_STYLES[activePhase.intent].icon,
              {
                "bg-intent-activate/20":
                  activePhase.intent === PhaseIntent.ACTIVATE,
                "bg-intent-explore/20":
                  activePhase.intent === PhaseIntent.EXPLORE,
                "bg-intent-apply/20": activePhase.intent === PhaseIntent.APPLY,
                "bg-intent-reflect/20":
                  activePhase.intent === PhaseIntent.REFLECT,
                "bg-intent-transition/20":
                  activePhase.intent === PhaseIntent.TRANSITION,
              },
            )}
          >
            <activePhase.Icon strokeWidth={2.5} className={cn("size-4.5")} />
          </div>

          {isEditingPhaseTitle && activePhase.id === activePhase.id ? (
            <InputGroup
              className={cn(
                "text-foreground h-10 w-fit rounded-lg border-transparent text-xl font-bold shadow-none",

                {
                  "focus-visible:ring-intent-activate":
                    activePhase.intent === PhaseIntent.ACTIVATE,
                  "focus-visible:ring-intent-explore":
                    activePhase.intent === PhaseIntent.EXPLORE,
                  "focus-visible:ring-intent-apply":
                    activePhase.intent === PhaseIntent.APPLY,
                  "focus-visible:ring-intent-reflect":
                    activePhase.intent === PhaseIntent.REFLECT,
                },
              )}
            >
              <InputGroupInput
                aria-label={`${activePhase.label} phase title`}
                value={activePhase.label}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) =>
                  updatePhaseTitle(activePhase.id, event.target.value)
                }
              />
              <InputGroupButton
                onClick={() => setIsEditingPhaseTitle(false)}
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "hover:bg-muted-foreground/10 mr-1",
                  PHASE_STYLES[activePhase.intent].icon,
                )}
              >
                <Check strokeWidth={3} className="size-5" />
              </InputGroupButton>
            </InputGroup>
          ) : (
            <div className="flex items-center gap-2">
              <h2
                className={cn(
                  "line-clamp-1 w-full max-w-full truncate text-xl font-bold",
                )}
              >
                {activePhase.label}
              </h2>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditingPhaseTitle(true)}
              >
                <PencilEdit />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-row gap-4 px-6 py-4">
        <div className="bg-surface flex flex-col justify-center gap-6 rounded-lg border shadow-xs">
          {phases.map((phase) => (
            <div key={phase.id} className="relative w-full">
              {phase.id === activePhase.id && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 left-0 h-4.5 w-2.5 -translate-y-1/2 rounded-r-full",
                    {
                      "bg-intent-activate":
                        phase.intent === PhaseIntent.ACTIVATE,
                      "bg-intent-explore": phase.intent === PhaseIntent.EXPLORE,
                      "bg-intent-apply": phase.intent === PhaseIntent.APPLY,
                      "bg-intent-reflect": phase.intent === PhaseIntent.REFLECT,
                      "bg-intent-transition":
                        phase.intent === PhaseIntent.TRANSITION,
                    },
                  )}
                />
              )}
              <div className="px-4">
                <div
                  onClick={() => {
                    if (phase.id !== activePhase.id) {
                      setIsEditingPhaseTitle(false);
                    }
                    setPhaseIndex(phases.findIndex((p) => p.id === phase.id));
                  }}
                  tabIndex={0}
                  className={cn(
                    "group/phase relative flex size-13 cursor-pointer items-center justify-center overflow-hidden rounded-lg p-2 shadow-md transition-all duration-200 hover:scale-107",
                    PHASE_STYLES[phase.intent].card,
                    activePhase?.id === phase.id &&
                      PHASE_STYLES[phase.intent].active,
                  )}
                >
                  <phase.Icon
                    className="text-primary-foreground"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <StrategyListPanel
          selectedStrategyId={activeStrategies[strategyIndex]?.id ?? null}
          phaseId={activePhase.id}
          onAddStrategyClick={() => setIsStrategyPanelOpen(true)}
          strategies={activeStrategies.map((strategy) => ({
            title: strategy.title,
            id: strategy.id,
            playbookPhaseId: activePhase.id,
            duration: "10 min",
            phase: activePhase?.intent ?? PhaseIntent.ACTIVATE,
            Icon: activePhase?.Icon ?? Brain,
          }))}
          onReorder={handleReorderPhaseStrategies}
          onStrategyClick={(id) =>
            setStrategyIndex(
              activeStrategies.findIndex((strategy) => strategy.id === id),
            )
          }
          onReplaceStrategyClick={(id) => {
            const strategy = activeStrategies.find((item) => item.id === id);
            if (strategy) {
              handleReplaceStrategy(strategy);
            }
          }}
          onRemoveStrategyClick={(id) => {
            const strategy = activeStrategies.find((item) => item.id === id);
            if (strategy) {
              handleRemoveStrategy(strategy);
            }
          }}
        />
        <div className="bg-surface flex flex-1 flex-col gap-4 rounded-lg border p-5 shadow-xs">
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
        disabledKeys={activeStrategies.flatMap((strategy) =>
          strategy.sourceType && strategy.sourceId
            ? [`${strategy.sourceType}:${strategy.sourceId}`]
            : [],
        )}
        onPick={handleAddStrategy}
      />
    </BeforeUnload>
  );
}

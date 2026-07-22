import type { Session } from "@/features/sessions/domain";
import type { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { PHASE_INTENT_ICONS } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { PhaseIntent as PhaseIntentEnum } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { timeAgo } from "@/lib/utils";
import type {
  GetPlaybookPageOutput,
  PlaybookStrategyDetailDTO,
} from "../../application/dto";
import {
  toLegacyPhase as domainToLegacyPhase,
  toPhaseIntentKey as domainToPhaseIntentKey,
} from "../../domain/phase-intent.mapping";
import type {
  PlaybookWorkspaceMetadataItem,
  PlaybookWorkspacePhase,
  PlaybookWorkspacePhaseDraft,
  PlaybookWorkspaceSource,
  PlaybookWorkspaceSourceMap,
  PlaybookWorkspaceStrategy,
  PlaybookWorkspaceStrategyDraft,
} from "./playbook-workspace.types";

/**
 * Compatibility map between the newer phase-intent vocabulary and the legacy
 * strings still found on some strategy rows.
 */
const legacyPhaseIntentMap: Record<string, PhaseIntent> = {
  warmup: PhaseIntentEnum.ACTIVATE,
  workout: PhaseIntentEnum.APPLY,
  closer: PhaseIntentEnum.REFLECT,
  activate: PhaseIntentEnum.ACTIVATE,
  explore: PhaseIntentEnum.EXPLORE,
  apply: PhaseIntentEnum.APPLY,
  reflect: PhaseIntentEnum.REFLECT,
};

export function getPhaseIntentKey(
  phase: GetPlaybookPageOutput["playbook"]["phases"][number],
): PhaseIntent {
  return (phase.intent.key as PhaseIntent) ?? PhaseIntentEnum.ACTIVATE;
}

export function getStrategyIntent(
  strategy: PlaybookStrategyDetailDTO,
): PhaseIntent {
  return legacyPhaseIntentMap[strategy.phase] ?? PhaseIntentEnum.ACTIVATE;
}
export function toPhaseIntentKey(
  intent: PhaseIntent,
): "activate" | "explore" | "apply" | "reflect" {
  return domainToPhaseIntentKey(intent);
}

export function toLegacyPhase(
  intent: PhaseIntent,
): "warmup" | "workout" | "closer" {
  return domainToLegacyPhase(intent);
}

export function formatMinutes(
  minutes: number | null | undefined,
): string | null {
  if (minutes == null) return null;
  return `${minutes} min`;
}

export function buildStrategyDraft(
  strategy: Pick<
    PlaybookStrategyDetailDTO,
    "title" | "steps" | "facilitatorNotes" | "estimatedMinutes"
  >,
): PlaybookWorkspaceStrategyDraft {
  return {
    // Playbook-instance title override; catalog source title stays on sourceId/sourceType.
    title: strategy.title,
    steps: [...strategy.steps],
    facilitatorNotes: strategy.facilitatorNotes ?? "",
    estimatedMinutes:
      strategy.estimatedMinutes != null
        ? String(strategy.estimatedMinutes)
        : "",
  };
}

export function strategyDraftsEqual(
  left: PlaybookWorkspaceStrategyDraft | null,
  right: PlaybookWorkspaceStrategyDraft | null,
): boolean {
  if (!left || !right) return left === right;
  return JSON.stringify(left) === JSON.stringify(right);
}

/**
 * Builds the editable phase list from server page data + local drafts.
 * phaseOrder, when set, overrides server position until Save clears it.
 */
export function buildPlaybookWorkspaceModel(
  page: GetPlaybookPageOutput | undefined,
  phaseDrafts: Record<string, PlaybookWorkspacePhaseDraft>,
  phaseOrder: string[] | null = null,
): PlaybookWorkspacePhase[] {
  if (!page) return [];

  // Newer rows link strategies directly to a playbook phase. Older rows still
  // need to be grouped via the legacy phase string until the migration is
  // complete, so the selector supports both shapes.
  const strategiesHavePhaseLinks = page.strategies.some(
    (strategy) => strategy.playbookPhaseId,
  );

  const phases = page.playbook.phases.map((phase) => {
    const intent = getPhaseIntentKey(phase);
    const edit = phaseDrafts[phase.id];
    const title = edit?.title ?? phase.title;
    const objective = edit?.objective ?? phase.objective;
    const nextIntent = edit?.intent ?? intent;
    const estimatedMinutes = edit?.estimatedMinutes ?? phase.estimatedMinutes;

    return {
      id: phase.id,
      title,
      objective,
      intent: nextIntent,
      position: phase.position,
      estimatedMinutes,
      Icon: PHASE_INTENT_ICONS[nextIntent],
      strategies: page.strategies.filter((strategy) => {
        if (strategiesHavePhaseLinks) {
          return strategy.playbookPhaseId === phase.id;
        }

        return getStrategyIntent(strategy) === intent;
      }),
      sourcePhase: phase,
    };
  });

  if (!phaseOrder || phaseOrder.length === 0) {
    return phases;
  }

  const byId = new Map(phases.map((phase) => [phase.id, phase]));
  const ordered: PlaybookWorkspacePhase[] = [];
  const seen = new Set<string>();

  for (const phaseId of phaseOrder) {
    const phase = byId.get(phaseId);
    if (!phase) continue;
    ordered.push({ ...phase, position: ordered.length });
    seen.add(phaseId);
  }

  // Newly added phases (not yet in the local order) append to the end.
  for (const phase of phases) {
    if (seen.has(phase.id)) continue;
    ordered.push({ ...phase, position: ordered.length });
  }

  return ordered;
}

export function selectActivePhase(
  phases: PlaybookWorkspacePhase[],
  selectedPhaseId: string | null,
): PlaybookWorkspacePhase | null {
  if (phases.length === 0) return null;
  return phases.find((phase) => phase.id === selectedPhaseId) ?? phases[0];
}

export function selectActiveStrategy(
  activePhase: PlaybookWorkspacePhase | null,
  selectedStrategyId: string | null,
): PlaybookWorkspaceStrategy | null {
  if (!activePhase) return null;

  const strategy =
    activePhase.strategies.find((item) => item.id === selectedStrategyId) ??
    activePhase.strategies[0];

  return strategy
    ? {
        ...strategy,
        legacyPhase: strategy.phase,
        phase: activePhase,
      }
    : null;
}

export function selectHeaderMetadata(
  playbook: GetPlaybookPageOutput["playbook"] | undefined,
): PlaybookWorkspaceMetadataItem[] {
  if (!playbook) return [];

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
          value: timeAgo(playbook.updatedAt.toISOString()),
        }
      : null,
    {
      label: "",
      value: timeAgo(playbook.createdAt.toISOString()),
    },
  ].filter(Boolean) as PlaybookWorkspaceMetadataItem[];
}

export function selectStrategySourceMap(
  systemStrategies: PlaybookWorkspaceSource[],
  savedStrategies: PlaybookWorkspaceSource[],
  userStrategies: PlaybookWorkspaceSource[],
): PlaybookWorkspaceSourceMap {
  // Saved strategies still reuse the system prefix because they resolve from
  // the same catalog table today; user-authored strategies get their own key
  // space to avoid collisions.
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
}

export function selectIsFavorite(
  playbookId: string | undefined,
  favoritePlaybooks: string[],
): boolean {
  return Boolean(playbookId && favoritePlaybooks.includes(playbookId));
}

export function selectHasSession(
  playbookId: string | undefined,
  sessions: Session[],
): boolean {
  return Boolean(
    playbookId && sessions.some((session) => session.id === playbookId),
  );
}

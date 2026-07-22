import { toast } from "sonner";
import type { StrategyRef } from "@/lib/validation";
import type {
  AddPlaybookPhaseInput,
  AddPlaybookStrategyInput,
  GetPlaybookPageOutput,
  PlaybookPhaseDTO,
  UpdatePlaybookPhasesInput,
} from "../../application/dto";
import type { PlaybookStrategyUpdate } from "../../domain";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { phaseIntentCatalog } from "@/features/reference-data/phase-intents/infrastructure/catalogs/phase-intent";
import {
  toLegacyPhase,
  toPhaseIntentKey,
} from "./playbook-workspace.selectors";
import type {
  PlaybookWorkspaceDispatch,
  PlaybookWorkspacePhase,
  PlaybookWorkspaceSourceMap,
  PlaybookWorkspaceState,
} from "./playbook-workspace.types";

type ReorderStrategyInput = {
  playbookId: string;
  phaseId: string;
  strategies: Array<{
    id: string;
    title: string;
    phase: string;
    playbookPhaseId?: string | null;
  }>;
};

type UpdateStrategyInput = {
  playbookId: string;
  strategyId: string;
  data: PlaybookStrategyUpdate;
};

type FavoriteInput = {
  playbookId: string;
  userId: string;
};

type CreateCommandsArgs = {
  playbook: GetPlaybookPageOutput["playbook"] | undefined;
  userId: string;
  state: PlaybookWorkspaceState;
  dispatch: PlaybookWorkspaceDispatch;
  phases: PlaybookWorkspacePhase[];
  activePhase: PlaybookWorkspacePhase | null;
  activeStrategyId: string | null;
  activeStrategies: GetPlaybookPageOutput["strategies"];
  strategySourceByKey: PlaybookWorkspaceSourceMap;
  addPlaybookStrategy: (input: AddPlaybookStrategyInput) => Promise<unknown>;
  addPlaybookPhase: (input: AddPlaybookPhaseInput) => Promise<PlaybookPhaseDTO>;
  reorderStrategies: (input: ReorderStrategyInput) => Promise<unknown>;
  removePlaybookStrategy: (input: {
    playbookId: string;
    strategyId: string;
  }) => Promise<unknown>;
  updatePlaybookStrategy: (input: UpdateStrategyInput) => Promise<unknown>;
  updatePlaybookPhases: (input: UpdatePlaybookPhasesInput) => Promise<unknown>;
  favoritePlaybook: (input: FavoriteInput) => Promise<unknown>;
  unfavoritePlaybook: (input: FavoriteInput) => Promise<unknown>;
  deletePlaybook: (playbookId: string) => void;
  openCreateSession: (playbook: GetPlaybookPageOutput["playbook"]) => void;
  openDeleteConfirmation: (config: {
    title: string;
    description: string;
    onConfirm: () => void;
  }) => void;
};

function validateWorkspacePhases(
  phases: PlaybookWorkspacePhase[],
): string | null {
  const invalidPhase = phases.find((phase) => phase.title.trim().length === 0);
  if (!invalidPhase) {
    return null;
  }

  return "Phase title cannot be empty.";
}

function validateStrategyTitle(value: string): string | null {
  if (value.trim().length === 0) {
    return "Strategy title cannot be empty.";
  }
  return null;
}

function validateStrategyEstimatedMinutes(value: string): string | null {
  const trimmed = value.trim();

  if (
    trimmed !== "" &&
    (!Number.isFinite(Number(trimmed)) || Number(trimmed) < 0)
  ) {
    return "Strategy duration must be a non-negative number.";
  }

  return null;
}

function normalizeStrategyDraft(state: PlaybookWorkspaceState) {
  if (!state.strategyDraft) {
    return null;
  }

  return {
    title: state.strategyDraft.title.trim(),
    steps: [...state.strategyDraft.steps],
    facilitatorNotes: state.strategyDraft.facilitatorNotes,
    estimatedMinutes: state.strategyDraft.estimatedMinutes.trim(),
  };
}

function intentFromKey(
  intentKey: "activate" | "explore" | "apply" | "reflect",
): PhaseIntent {
  switch (intentKey) {
    case "activate":
      return PhaseIntent.ACTIVATE;
    case "explore":
      return PhaseIntent.EXPLORE;
    case "apply":
      return PhaseIntent.APPLY;
    case "reflect":
      return PhaseIntent.REFLECT;
    default:
      return PhaseIntent.ACTIVATE;
  }
}

/**
 * Central command factory for the playbook workspace. Some actions are purely
 * local reducer updates, while others persist immediately through server
 * actions and optimistic cache updates.
 */
export function createPlaybookWorkspaceCommands({
  playbook,
  userId,
  state,
  dispatch,
  phases,
  activePhase,
  activeStrategyId,
  activeStrategies,
  strategySourceByKey,
  addPlaybookStrategy,
  addPlaybookPhase,
  reorderStrategies,
  removePlaybookStrategy,
  updatePlaybookStrategy,
  updatePlaybookPhases,
  favoritePlaybook,
  unfavoritePlaybook,
  deletePlaybook,
  openCreateSession,
  openDeleteConfirmation,
}: CreateCommandsArgs) {
  return {
    selectPhase(phaseId: string) {
      dispatch({ type: "selectPhase", phaseId });
    },
    selectStrategy(strategyId: string | null) {
      dispatch({ type: "selectStrategy", strategyId });
    },
    setEditingPhase(value: boolean) {
      dispatch({ type: "setEditingPhase", value });
    },
    setStrategyPanelOpen(value: boolean) {
      dispatch({ type: "setStrategyPanelOpen", value });
    },
    updatePhaseTitle(phaseId: string, title: string) {
      const currentPhase = phases.find((phase) => phase.id === phaseId);
      if (!currentPhase) return;

      dispatch({
        type: "upsertPhaseDraft",
        phaseId,
        draft: {
          title,
          intent: state.phaseDrafts[phaseId]?.intent ?? currentPhase.intent,
          objective:
            state.phaseDrafts[phaseId]?.objective ?? currentPhase.objective,
          estimatedMinutes:
            state.phaseDrafts[phaseId]?.estimatedMinutes ??
            currentPhase.estimatedMinutes,
        },
      });
    },
    updatePhaseIntent(
      phaseId: string,
      intentKey: "activate" | "explore" | "apply" | "reflect",
    ) {
      const currentPhase = phases.find((phase) => phase.id === phaseId);
      if (!currentPhase) return;
      dispatch({
        type: "upsertPhaseDraft",
        phaseId,
        draft: {
          intent: intentFromKey(intentKey),
          title: state.phaseDrafts[phaseId]?.title ?? currentPhase.title,
          objective:
            state.phaseDrafts[phaseId]?.objective ?? currentPhase.objective,
          estimatedMinutes:
            state.phaseDrafts[phaseId]?.estimatedMinutes ??
            currentPhase.estimatedMinutes,
        },
      });
    },
    updatePhaseEstimatedMinutes(
      phaseId: string,
      estimatedMinutes: number | null,
    ) {
      const currentPhase = phases.find((phase) => phase.id === phaseId);
      if (!currentPhase) return;

      // Guard against NaN from number inputs mid-edit (e.g. clearing then typing).
      const nextMinutes =
        estimatedMinutes != null && Number.isFinite(estimatedMinutes)
          ? estimatedMinutes
          : null;

      dispatch({
        type: "upsertPhaseDraft",
        phaseId,
        draft: {
          title: state.phaseDrafts[phaseId]?.title ?? currentPhase.title,
          intent: state.phaseDrafts[phaseId]?.intent ?? currentPhase.intent,
          estimatedMinutes: nextMinutes,
          objective:
            state.phaseDrafts[phaseId]?.objective ?? currentPhase.objective,
        },
      });
    },
    clearPhaseDraft() {
      dispatch({ type: "clearPhaseDrafts" });
    },
    /**
     * Persist a new phase immediately, then select it.
     * Positioning is handled afterward via local phase-rail reorder + Save.
     */
    async addPlaybookPhase(
      intentKey: "activate" | "explore" | "apply" | "reflect",
    ) {
      if (!playbook) return;

      const catalogEntry = phaseIntentCatalog.find(
        (intent) => intent.key === intentKey,
      );
      const title = catalogEntry?.label ?? "New Phase";

      try {
        const created = await addPlaybookPhase({
          playbookId: playbook.id,
          title,
          position: phases.length,
          estimatedMinutes: null,
          description: null,
          objective: null,
          intent: intentFromKey(intentKey),
        });

        dispatch({ type: "selectPhase", phaseId: created.id });
        dispatch({ type: "setEditingPhase", value: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add phase.";
        dispatch({ type: "setWorkspaceError", value: message });
        toast.error(message);
      }
    },
    /**
     * Local-only reorder. Positions are written on saveWorkspace.
     */
    reorderPhases(phaseIds: string[]) {
      dispatch({ type: "reorderPhases", phaseIds });
    },
    updateStrategyTitle(value: string) {
      dispatch({ type: "setStrategyTitle", value });
    },
    updateStrategyStep(stepIndex: number, value: string) {
      dispatch({ type: "updateStrategyStep", stepIndex, value });
    },
    removeStrategyStep(stepIndex: number) {
      dispatch({ type: "removeStrategyStep", stepIndex });
    },
    addStrategyStep() {
      dispatch({ type: "addStrategyStep" });
    },
    updateStrategyNotes(value: string) {
      dispatch({ type: "setStrategyNotes", value });
    },
    updateStrategyEstimatedMinutes(value: string) {
      dispatch({ type: "setStrategyEstimatedMinutes", value });
    },
    resetStrategyDraft() {
      dispatch({ type: "resetStrategyDraft" });
    },
    async saveWorkspace() {
      if (!playbook) return;

      const validationMessage = validateWorkspacePhases(phases);
      if (validationMessage) {
        dispatch({ type: "setWorkspaceError", value: validationMessage });
        toast.error(validationMessage);
        return;
      }

      dispatch({ type: "setSavingWorkspace", value: true });
      dispatch({ type: "setWorkspaceError", value: null });

      try {
        if (phases.length > 0) {
          await updatePlaybookPhases({
            playbookId: playbook.id,
            phases: phases.map((phase, position) => ({
              id: phase.id,
              intentKey: toPhaseIntentKey(phase.intent),
              title: phase.title,
              position,
              objective: phase.objective,
              estimatedMinutes: phase.estimatedMinutes,
            })),
          });
        }

        dispatch({ type: "clearPhaseDrafts" });
        dispatch({ type: "setEditingPhase", value: false });
      } catch (error) {
        console.error(error);
        dispatch({
          type: "setWorkspaceError",
          value:
            error instanceof Error
              ? error.message
              : "Failed to save playbook changes.",
        });
      } finally {
        dispatch({ type: "setSavingWorkspace", value: false });
      }
    },
    async addStrategy(ref: StrategyRef) {
      if (!playbook || !activePhase) return;

      const source = strategySourceByKey.get(
        `${ref.sourceType}:${ref.sourceId}`,
      );
      if (!source) return;

      // The workspace stores a playbook-specific copy of the selected strategy
      // so titles, steps, notes, and timing can diverge from the source catalog.
      await addPlaybookStrategy({
        playbookId: playbook.id,
        playbookPhaseId: activePhase.id,
        title: source.title,
        slug:
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
        facilitatorNotes: null,
        estimatedMinutes: null,
      });
    },
    async reorderPhaseStrategies(
      strategies: ReorderStrategyInput["strategies"],
    ) {
      if (!playbook || !activePhase) return;

      await reorderStrategies({
        playbookId: playbook.id,
        phaseId: activePhase.id,
        strategies,
      });
    },
    async removeStrategy(strategyId: string) {
      if (!playbook || !activePhase) return;

      await removePlaybookStrategy({
        playbookId: playbook.id,
        strategyId,
      });

      const remaining = activeStrategies.filter(
        (item) => item.id !== strategyId,
      );
      if (remaining.length > 0) {
        // Removing a strategy leaves a gap in the phase-local ordering, so the
        // remaining strategies are immediately compacted back to 0..n-1.
        await reorderStrategies({
          playbookId: playbook.id,
          phaseId: activePhase.id,
          strategies: remaining.map((strategy) => ({
            id: strategy.id,
            title: strategy.title,
            phase: strategy.phase,
            playbookPhaseId: strategy.playbookPhaseId,
          })),
        });
      }

      if (activeStrategyId === strategyId) {
        dispatch({ type: "selectStrategy", strategyId: null });
      }
    },
    async saveStrategyDraft() {
      if (!playbook || !activeStrategyId || !state.strategyDraft) return;

      const titleError = validateStrategyTitle(state.strategyDraft.title);
      if (titleError) {
        dispatch({ type: "setStrategySaveError", value: titleError });
        return;
      }

      const validationMessage = validateStrategyEstimatedMinutes(
        state.strategyDraft.estimatedMinutes,
      );
      if (validationMessage) {
        dispatch({ type: "setStrategySaveError", value: validationMessage });
        return;
      }

      const normalizedDraft = normalizeStrategyDraft(state);
      if (!normalizedDraft) return;

      dispatch({ type: "setSavingStrategy", value: true });
      dispatch({ type: "setStrategySaveError", value: null });

      try {
        await updatePlaybookStrategy({
          playbookId: playbook.id,
          strategyId: activeStrategyId,
          data: {
            title: normalizedDraft.title,
            steps: normalizedDraft.steps,
            facilitatorNotes:
              normalizedDraft.facilitatorNotes.trim().length > 0
                ? normalizedDraft.facilitatorNotes
                : null,
            estimatedMinutes:
              normalizedDraft.estimatedMinutes === ""
                ? null
                : Number(normalizedDraft.estimatedMinutes),
          },
        });

        dispatch({
          type: "setStrategyDraftSnapshot",
          draft: normalizedDraft,
        });
      } catch (error) {
        dispatch({
          type: "setStrategySaveError",
          value:
            error instanceof Error
              ? error.message
              : "Failed to save strategy changes.",
        });
      } finally {
        dispatch({ type: "setSavingStrategy", value: false });
      }
    },
    async toggleFavorite() {
      if (!playbook) return;

      const nextFavorite = !state.isFavorite;
      dispatch({ type: "syncFavorite", value: nextFavorite });

      try {
        if (nextFavorite) {
          await favoritePlaybook({ playbookId: playbook.id, userId });
        } else {
          await unfavoritePlaybook({ playbookId: playbook.id, userId });
        }
      } catch {
        dispatch({ type: "syncFavorite", value: !nextFavorite });
      }
    },
    createSession() {
      if (!playbook) return;
      openCreateSession(playbook);
    },
    confirmDeletePlaybook() {
      if (!playbook) return;

      openDeleteConfirmation({
        title: "Delete Playbook",
        description: "Are you sure you want to delete this playbook?",
        onConfirm: () => deletePlaybook(playbook.id),
      });
    },
  };
}

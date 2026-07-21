import type { PlaybookWorkspaceState } from "./playbook-workspace.types";
import type { PlaybookWorkspaceAction } from "./playbook-workspace.types";

export function createInitialPlaybookWorkspaceState(): PlaybookWorkspaceState {
  return {
    selectedPhaseId: null,
    selectedStrategyId: null,
    isEditingPhase: false,
    isStrategyPanelOpen: false,
    isSavingWorkspace: false,
    isSavingStrategy: false,
    workspaceError: null,
    strategySaveError: null,
    phaseDrafts: {},
    phaseOrder: null,
    strategyDraft: null,
    strategyBaseline: null,
    isFavorite: false,
  };
}

export function playbookWorkspaceReducer(
  state: PlaybookWorkspaceState,
  action: PlaybookWorkspaceAction,
): PlaybookWorkspaceState {
  switch (action.type) {
    case "selectPhase":
      return {
        ...state,
        selectedPhaseId: action.phaseId,
        selectedStrategyId: null,
        isEditingPhase: false,
        workspaceError: null,
      };
    case "selectStrategy":
      return {
        ...state,
        selectedStrategyId: action.strategyId,
        strategySaveError: null,
      };
    case "setEditingPhase":
      return {
        ...state,
        isEditingPhase: action.value,
      };
    case "setStrategyPanelOpen":
      return {
        ...state,
        isStrategyPanelOpen: action.value,
      };
    case "setSavingWorkspace":
      return {
        ...state,
        isSavingWorkspace: action.value,
      };
    case "setSavingStrategy":
      return {
        ...state,
        isSavingStrategy: action.value,
      };
    case "setWorkspaceError":
      return {
        ...state,
        workspaceError: action.value,
      };
    case "setStrategySaveError":
      return {
        ...state,
        strategySaveError: action.value,
      };
    case "syncFavorite":
      return {
        ...state,
        isFavorite: action.value,
      };
    case "upsertPhaseDraft":
      return {
        ...state,
        workspaceError: null,
        phaseDrafts: {
          ...state.phaseDrafts,
          [action.phaseId]: action.draft,
        },
      };
    case "clearPhaseDrafts":
      return {
        ...state,
        phaseDrafts: {},
        // Clear local reorder once server positions have been (or will be) saved.
        phaseOrder: null,
        workspaceError: null,
      };
    case "reorderPhases":
      return {
        ...state,
        workspaceError: null,
        phaseOrder: action.phaseIds,
      };
    case "setStrategyDraftSnapshot":
      return {
        ...state,
        strategyDraft: action.draft,
        strategyBaseline: action.draft,
        strategySaveError: null,
      };
    case "clearStrategyDraft":
      return {
        ...state,
        selectedStrategyId: null,
        strategyDraft: null,
        strategyBaseline: null,
        strategySaveError: null,
      };
    case "resetStrategyDraft":
      return {
        ...state,
        strategyDraft: state.strategyBaseline,
        strategySaveError: null,
      };
    case "updateStrategyStep":
      if (!state.strategyDraft) {
        return state;
      }
      return {
        ...state,
        strategySaveError: null,
        strategyDraft: {
          ...state.strategyDraft,
          steps: state.strategyDraft.steps.map((step, index) =>
            index === action.stepIndex ? action.value : step,
          ),
        },
      };
    case "removeStrategyStep":
      if (!state.strategyDraft) {
        return state;
      }
      return {
        ...state,
        strategySaveError: null,
        strategyDraft: {
          ...state.strategyDraft,
          steps: state.strategyDraft.steps.filter(
            (_, index) => index !== action.stepIndex,
          ),
        },
      };
    case "addStrategyStep":
      if (!state.strategyDraft) {
        return state;
      }
      return {
        ...state,
        strategySaveError: null,
        strategyDraft: {
          ...state.strategyDraft,
          steps: [...state.strategyDraft.steps, ""],
        },
      };
    case "setStrategyNotes":
      if (!state.strategyDraft) {
        return state;
      }
      return {
        ...state,
        strategySaveError: null,
        strategyDraft: {
          ...state.strategyDraft,
          facilitatorNotes: action.value,
        },
      };
    case "setStrategyEstimatedMinutes":
      if (!state.strategyDraft) {
        return state;
      }
      return {
        ...state,
        strategySaveError: null,
        strategyDraft: {
          ...state.strategyDraft,
          // Keep the raw string so controlled number inputs can show "" while editing.
          estimatedMinutes: action.value,
        },
      };
    case "setStrategyTitle":
      if (!state.strategyDraft) {
        return state;
      }
      return {
        ...state,
        strategySaveError: null,
        strategyDraft: {
          ...state.strategyDraft,
          title: action.value,
        },
      };
    default:
      return state;
  }
}

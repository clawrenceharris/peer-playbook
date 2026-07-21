import type { ComponentType, Dispatch } from "react";
import type { LucideProps } from "lucide-react";
import type {
  GetPlaybookPageOutput,
  PlaybookStrategyDetailDTO,
} from "../../application/dto";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

/**
 * Editable working copy of a playbook strategy instance.
 * Title is playbook-local (does not mutate the catalog source).
 * estimatedMinutes stays a string so number inputs can be cleared mid-edit.
 */
export type PlaybookWorkspaceStrategyDraft = {
  title: string;
  steps: string[];
  facilitatorNotes: string;
  estimatedMinutes: string;
};

export type PlaybookWorkspacePhaseDraft = {
  title: string;
  intent: PhaseIntent;
  objective: string | null;
  estimatedMinutes: number | null;
};

export type PlaybookWorkspacePhase = {
  id: string;
  title: string;
  intent: PhaseIntent;
  position: number;
  objective: string | null;
  estimatedMinutes: number | null;
  Icon: ComponentType<LucideProps>;
  strategies: PlaybookStrategyDetailDTO[];
  sourcePhase: GetPlaybookPageOutput["playbook"]["phases"][number];
};

export type PlaybookWorkspaceStrategy = Omit<
  PlaybookStrategyDetailDTO,
  "phase"
> & {
  phase: PlaybookWorkspacePhase;
  legacyPhase: PlaybookStrategyDetailDTO["phase"];
};

export type PlaybookWorkspaceMetadataItem = {
  label: string;
  value: string;
};

export type PlaybookWorkspaceState = {
  selectedPhaseId: string | null;
  selectedStrategyId: string | null;
  isEditingPhase: boolean;
  isStrategyPanelOpen: boolean;
  isSavingWorkspace: boolean;
  isSavingStrategy: boolean;
  workspaceError: string | null;
  strategySaveError: string | null;
  phaseDrafts: Record<string, PlaybookWorkspacePhaseDraft>;
  /**
   * Local phase order override. null means "use server order".
   * Reordering chips dirty the workspace until Save persists positions.
   */
  phaseOrder: string[] | null;
  strategyDraft: PlaybookWorkspaceStrategyDraft | null;
  strategyBaseline: PlaybookWorkspaceStrategyDraft | null;
  isFavorite: boolean;
};

export type PlaybookWorkspaceAction =
  | { type: "selectPhase"; phaseId: string | null }
  | { type: "selectStrategy"; strategyId: string | null }
  | { type: "setEditingPhase"; value: boolean }
  | { type: "setStrategyPanelOpen"; value: boolean }
  | { type: "setSavingWorkspace"; value: boolean }
  | { type: "setSavingStrategy"; value: boolean }
  | { type: "setWorkspaceError"; value: string | null }
  | { type: "setStrategySaveError"; value: string | null }
  | { type: "syncFavorite"; value: boolean }
  | {
      type: "upsertPhaseDraft";
      phaseId: string;
      draft: PlaybookWorkspacePhaseDraft;
    }
  | { type: "clearPhaseDrafts" }
  | { type: "reorderPhases"; phaseIds: string[] }
  | {
      type: "setStrategyDraftSnapshot";
      draft: PlaybookWorkspaceStrategyDraft | null;
    }
  | { type: "clearStrategyDraft" }
  | { type: "resetStrategyDraft" }
  | { type: "updateStrategyStep"; stepIndex: number; value: string }
  | { type: "removeStrategyStep"; stepIndex: number }
  | { type: "addStrategyStep" }
  | { type: "setStrategyNotes"; value: string }
  | { type: "setStrategyEstimatedMinutes"; value: string }
  | { type: "setStrategyTitle"; value: string };

export type PlaybookWorkspaceDispatch = Dispatch<PlaybookWorkspaceAction>;

export type PlaybookWorkspaceSource = {
  id: string;
  slug: string;
  title: string;
  description: string;
  steps: string[];
  phase: PhaseIntent;
  category: string;
};
export type PlaybookWorkspaceSourceMap = Map<string, PlaybookWorkspaceSource>;

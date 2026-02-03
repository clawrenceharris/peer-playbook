import type {
  CreateSessionFormValues,
  Session,
} from "@/features/sessions/domain";
import type {
  GeneratePlaybookFormValues,
  Playbook,
  PlaybookStrategy,
  PlaybookUpdate,
} from "@/features/playbooks/domain";
import type { Strategy } from "@/features/strategies/domain";
import { Profile } from "@/features/profile/domain";

/**
 * Base interface for all modal props
 * CRUD modals do NOT include isLoading - they handle it internally via usePendingMutations
 */
export interface ModalProps {
  [key: string]: unknown;
}

/**
 * Union type of all modal type strings
 */
export type ModalType =
  | "session:create"
  | "session:update"
  | "session:delete"
  | "profile:update"
  | "profile:delete"
  | "playbook:update"
  | "playbook:delete"
  | "playbook:replace-strategy"
  | "playbook:generate";

/**
 * State interface for ModalProvider
 */
export interface ModalState {
  type: ModalType | null;
  props: ModalProps | null;
}

// ============================================================================
// Session Modal Props
// ============================================================================

export interface CreateSessionModalProps extends ModalProps {
  onConfirm: (data: CreateSessionFormValues) => Promise<Session>;
  playbook?: Playbook | null;
}

export interface UpdateSessionModalProps extends ModalProps {
  sessionId: string;
  onConfirm: (
    sessionId: string,
    data: CreateSessionFormValues
  ) => Promise<Session>;
  onUpdateStatus?: (sessionId: string, status: Session["status"]) => void;
}

export interface DeleteSessionModalProps extends ModalProps {
  sessionId: string;
  onConfirm: (sessionId: string) => Promise<void>;
}

// ============================================================================
// Profile Modal Props
// ============================================================================

export interface UpdateProfileModalProps extends ModalProps {
  profileId: string;
  onConfirm: (data: {
    firstName?: string;
    lastName?: string;
  }) => Promise<Profile>;
}

export interface DeleteAccountModalProps extends ModalProps {
  onConfirm: () => Promise<void>;
}

// ============================================================================
// Playbook Modal Props
// ============================================================================

export interface UpdatePlaybookModalProps extends ModalProps {
  playbookId: string;
  onConfirm: (data: PlaybookUpdate) => Promise<Playbook>;
}

export interface DeletePlaybookModalProps extends ModalProps {
  playbookId: string;
  onConfirm: (playbookId: string) => Promise<void>;
}

export interface ReplaceStrategyModalProps extends ModalProps {
  strategyToReplace: PlaybookStrategy;
  playbookId: string;
  onConfirm: (
    strategyToReplace: PlaybookStrategy,
    newStrategy: Strategy
  ) => Promise<void>;
}

export interface GeneratePlaybookModalProps extends ModalProps {
  onConfirm: (data: GeneratePlaybookFormValues) => Promise<Playbook>;
}

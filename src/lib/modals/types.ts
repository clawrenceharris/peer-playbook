import type {
  CreateSessionFormValues,
  Session,
  UpdateSessionFormValues,
} from "@/features/sessions/domain";
import type {
  GeneratePlaybookFormValues,
  Playbook,
  PlaybookStrategy,
  PlaybookUpdate,
} from "@/features/playbooks/domain";
import type { Strategy } from "@/features/strategies/domain";
import type { ProfileDetailDTO } from "@/features/profile/application/dto";

/**
 * Base interface for all modal props
 * CRUD modals do NOT include isLoading - they handle it internally via usePendingMutations
 */

/**
 * Union type of all modal type strings
 */
export type ModalType =
  | "session:create"
  | "session:update"
  | "session:delete"
  | "profile:create"
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

export interface ModalProps {
  [key: string]: unknown;
  onError?: (error: string) => void;
  onCancel?: () => void;
  isAlert?: boolean;
}

// ============================================================================
// Session Modal Props
// ============================================================================

export interface CreateSessionModalProps extends ModalProps {
  onSuccess: (data: CreateSessionFormValues) => Promise<Session>;
  playbook?: Playbook | null;
}

export interface UpdateSessionModalProps extends ModalProps {
  sessionId: string;
  onSubmit: (
    sessionId: string,
    data: UpdateSessionFormValues,
  ) => Promise<Session>;
  onUpdateStatus?: (sessionId: string, status: Session["status"]) => void;
}

export interface DeleteSessionModalProps extends ModalProps {
  sessionId: string;
  onSubmit: (sessionId: string) => Promise<void>;
}

// ============================================================================
// Profile Modal Props
// ============================================================================
export interface CreateProfileModalProps extends ModalProps {
  userId: string;
  onSuccess: () => void;
}
export interface UpdateProfileModalProps extends ModalProps {
  profile: ProfileDetailDTO;
}

export interface DeleteAccountModalProps extends ModalProps {
  onConfirm: () => Promise<void>;
}

// ============================================================================
// Playbook Modal Props
// ============================================================================

export interface UpdatePlaybookModalProps extends ModalProps {
  playbookId: string;
  onSubmit: (data: PlaybookUpdate) => Promise<Playbook>;
}

export interface DeletePlaybookModalProps extends ModalProps {
  playbookId: string;
  onConfirm: (playbookId: string) => Promise<void>;
}

export interface ReplaceStrategyModalProps extends ModalProps {
  strategyToReplace: PlaybookStrategy;
  playbookId: string;
  onSubmit: (
    strategyToReplace: PlaybookStrategy,
    newStrategy: Strategy,
  ) => Promise<void>;
}

export interface GeneratePlaybookModalProps extends ModalProps {
  onSubmit: (data: GeneratePlaybookFormValues) => Promise<Playbook>;
}

export interface ConfirmationModalProps extends ModalProps {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
}

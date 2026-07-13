import type {
  Session,
  UpdateSessionFormValues,
} from "@/features/sessions/domain";
import type { Playbook, PlaybookStrategy } from "@/features/playbooks/domain";
import type { Strategy } from "@/features/strategies/domain";
import type { ProfileDetailDTO } from "@/features/profile/application/dto";
import { GeneratePlaybookFormValues, UpdatePlaybookFormValues } from "../validation";
import {
  PlaybookCardDTO,
  UpdatePlaybookResult,
} from "@/features/playbooks/application/dto";

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
  | "profile:create"
  | "profile:update"
  | "playbook:update"
  | "playbook:replace-strategy"
  | "playbook:generate"
  | "playbook:create"
  | "confirmation";

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
  playbook?: PlaybookCardDTO | null;
}

export interface UpdateSessionModalProps extends ModalProps {
  sessionId: string;
  onSubmit: (
    sessionId: string,
    data: UpdateSessionFormValues,
  ) => Promise<Session>;
  onUpdateStatus?: (sessionId: string, status: Session["status"]) => void;
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

// ============================================================================
// Playbook Modal Props
// ============================================================================

export interface CreatePlaybookModalProps extends ModalProps {
  userId: string;
}
export interface UpdatePlaybookModalProps extends ModalProps {
  playbookId: string;
  onSubmit: (data: UpdatePlaybookFormValues) => Promise<UpdatePlaybookResult>;
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

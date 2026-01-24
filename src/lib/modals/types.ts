import type { DefaultValues } from 'react-hook-form';
import type { CreateSessionInput, Session, SessionInsert } from '@/features/sessions/domain';
import type { GeneratePlaybookInput, PlaybookStrategy, PlaybookUpdate } from '@/features/playbooks/domain';
import type { Strategy } from '@/features/strategies/domain';

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
  | 'session:create'
  | 'session:update'
  | 'session:delete'
  | 'profile:update'
  | 'profile:delete'
  | 'playbook:update'
  | 'playbook:delete'
  | 'playbook:replace-strategy'
  | 'playbook:generate';

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
  onConfirm: (data: CreateSessionInput) => Promise<void> | void;
  defaultValues?: DefaultValues<SessionInsert>;
}

export interface UpdateSessionModalProps extends ModalProps {
  sessionId: string;
  onConfirm: (sessionId: string, data: CreateSessionInput) => Promise<void> | void;
  onUpdateStatus?: (sessionId: string, status: Session['status']) => Promise<void> | void;
}

export interface DeleteSessionModalProps extends ModalProps {
  sessionId: string;
  onConfirm: (sessionId: string) => Promise<void> | void;
}

// ============================================================================
// Profile Modal Props
// ============================================================================

export interface UpdateProfileModalProps extends ModalProps {
  profileId: string;
  onConfirm: (data: { firstName?: string; lastName?: string }) => Promise<void> | void;
}

export interface DeleteAccountModalProps extends ModalProps {
  onConfirm: () => Promise<void> | void;
}

// ============================================================================
// Playbook Modal Props
// ============================================================================

export interface UpdatePlaybookModalProps extends ModalProps {
  playbookId: string;
  onConfirm: (data: PlaybookUpdate) => Promise<void> | void;
}

export interface DeletePlaybookModalProps extends ModalProps {
  playbookId: string;
  onConfirm: (playbookId: string) => Promise<void> | void;
}

export interface ReplaceStrategyModalProps extends ModalProps {
  strategyToReplace: PlaybookStrategy;
  playbookId: string;
  onConfirm: (strategyToReplace: PlaybookStrategy, newStrategy: Strategy) => Promise<void> | void;
}

export interface GeneratePlaybookModalProps extends ModalProps {
  onConfirm: (data: GeneratePlaybookInput) => Promise<void> | void;
}

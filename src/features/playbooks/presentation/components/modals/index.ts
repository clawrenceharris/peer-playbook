import { modalRegistry, ModalType } from "@/lib/modals";
import { UpdatePlaybookModal } from "./update-playbook-modal";
import { CreatePlaybookModal } from "./create-playbook-modal";

/**
 * Modal type constants for playbook modals
 */
export const PLAYBOOK_MODAL_TYPES = {
  CREATE: "playbook:create",
  UPDATE: "playbook:update",
  REPLACE_STRATEGY: "playbook:replace-strategy",
} as const satisfies Record<string, ModalType>;

/**
 * Register all playbook modals with the modal registry
 * This should be called during app initialization
 */
export function registerPlaybookModals() {
  modalRegistry.register(PLAYBOOK_MODAL_TYPES.CREATE, CreatePlaybookModal);
  modalRegistry.register(PLAYBOOK_MODAL_TYPES.UPDATE, UpdatePlaybookModal);
}

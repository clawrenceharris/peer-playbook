import { modalRegistry } from "@/lib/modals";
import { DeletePlaybookModal } from "./delete-playbook-modal";
import { UpdatePlaybookModal } from "./update-playbook-modal";
import { ReplaceStrategyModal } from "./replace-strategy-modal";

/**
 * Modal type constants for playbook modals
 */
export const PLAYBOOK_MODAL_TYPES = {
  UPDATE: "playbook:update",
  DELETE: "playbook:delete",
  REPLACE_STRATEGY: "playbook:replace-strategy",
} as const;

/**
 * Register all playbook modals with the modal registry
 * This should be called during app initialization
 */
export function registerPlaybookModals() {

  modalRegistry.register(PLAYBOOK_MODAL_TYPES.DELETE, DeletePlaybookModal);
  modalRegistry.register(PLAYBOOK_MODAL_TYPES.UPDATE, UpdatePlaybookModal);
  modalRegistry.register(PLAYBOOK_MODAL_TYPES.REPLACE_STRATEGY, ReplaceStrategyModal);
}

import { modalRegistry } from "@/lib/modals";
import { CreateSessionModal } from "./create-session-modal";
import { UpdateSessionModal } from "./update-session-modal";
import { DeleteSessionModal } from "./delete-session-modal";

/**
 * Modal type constants for session modals
 */
export const SESSION_MODAL_TYPES = {
  CREATE: "session:create",
  UPDATE: "session:update",
  DELETE: "session:delete",
} as const;

/**
 * Register all session modals with the modal registry
 * This should be called during app initialization
 */
export function registerSessionModals() {
  modalRegistry.register(SESSION_MODAL_TYPES.CREATE, CreateSessionModal);
  modalRegistry.register(SESSION_MODAL_TYPES.UPDATE, UpdateSessionModal);
  modalRegistry.register(SESSION_MODAL_TYPES.DELETE, DeleteSessionModal);
}

import { modalRegistry } from "@/lib/modals";
import { UpdateProfileModal } from "./update-profile-modal";
import { DeleteAccountModal } from "./delete-account-modal";

/**
 * Modal type constants for profile modals
 */
export const PROFILE_MODAL_TYPES = {
  UPDATE: "profile:update",
  DELETE: "profile:delete",
} as const;

/**
 * Register all profile modals with the modal registry
 * This should be called during app initialization
 */
export function registerProfileModals() {
  modalRegistry.register(PROFILE_MODAL_TYPES.DELETE, DeleteAccountModal);
  modalRegistry.register(PROFILE_MODAL_TYPES.UPDATE, UpdateProfileModal);
}

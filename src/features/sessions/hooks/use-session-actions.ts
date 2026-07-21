import { useCallback } from "react";
import { Session } from "../domain";
import { useUpdateSession, useDeleteSession } from "./";
import { useModal } from "@/components/providers";
import { SESSION_MODAL_TYPES } from "../components/modals";
import { UpdateSessionModalProps } from "@/lib/modals/types";

export const useSessionActions = () => {
  const { mutateAsync: handleUpdateSession } = useUpdateSession();
  const { mutateAsync: handleDeleteSession } = useDeleteSession();

  const { openModal } = useModal();

  const updateSessionStatus = useCallback(
    async (sessionId: string, status: Session["status"]) => {
      return await handleUpdateSession({ sessionId, data: { status } });
    },
    [handleUpdateSession],
  );

  /**
   * @deprecated
   */
  const deleteSession = useCallback(
    (sessionId: string) => {
      return handleDeleteSession(sessionId);
    },
    [handleDeleteSession],
  );

  const updateSession = useCallback(
    (sessionId: string) => {
      openModal<UpdateSessionModalProps>(SESSION_MODAL_TYPES.UPDATE, {
        sessionId: sessionId,
        onSubmit: (_, data) => handleUpdateSession({ sessionId, data }),
        onUpdateStatus: updateSessionStatus,
      });
    },
    [handleUpdateSession, openModal, updateSessionStatus],
  );

  const startSession = useCallback(
    async (sessionId: string) => {
      return await updateSessionStatus(sessionId, "active");
    },
    [updateSessionStatus],
  );

  const endSession = useCallback(
    async (sessionId: string) => {
      return await updateSessionStatus(sessionId, "completed");
    },
    [updateSessionStatus],
  );

  return {
    startSession,
    endSession,
    updateSessionStatus,
    updateSession,
    deleteSession,
  };
};

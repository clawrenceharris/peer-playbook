import { useCallback } from "react";
import { Session, SessionInsert } from "../domain";
import { useCreateSession, useUpdateSession, useDeleteSession } from "./";
import { useModal } from "@/app/providers";
import { SESSION_MODAL_TYPES } from "../components/modals";
import type { CreateSessionInput } from "../domain";
import { useUser } from "@/app/providers";
import {
  CreateSessionModalProps,
  DeleteSessionModalProps,
  UpdateSessionModalProps,
} from "@/lib/modals/types";
import { DefaultValues } from "react-hook-form";

export const useSessionActions = () => {
  const { user } = useUser();
  const { mutateAsync: handleUpdateSession } = useUpdateSession();
  const { mutateAsync: handleDeleteSession } = useDeleteSession();
  const { mutateAsync: handleCreateSession } = useCreateSession();

  const { openModal } = useModal();

  const updateSessionStatus = useCallback(
    async (sessionId: string, status: Session["status"]) => {
      return await handleUpdateSession({ sessionId, data: { status } });
    },
    [handleUpdateSession],
  );

  const createSession = useCallback(
    (options?: { defaultValues: DefaultValues<SessionInsert> }) => {
      const handleConfirm = (data: CreateSessionInput) => {
        handleCreateSession({
          data: {
            ...data,
            leaderId: user.id,
          },
        });
      };

      openModal<CreateSessionModalProps>(SESSION_MODAL_TYPES.CREATE, {
        onConfirm: handleConfirm,
        defaultValues: options?.defaultValues,
      });
    },
    [handleCreateSession, openModal, user.id],
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      openModal<DeleteSessionModalProps>(SESSION_MODAL_TYPES.DELETE, {
        sessionId,
        onConfirm: () => handleDeleteSession(sessionId),
      });
    },
    [handleDeleteSession, openModal],
  );

  const updateSession = useCallback(
    (sessionId: string) => {
      openModal<UpdateSessionModalProps>(SESSION_MODAL_TYPES.UPDATE, {
        sessionId: sessionId,
        onConfirm: (_, data) => handleUpdateSession({ sessionId, data }),
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
    createSession,
    deleteSession,
  };
};

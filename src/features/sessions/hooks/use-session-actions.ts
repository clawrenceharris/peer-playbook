import { useCallback } from "react";
import { Session, SessionInsert } from "../domain";
import { useCreateSession, useUpdateSession, useDeleteSession } from "./";
import { useModal, useUser } from "@/components/providers";
import { SESSION_MODAL_TYPES } from "../components/modals";
import type { CreateSessionFormValues } from "../domain";
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
      const handleConfirm = async (data: CreateSessionFormValues) => {
        return await handleCreateSession({
          data: {
            ...data,
            leaderId: user.id,
            mode: "virtual",
          },
        });
      };

      openModal<CreateSessionModalProps>(SESSION_MODAL_TYPES.CREATE, {
        onSuccess: handleConfirm,
        defaultValues: options?.defaultValues,
      });
    },
    [handleCreateSession, openModal, user.id],
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      openModal<DeleteSessionModalProps>(SESSION_MODAL_TYPES.DELETE, {
        sessionId,
        onSubmit: () => handleDeleteSession(sessionId),
      });
    },
    [handleDeleteSession, openModal],
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
    createSession,
    deleteSession,
  };
};

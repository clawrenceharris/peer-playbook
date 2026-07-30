import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSessionStatusAction } from "@/actions/session/commands/updateSessionStatusAction";
import { deleteSessionAction } from "@/actions/session/commands/deleteSessionAction";
import { toast } from "sonner";
import { SessionCardDTO } from "../application/dto";
import { sessionKeys } from "@/lib/queries/keys";
import { createSessionAction } from "@/actions/session/commands/createSessionAction";
import { unwrapActionResult } from "@/shared/action/unwrapActionResult";
import { getUserErrorMessage } from "@/shared/utils";

export const useCreateSession = () =>
  useMutation({
    mutationKey: ["create-session"],
    mutationFn: async ({
      playbookId,
      ...rest
    }: Parameters<typeof createSessionAction>[0]) => {
      const result = await createSessionAction({
        playbookId,
        ...rest,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });

export const useUpdateSessionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-session-status"],
    mutationFn: async (
      input: Parameters<typeof updateSessionStatusAction>[0] & {
        instructorId: string;
      },
    ) => {
      const result = await updateSessionStatusAction(input);
      return unwrapActionResult(result);
    },
    onMutate: (input) => {
      queryClient.cancelQueries({
        queryKey: sessionKeys.byUserId(input.instructorId),
      });
      const previousSessions = queryClient.getQueryData(
        sessionKeys.byUserId(input.instructorId),
      );
      if (!previousSessions) {
        return { previousSessions };
      }
      queryClient.setQueryData(
        sessionKeys.byUserId(input.instructorId),
        (old: SessionCardDTO[]) => {
          return old.map((session) =>
            session.id === input.sessionId
              ? { ...session, status: input.status }
              : session,
          );
        },
      );
      return { previousSessions };
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.byUserId(input.instructorId),
      });
    },
    onError: (error, input) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.byUserId(input.instructorId),
      });
      toast.error(getUserErrorMessage(error.message));
    },
  });
};

export const useStartSession = () => {
  const { mutate: updateSessionStatus } = useUpdateSessionStatus();
  return async (input: { sessionId: string; instructorId: string }) => {
    updateSessionStatus({
      ...input,
      status: "active",
    });
  };
};
export const useCompleteSession = () => {
  const { mutate: updateSessionStatus } = useUpdateSessionStatus();
  return async (input: { sessionId: string; instructorId: string }) => {
    updateSessionStatus({
      ...input,
      status: "completed",
    });
  };
};

export const useCancelSession = () => {
  const { mutate: updateSessionStatus } = useUpdateSessionStatus();
  return async (input: { sessionId: string; instructorId: string }) => {
    updateSessionStatus({
      ...input,
      status: "canceled",
    });
  };
};
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-session"],
    mutationFn: async (sessionId: string) => {
      const result = await deleteSessionAction(sessionId);
      return unwrapActionResult(result);
    },
    onSuccess: () => {
      toast.success("Session deleted successfully");
    },
    onMutate: (sessionId) => {
      queryClient.cancelQueries({
        queryKey: sessionKeys.byUserId(sessionId),
      });
      const previousSessions = queryClient.getQueryData(
        sessionKeys.byUserId(sessionId),
      );
      if (!previousSessions) {
        return { previousSessions };
      }
      queryClient.setQueryData(
        sessionKeys.byUserId(sessionId),
        (old: SessionCardDTO[]) => {
          return old.filter((session) => session.id !== sessionId);
        },
      );
      return { previousSessions };
    },
    onError: (_error, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.byUserId(sessionId),
      });
      toast.error("Failed to delete session");
    },
  });
};

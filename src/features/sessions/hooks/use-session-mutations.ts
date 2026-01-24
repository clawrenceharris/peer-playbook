import { DefaultError } from "@tanstack/react-query";
import { useSessionService } from ".";
import { Session, SessionInsert, SessionService, SessionUpdate } from "../domain";
import { useDomainMutation } from "@/lib/queries";
import { playbookKeys } from "@/features/playbooks/domain/playbook.keys";
import { sessionKeys } from "../domain/session.keys";

export const useCreateSession = () =>
  useDomainMutation<
    SessionService,
    Session,
    DefaultError,
    { playbookId?: string; data: SessionInsert }
  >(useSessionService, {
    mutationKey: ["create-session"],
    mutationFn: (sessionService, { playbookId, data }) =>
      sessionService.createSession({
        ...data,
        playbookId,
      }),
    invalidateFn: (_ ,{playbookId}) =>
      playbookId
        ? [...sessionKeys.all, ...playbookKeys.all]
        : [...sessionKeys.all],
  });

export const useUpdateSession = () =>
  useDomainMutation<
    SessionService,
    Session,
    DefaultError,
    { sessionId: string; data: SessionUpdate }
  >(useSessionService, {
    mutationKey: ["update-session"],
    mutationFn: (sessionService, { sessionId, data }) =>
      sessionService.updateSession(sessionId, data),
    invalidateFn: () => sessionKeys.all,
  });

export const useDeleteSession = () =>
  useDomainMutation<SessionService, void, DefaultError, string>(
    useSessionService,
    {
      mutationKey: ["delete-session"],
      mutationFn: (sessionService, id) => sessionService.deleteSession(id),
      invalidateFn: () => sessionKeys.all,

      invalidationOptions: { exact: false },
    },
  );

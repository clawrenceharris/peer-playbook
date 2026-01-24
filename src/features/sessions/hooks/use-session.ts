import { useSuspenseQuery } from "@tanstack/react-query";
import { useSessionService } from "./";
import { sessionKeys } from "../domain";

export const useSession = (sessionId: string) => {
  const sessionService = useSessionService();
  return useSuspenseQuery({
    queryKey: [...sessionKeys.detail(sessionId)],
    queryFn: async () => {
      return await sessionService.getById(sessionId);
    },
  });
};

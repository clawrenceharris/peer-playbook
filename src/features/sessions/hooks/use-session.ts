import { useQuery } from "@tanstack/react-query";
import { useSessionService } from "./";
import { sessionKeys } from "../domain";

export const useSession = (sessionId: string) => {
  const sessionService = useSessionService();
  return useQuery({
    queryKey: [...sessionKeys.detail(sessionId)],
    queryFn: async () => {
      return await sessionService.getById(sessionId);
    },
  });
};

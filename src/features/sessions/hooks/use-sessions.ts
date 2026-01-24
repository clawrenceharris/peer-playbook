import { useQuery } from "@tanstack/react-query";
import { useSessionService } from "./";
import { Session } from "@/features/sessions/domain";
import { selectSortedSessions } from "@/features/sessions/selectors";
import { sessionKeys } from "@/features/sessions/domain";

/**
 * Base hook to fetch all sessions with optional selector
 * @param select - Optional selector function to transform the data
 * @returns React Query result with transformed data
 */
export const useSessions = <TSelected = Session[]>(
  select?: (sessions: Session[]) => TSelected
) => {
  const sessionService = useSessionService();
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: () => sessionService.getAll(),
    select,
  });
};

/**
 * Hook to fetch sessions sorted by creation date (newest first)
 * @param select - Optional additional selector to chain after sorting
 */
export const useSortedSessions = <TSelected = Session[]>(
  select?: (sessions: Session[]) => TSelected
) => {
  return useSessions((s) => {
    const sorted = selectSortedSessions(s);
    return select ? select(sorted) : (sorted as unknown as TSelected);
  });
};

/**
 * Hook to get all sessions with created with the give playbook ID
 * @param playbookId - The playbook ID
 */
export const usePlaybookSessions = (playbookId: string) =>
  useSessions((sessions) =>
    sessions.filter((s) => s.playbookId === playbookId)
  );

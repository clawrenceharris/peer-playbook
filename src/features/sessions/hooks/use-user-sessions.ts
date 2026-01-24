import { PaginatedResult } from "@/types";
import { Session } from "@/features/sessions/domain";
import { useQuery } from "@tanstack/react-query";
import { sessionKeys } from "../domain";
import { useSessionService } from "./";
import {
  selectSessionsByLeader,
  selectSortedSessions,
  selectUpcomingSessions,
} from "../selectors";

/**
 * Hook to fetch playbooks by user/owner
 * @param userId - The user/owner ID to filter by
 * @param select - Optional selector function to transform the data
 */
export const useUserSessions = <TSelected = Session[]>(
  userId: string,
  select?: (playbooks: Session[]) => TSelected
) => {
  const sessionService = useSessionService();
  return useQuery({
    queryKey: sessionKeys.byLeader(userId),
    queryFn: () => sessionService.getAllByUser(userId),
    select,
  });
};

export const useMyUpcomingSessions = (userId: string) => {
  return useUserSessions(userId, selectUpcomingSessions);
};

/**
 * Hook to fetch paginated sessions for a user
 * @param userId - The user ID to fetch sessions for
 * @param page - Current page (0-indexed)
 * @param limit - Items per page
 */
export const useMySessionsPaginated = (
  userId: string,
  page: number = 0,
  limit: number = 12
) => {
  const sessionService = useSessionService();
  return useQuery<PaginatedResult<Session>>({
    queryKey: sessionKeys.paginatedList(page, limit, { userId }),
    queryFn: async () => {
      // Fetch all sessions and paginate client-side
      // If your backend supports pagination, use those params instead
      const allSessions = await sessionService.getAll();
      const userSessions = selectSessionsByLeader(userId)(allSessions);
      const sorted = selectSortedSessions(userSessions);

      const start = page * limit;
      const end = start + limit;
      const paginated = sorted.slice(start, end);

      return {
        data: paginated,
        total: sorted.length,
        page,
        limit,
        totalPages: Math.ceil(sorted.length / limit),
      };
    },
  });
};

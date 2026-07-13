import { useQuery } from "@tanstack/react-query";
import {
  selectPublishedPlaybooks,
  selectRecentPlaybooks,
} from "../../selectors";
import { PlaybookCardDTO } from "../../application/dto";
import { playbookKeys } from "@/lib/queries/keys";
import { getSavedPlaybookIdsAction } from "@/actions/playbook";

/**
 * Base hook to fetch all playbooks with optional selector
 * @param select - Optional selector function to transform the data
 * @returns React Query result with transformed data
 */
export function usePlaybooks<TSelected = PlaybookCardDTO[]>(
  select?: (playbooks: PlaybookCardDTO[]) => TSelected,
) {
  return useQuery({
    queryKey: playbookKeys.all,
    meta: { invaidatesQuery: playbookKeys.all },
    queryFn: () => [],
    select,
  });
}

/**
 * Hook to fetch published playbooks only
 */
export const usePublishedPlaybooks = <TSelected = PlaybookCardDTO[]>(
  select?: (playbooks: PlaybookCardDTO[]) => TSelected,
) => {
  return usePlaybooks((p) => {
    const published = selectPublishedPlaybooks(p);
    return select ? select(published) : (published as unknown as TSelected);
  });
};

/**
 * Hook to fetch recent N playbooks
 * @param count - Number of recent playbooks to return
 */
export const useRecentPlaybooks = (count: number = 10) => {
  return usePlaybooks(selectRecentPlaybooks(count));
};

/**
 * Hook to fetch favorite playbook IDs for a user
 * @param userId - The user ID
 * @param select - Optional selector function to transform the data
 */
export const useMyFavoritePlaybooks = <TSelected = string[]>(
  userId: string,
  select?: (ids: string[]) => TSelected,
) => {
  return useQuery({
    queryKey: playbookKeys.favorite(),
    queryFn: async () => {
      const result = await getSavedPlaybookIdsAction(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    meta: { invaidatesQuery: playbookKeys.favorite() },

    select,
  });
};

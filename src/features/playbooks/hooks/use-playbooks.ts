import { useQuery } from "@tanstack/react-query";
import { usePlaybook, usePlaybookService } from ".";
import {
  selectSortedPlaybooks,
  selectPublishedPlaybooks,
  selectRecentPlaybooks,
  selectSortedPlaybookStrategies,
} from "../selectors";
import { playbookKeys, Playbook, PlaybookWithStrategies } from "../domain";

/**
 * Base hook to fetch all playbooks with optional selector
 * @param select - Optional selector function to transform the data
 * @returns React Query result with transformed data
 */
export function usePlaybooks<TSelected = Playbook[]>(
  select?: (playbooks: Playbook[]) => TSelected,
) {
  const playbookService = usePlaybookService();
  return useQuery({
    queryKey: playbookKeys.all,
    meta: { invaidatesQuery: playbookKeys.all },
    queryFn: () => playbookService.getAll(),
    select,
  });
}

/**
 * Hook to fetch playbooks sorted by creation date (newest first)
 */
export const useSortedPlaybooks = <TSelected = Playbook[]>(
  select?: (playbooks: Playbook[]) => TSelected,
) => {
  return usePlaybooks((p) => {
    const sorted = selectSortedPlaybooks(p);
    return select ? select(sorted) : (sorted as unknown as TSelected);
  });
};

/**
 * Hook to fetch published playbooks only
 */
export const usePublishedPlaybooks = <TSelected = Playbook[]>(
  select?: (playbooks: Playbook[]) => TSelected,
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
 * Hook to get playbook with strategies sorted by phase (warmup -> workout -> closer)
 * @param playbookId - The playbook ID
 */
export const usePlaybookSortedStrategies = (playbookId: string) =>
  usePlaybook(playbookId, (playbook) =>
    playbook ? selectSortedPlaybookStrategies(playbook) : [],
  );

/**
 * Hook to fetch favorite playbook IDs for a user
 * @param userId - The user ID
 * @param select - Optional selector function to transform the data
 */
export const useMyFavoritePlaybooks = <TSelected = string[]>(
  userId: string,
  select?: (ids: string[]) => TSelected,
) => {
  const playbookService = usePlaybookService();
  return useQuery({
    queryKey: playbookKeys.favorite(),
    queryFn: () => {
      return playbookService.getFavoritePlaybookIds(userId);
    },
    meta: { invaidatesQuery: playbookKeys.favorite() },

    select,
  });
};

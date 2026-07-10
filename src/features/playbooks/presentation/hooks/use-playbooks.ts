import { useQuery } from "@tanstack/react-query";
import { usePlaybook, usePlaybookService } from ".";
import {
  selectSortedPlaybooks,
  selectPublishedPlaybooks,
  selectRecentPlaybooks,
  selectSortedPlaybookStrategies,
} from "../../selectors";
import { Playbook } from "../../domain";
import { PlaybookCardDTO } from "../../application/dto";
import { playbookKeys } from "@/lib/queries/keys";

/**
 * Base hook to fetch all playbooks with optional selector
 * @param select - Optional selector function to transform the data
 * @returns React Query result with transformed data
 */
export function usePlaybooks<TSelected = PlaybookCardDTO[]>(
  select?: (playbooks: PlaybookCardDTO[]) => TSelected,
) {
  const playbookService = usePlaybookService();
  return useQuery({
    queryKey: playbookKeys.all,
    meta: { invaidatesQuery: playbookKeys.all },
    queryFn: () => [],
    select,
  });
}

/**
 * Hook to fetch playbooks sorted by creation date (newest first)
 */
export const useSortedPlaybooks = <TSelected = PlaybookCardDTO[]>(
  select?: (playbooks: PlaybookCardDTO[]) => TSelected,
) => {
  return usePlaybooks((p) => {
    return [];
  });
};

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

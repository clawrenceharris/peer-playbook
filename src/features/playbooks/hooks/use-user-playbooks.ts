import { useSuspenseQuery } from "@tanstack/react-query";
import { usePlaybookService } from ".";
import {
  selectMyFavoritePlaybooks,
  selectMyPublishedPlaybooks,
  selectMyDraftPlaybooks,
} from "../selectors";
import { playbookKeys, Playbook } from "../domain";

/**
 * Hook to fetch playbooks by user/owner
 * @param userId - The user/owner ID to filter by
 * @param select - Optional selector function to transform the data
 */
export const useUserPlaybooks = <TSelected = Playbook[]>(
  userId: string,
  select?: (playbooks: Playbook[]) => TSelected
) => {
  const playbookService = usePlaybookService();
  return useSuspenseQuery({
    queryKey: playbookKeys.byUser(userId),
    queryFn: () => playbookService.getAllByUser(userId),
    select,
  });
};

/**
 * Hook to fetch user's favorite playbooks
 * @param userId - The user ID
 */
export const useMyFavoritePlaybooks = (userId: string) =>
  useUserPlaybooks(userId, selectMyFavoritePlaybooks(userId));

/**
 * Hook to fetch user's published playbooks
 * @param userId - The user ID
 */
export const useMyPublishedPlaybooks = (userId: string) =>
  useUserPlaybooks(userId, selectMyPublishedPlaybooks(userId));

/**
 * Hook to fetch user's draft playbooks
 * @param userId - The user ID
 */
export const useMyDraftPlaybooks = (userId: string) =>
  useUserPlaybooks(userId, selectMyDraftPlaybooks(userId));

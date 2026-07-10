import { useQuery } from "@tanstack/react-query";
import { usePlaybookService } from ".";
import {
  selectMyPublishedPlaybooks,
  selectMyDraftPlaybooks,
} from "../../selectors";
import { Playbook } from "../../domain";
import { playbookKeys } from "@/lib/queries/keys";
import { getPlaybooksByUserAction } from "@/actions/playbook/queries/getPlaybooksByUserAction";
import { PlaybookCardDTO } from "../../application/dto";

/**
 * Hook to fetch playbooks by user/owner
 * @param userId - The user/owner ID to filter by
 * @param select - Optional selector function to transform the data
 */
export const useUserPlaybooks = <TSelected = PlaybookCardDTO[]>(
  userId: string,
  select?: (playbooks: PlaybookCardDTO[]) => TSelected,
) => {
  return useQuery({
    queryKey: playbookKeys.byUserId(userId),
    queryFn: async () => {
      const result = await getPlaybooksByUserAction(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    select,
  });
};

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

import { useQuery } from "@tanstack/react-query";
import { usePlaybookService } from "@/features/playbooks/presentation/hooks";
import { PlaybookWithStrategies } from "@/features/playbooks/domain";
import { playbookKeys } from "@/lib/queries/keys";
import { getPlaybookByIdAction } from "@/actions/playbook/queries/getPlaybookByIdAction";

/**
 * Hook to fetch a single playbook by ID
 * @param playbookId - The playbook ID
 */
export const usePlaybook = <TSelected = PlaybookWithStrategies>(
  playbookId: string,
  select?: (playbook: PlaybookWithStrategies | null) => TSelected,
) => {
  const playbookService = usePlaybookService();
  return useQuery({
    queryKey: playbookKeys.detail(playbookId),
    queryFn: () => playbookService.getPlaybookWithStrategies(playbookId),
    select,
  });
};

export const usePlaybookDetail = (id: string) => {
  return useQuery({
    queryKey: playbookKeys.detail(id),
    queryFn: async () => {
      const result = await getPlaybookByIdAction(id);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
};

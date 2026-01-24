import { useQuery } from "@tanstack/react-query";
import { usePlaybookService } from "@/features/playbooks/hooks";
import {
  playbookKeys,
  PlaybookWithStrategies,
} from "@/features/playbooks/domain";

/**
 * Hook to fetch a single playbook by ID (suspense version - throws errors to error boundary)
 * @param playbookId - The playbook ID
 */
export const usePlaybook = <TSelected = PlaybookWithStrategies>(
  playbookId: string,
  select?: (playbook: PlaybookWithStrategies | null) => TSelected
) => {
  const playbookService = usePlaybookService();
  return useQuery({
    queryKey: playbookKeys.detail(playbookId),
    queryFn: () => playbookService.getPlaybookWithStrategies(playbookId),
    select,
  });
};

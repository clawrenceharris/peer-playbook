import { useQuery } from "@tanstack/react-query";
import { playbookKeys } from "@/lib/queries/keys";
import {
  getPlaybookByIdAction,
  getPlaybookDetailAction,
} from "@/actions/playbook/queries";

export function usePlaybook(playbookId: string) {
  return useQuery({
    queryKey: playbookKeys.detail(playbookId),
    queryFn: async () => {
      const result = await getPlaybookByIdAction(playbookId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}

export const usePlaybookDetail = (id: string) => {
  return useQuery({
    queryKey: playbookKeys.detail(id, "detail"),
    queryFn: async () => {
      const result = await getPlaybookDetailAction(id);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import { getSessionContextsAction } from "@/actions/playbook/queries/getSessionContextsAction";

export const usePlaybookContexts = () => {
  return useQuery({
    queryKey: ["session-contexts"],
    queryFn: async () => {
      const result = await getSessionContextsAction();
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
};

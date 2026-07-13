import { getPlaybookPageAction } from "@/actions/playbook";
import { playbookKeys } from "@/lib/queries/keys";
import { useQuery } from "@tanstack/react-query";
import { GetPlaybookPageOutput } from "../../application/dto";

type UseCreatePlaybookPageOptions = {
  initialData: GetPlaybookPageOutput;
};
export function usePlaybookPage({
  playbookId,
  options,
}: {
  playbookId: string;
  options?: UseCreatePlaybookPageOptions;
}) {
  return useQuery({
    queryKey: playbookKeys.page(playbookId),
    initialData: options?.initialData,
    queryFn: async () => {
      const result = await getPlaybookPageAction(playbookId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}

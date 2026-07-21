import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePlaybookPhasesInput } from "../../application/dto";
import { updatePlaybookPhasesAction } from "@/actions/playbook";
import { playbookKeys } from "@/lib/queries/keys";
import { toast } from "sonner";

export function useUpdatePlaybookPhases() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePlaybookPhasesInput) => {
      const result = await updatePlaybookPhasesAction(input);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: playbookKeys.detail(data.playbookId),
      });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.page(data.playbookId),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

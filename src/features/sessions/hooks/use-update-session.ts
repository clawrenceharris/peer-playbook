import { updateSessionAction } from "@/actions/session/commands/updateSessionAction";
import { sessionKeys } from "@/lib/queries/keys";
import { unwrapActionResult } from "@/shared/action/unwrapActionResult";
import { getUserErrorMessage } from "@/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-session"],
    mutationFn: async (input: Parameters<typeof updateSessionAction>[0]) => {
      const result = await updateSessionAction(input);
      return unwrapActionResult(result);
    },

    onError: (error) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.all,
      });
      toast.error(getUserErrorMessage(error.message));
    },
  });
};

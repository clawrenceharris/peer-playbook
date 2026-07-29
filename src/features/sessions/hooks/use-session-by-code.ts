import { getSessionByCodeAction } from "@/actions/session/queries";
import { unwrapActionResult } from "@/shared/action/unwrapActionResult";
import { useQuery } from "@tanstack/react-query";

export const useSessionByCode = (code: string | null) => {
  return useQuery({
    queryKey: ["session", code],
    queryFn: async () => {
      if (!code) {
        return null;
      }
      const result = await getSessionByCodeAction(code);
      return unwrapActionResult(result);
    },
    enabled: !!code,
  });
};

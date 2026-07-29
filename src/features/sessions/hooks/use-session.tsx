import { getSessionDetailAction } from "@/actions/session/queries/getSessionByIdAction";
import { sessionKeys } from "@/lib/queries/keys";
import { unwrapActionResult } from "@/shared/action/unwrapActionResult";
import { useQuery } from "@tanstack/react-query";

export const useSessionDetail = (id: string) => {
  return useQuery({
    queryKey: sessionKeys.detail(id, "detail"),
    queryFn: async () => unwrapActionResult(await getSessionDetailAction(id)),
  });
};

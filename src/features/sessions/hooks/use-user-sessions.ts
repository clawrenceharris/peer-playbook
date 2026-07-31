import { getSessionsByUserAction } from "@/actions/session/queries/getSessionsByUserAction";
import { sessionKeys } from "@/lib/queries/keys";
import { useQuery } from "@tanstack/react-query";
import { SessionListItemDTO } from "../application/dto";

export function useUserSessions(
  userId: string | null,
  select: (sessions: SessionListItemDTO[]) => SessionListItemDTO[],
) {
  const { data, isLoading, error } = useQuery({
    queryKey: sessionKeys.byUserId(userId ?? ""),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const result = await getSessionsByUserAction(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!userId,
    select,
  });
  return { data, isLoading, error };
}

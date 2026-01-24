import { QueryKey, useMutationState } from "@tanstack/react-query";
import { useMemo } from "react";

interface UsePendingMutationsProps {
  mutationKey: QueryKey;
  exact?: boolean;
}
export function usePendingMutations({ mutationKey, exact = false }: UsePendingMutationsProps) {
  const mutations = useMutationState({
    filters: { mutationKey, exact},
    select: (m) => m.state.status,
  });
  const data = useMemo(() => {
    return mutations.filter((status) => status === "pending");
  }, [mutations]);

  return { data, pending: data.length > 0 };
}

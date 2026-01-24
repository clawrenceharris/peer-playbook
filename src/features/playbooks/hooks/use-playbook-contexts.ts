import { SessionContexts } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { selectContextsByKey } from "@/features/playbooks/selectors";
import { supabase } from "@/lib/supabase/client";

export const usePlaybookContexts = () => {
  const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([]);
  const {
    data: contexts = {},
    isLoading,
    isError,
    refetch: refetchContexts,
    isRefetching,
  } = useQuery({
    queryKey: ["session-contexts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("session_contexts").select();

      if (error) {
        // Log error for debugging but don't throw - return empty array
        console.error("Failed to fetch session contexts:", error);
        throw error; // Let React Query handle retry logic
      }

      return data as SessionContexts[];
    },
    retry: 2, // Retry up to 2 times on failure
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    // Fail silently - contexts are optional, form works without them
    throwOnError: false,
    select: selectContextsByKey,
  });

  const toggleContext = useCallback(
    (key: string) => {
      if (selectedContextKeys.includes(key)) {
        setSelectedContextKeys((prev) => prev.filter((k) => k !== key));
        return;
      }
      setSelectedContextKeys((prev) => [...prev, key]);
    },
    [selectedContextKeys]
  );

  return {
    contexts,
    selectedContextKeys,
    toggleContext,
    isLoading,
    isError,
    isRefetching,
    refetchContexts,
  };
};

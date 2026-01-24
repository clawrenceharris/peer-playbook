import { useStrategies } from "./use-strategies";
import { Strategy } from "@/features/strategies/domain";
import { useSearch } from "@/hooks/use-search";

export interface UseMediaSearchResult {
  results: Strategy[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  query: string;
  search: (query: string) => void;
  clearResults: () => void;
  retry: () => void;
}

/**
 * Hook for strategy search, now backed by the generic `useSearch`
 */
export function useStrategySearch(): UseMediaSearchResult {
  const { data: strategies = [] } = useStrategies();

  const search = useSearch<Strategy>({
    data: strategies,
    filter: (s, q) => s.title.toLowerCase().includes(q.toLowerCase()),
    minQueryLength: 3,
  });

  return {
    results: search.results,
    isLoading: search.isLoading,
    error: search.error,
    hasSearched: search.hasSearched,
    query: search.query,
    search: search.search,
    clearResults: search.clearResults,
    retry: search.retry,
  };
}

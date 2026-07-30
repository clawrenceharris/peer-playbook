import { SessionListItemDTO } from "@/features/sessions/application/dto";
import { useSearch } from "@/hooks/use-search";

export function useSessionSearch(sessions: SessionListItemDTO[]) {
  const search = useSearch<SessionListItemDTO>({
    data: sessions,
    filter: (s, q) =>
      (!!s.topic && s.topic.toLowerCase().includes(q.toLowerCase())) ||
      (!!s.courseName &&
        s.courseName.toLowerCase().includes(q.toLowerCase())) ||
      (!!s.description &&
        s.description.toLowerCase().includes(q.toLowerCase())),
    minQueryLength: 1,
    debounceMs: 200,
  });

  return search;
}

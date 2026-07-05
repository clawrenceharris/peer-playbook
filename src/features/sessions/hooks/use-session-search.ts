import { Session } from "@/features/sessions/domain";
import { useSearch } from "@/hooks/use-search";

export function useSessionSearch(sessions: Session[]) {
  const search = useSearch<Session>({
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

import { Playbook } from "@/features/playbooks/domain";
import { useSearch } from "@/hooks/use-search";

export function usePlaybookSearch(playbooks: Playbook[]) {
  const search = useSearch<Playbook>({
    data: playbooks,
    filter: (p, q) =>
      (!!p.topic && p.topic.toLowerCase().includes(q.toLowerCase())) ||
      (!!p.courseName &&
        p.courseName.toLowerCase().includes(q.toLowerCase())),
    debounceMs: 200,
  });

  return search;
}

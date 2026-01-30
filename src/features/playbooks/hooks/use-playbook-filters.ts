import { useMemo, useState } from "react";
import { Playbook } from "@/features/playbooks/domain";
import { PlaybookFilterState } from "../components";
import { useUser } from "@/app/providers";
import { useMyFavoritePlaybooks } from "./use-playbooks";

export function usePlaybookFilters(playbooks: Playbook[]) {
  const [filters, setFilters] = useState<PlaybookFilterState>({});
  const { user } = useUser();
  const { data: favoritePlaybooks = [] } = useMyFavoritePlaybooks(user.id);
  const filteredPlaybooks = useMemo(() => {
    return playbooks.filter((playbook) => {
      // Status filter
      if (filters.favorite && !favoritePlaybooks.includes(playbook.id)) {
        return false;
      }
      // Course filter
      if (filters.course && !playbook.courseName) {
        return false;
      }
      if (filters.course && filters.course !== playbook.courseName) {
        return false;
      }

      // Recent filter
      if (filters.recent && playbook.createdAt) {
        const sessionDate = new Date(playbook.createdAt);
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (sessionDate < lastWeek && sessionDate > now) {
          return false;
        }
      }

      return true;
    });
  }, [playbooks, filters]);

  const availableCourses = useMemo(() => {
    const courses = new Set<string>();
    playbooks.forEach((session) => {
      if (session.courseName) {
        courses.add(session.courseName);
      }
    });
    return Array.from(courses).sort();
  }, [playbooks]);

  return {
    filters,
    setFilters,
    filteredPlaybooks,
    availableCourses,
  };
}

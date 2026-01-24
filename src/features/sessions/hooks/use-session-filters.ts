import { useMemo, useState } from "react";
import { Session } from "@/features/sessions/domain";
import { SessionFilterState } from "../components";

export function useSessionFilters(sessions: Session[]) {
  const [filters, setFilters] = useState<SessionFilterState>({});

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Status filter
      if (filters.status && !filters.status.includes(session.status)) {
        return false;
      }

      // Course filter
      if (filters.course && session.courseName) {
        if (filters.course !== session.courseName) {
          return false;
        }
      }

      // Time range filter
      if (filters.timeRange === "this-week" && session.scheduledStart) {
        const sessionDate = new Date(session.scheduledStart);
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (sessionDate < now || sessionDate > weekFromNow) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, filters]);

  const availableCourses = useMemo(() => {
    const courses = new Set<string>();
    sessions.forEach((session) => {
      if (session.courseName) {
        courses.add(session.courseName);
      }
    });
    return Array.from(courses).sort();
  }, [sessions]);

  return {
    filters,
    setFilters,
    filteredSessions,
    availableCourses,
  };
}

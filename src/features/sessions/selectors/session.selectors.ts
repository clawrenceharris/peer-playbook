import { SessionListItemDTO } from "../application/dto";
import { SessionStatus } from "../domain/value-objects";

/**
 * Session selectors for composable data transformations
 * Follows Redux selector patterns for use with React Query
 */

// ============================================
// Core Sorting Selectors
// ============================================

/**
 * Sorts sessions by creation date (newest first)
 * Creates a new array to avoid mutation
 */
export const selectSortedSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] =>
  [...sessions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

/**
 * Sorts sessions by updated date (most recently updated first)
 */
export const selectSortedByUpdated = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] =>
  [...sessions].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

/**
 * Sorts sessions alphabetically by topic
 */
export const selectSortedByTopic = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] =>
  [...sessions].sort((a, b) =>
    a.topic && b.topic ? a.topic.localeCompare(b.topic) : 0,
  );

// ============================================
// Filter Selectors
// ============================================

/**
 * Filters sessions by leader ID
 */
export const selectSessionsByLeader =
  (instructorId: string) =>
  (sessions: SessionListItemDTO[]): SessionListItemDTO[] =>
    sessions.filter((s) => s.instructor.id === instructorId);

/**
 * Filters sessions by status
 */
export const selectSessionsByStatus =
  (status: SessionStatus) =>
  (sessions: SessionListItemDTO[]): SessionListItemDTO[] =>
    sessions.filter((s) => s.status === status);

/**
 * Filters sessions by course name
 */
export const selectSessionsByCourse =
  (courseName: string) =>
  (sessions: SessionListItemDTO[]): SessionListItemDTO[] =>
    sessions.filter((s) => s.courseName === courseName);

/**
 * Filters virtual sessions only
 */
export const selectVirtualSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] => sessions.filter((s) => s.mode === "virtual");

/**
 * Filters in-person sessions only
 */
export const selectInPersonSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] => sessions.filter((s) => s.mode === "in-person");

/**
 * Filters hybrid sessions only
 */
export const selectHybridSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] => sessions.filter((s) => s.mode === "hybrid");

/**
 * Filters active sessions (not completed or canceled)
 */
export const selectActiveSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] =>
  sessions.filter((s) => s.status !== "completed" && s.status !== "canceled");

/**
 * Filters completed sessions
 */
export const selectCompletedSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] => sessions.filter((s) => s.status === "completed");

/**
 * Filters upcoming sessions (scheduled_start in the future)
 */
export const selectUpcomingSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] => {
  const now = new Date();
  return sessions.filter((s) => {
    if (!s.scheduledStart) return false;
    return new Date(s.scheduledStart) > now;
  });
};

/**
 * Filters past sessions (scheduled_start in the past)
 */
export const selectPastSessions = (
  sessions: SessionListItemDTO[],
): SessionListItemDTO[] => {
  const now = new Date();
  return sessions.filter((s) => {
    if (!s.scheduledStart) return false;
    return new Date(s.scheduledStart) <= now;
  });
};

// ============================================
// Transformation Selectors
// ============================================

/**
 * Extracts session IDs
 */
export const selectSessionIds = (sessions: SessionListItemDTO[]): string[] =>
  sessions.map((s) => s.id);

/**
 * Extracts unique course names
 */
export const selectUniqueCourses = (sessions: SessionListItemDTO[]): string[] =>
  [...new Set(sessions.map((s) => s.courseName).filter(Boolean))] as string[];

/**
 * Groups sessions by status
 */
export const selectSessionsByStatusGroup = (
  sessions: SessionListItemDTO[],
): Record<string, SessionListItemDTO[]> =>
  sessions.reduce(
    (acc, session) => {
      const status = session.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(session);
      return acc;
    },
    {} as Record<string, SessionListItemDTO[]>,
  );

/**
 * Groups sessions by leader
 */
export const selectSessionsByLeaderGroup = (
  sessions: SessionListItemDTO[],
): Record<string, SessionListItemDTO[]> =>
  sessions.reduce(
    (acc, session) => {
      const instructorId = session.instructor.id;
      if (!acc[instructorId]) {
        acc[instructorId] = [];
      }
      acc[instructorId].push(session);
      return acc;
    },
    {} as Record<string, SessionListItemDTO[]>,
  );

// ============================================
// Pagination & Limiting Selectors
// ============================================

/**
 * Returns first N sessions
 */
export const selectFirstN =
  (n: number) =>
  (sessions: SessionListItemDTO[]): SessionListItemDTO[] =>
    sessions.slice(0, n);

/**
 * Returns recent N sessions (sorted by creation date)
 */
export const selectRecentSessions =
  (n: number) =>
  (sessions: SessionListItemDTO[]): SessionListItemDTO[] =>
    selectFirstN(n)(selectSortedSessions(sessions));

// ============================================
// Utility Functions for Composition
// ============================================

/**
 * Composes multiple selectors left to right
 * Usage: pipe(selectSortedSessions, selectFirstN(5))
 */
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value);

/**
 * Composes selector functions
 * Usage: compose(selectFirstN(5), selectSortedSessions) - right to left
 */
export const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), value);

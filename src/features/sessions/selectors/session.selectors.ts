import { Session } from "@/features/sessions/domain";

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
export const selectSortedSessions = (sessions: Session[]): Session[] =>
  [...sessions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

/**
 * Sorts sessions by updated date (most recently updated first)
 */
export const selectSortedByUpdated = (sessions: Session[]): Session[] =>
  [...sessions].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

/**
 * Sorts sessions alphabetically by topic
 */
export const selectSortedByTopic = (sessions: Session[]): Session[] =>
  [...sessions].sort((a, b) => a.topic.localeCompare(b.topic));

// ============================================
// Filter Selectors
// ============================================

/**
 * Filters sessions by leader ID
 */
export const selectSessionsByLeader =
  (leaderId: string) =>
  (sessions: Session[]): Session[] =>
    sessions.filter((s) => s.leaderId === leaderId);

/**
 * Filters sessions by status
 */
export const selectSessionsByStatus =
  (status: Session["status"]) =>
  (sessions: Session[]): Session[] =>
    sessions.filter((s) => s.status === status);

/**
 * Filters sessions by course name
 */
export const selectSessionsByCourse =
  (courseName: string) =>
  (sessions: Session[]): Session[] =>
    sessions.filter((s) => s.courseName === courseName);

/**
 * Filters virtual sessions only
 */
export const selectVirtualSessions = (sessions: Session[]): Session[] =>
  sessions.filter((s) => s.mode === "virtual");

/**
 * Filters in-person sessions only
 */
export const selectInPersonSessions = (sessions: Session[]): Session[] =>
  sessions.filter((s) => s.mode === "in-person");

/**
 * Filters hybrid sessions only
 */
export const selectHybridSessions = (sessions: Session[]): Session[] =>
  sessions.filter((s) => s.mode === "hybrid");

/**
 * Filters active sessions (not completed or canceled)
 */
export const selectActiveSessions = (sessions: Session[]): Session[] =>
  sessions.filter((s) => s.status !== "completed" && s.status !== "canceled");

/**
 * Filters completed sessions
 */
export const selectCompletedSessions = (sessions: Session[]): Session[] =>
  sessions.filter((s) => s.status === "completed");

/**
 * Filters upcoming sessions (scheduled_start in the future)
 */
export const selectUpcomingSessions = (sessions: Session[]): Session[] => {
  const now = new Date();
  return sessions.filter((s) => {
    if (!s.scheduledStart) return false;
    return new Date(s.scheduledStart) > now;
  });
};

/**
 * Filters past sessions (scheduled_start in the past)
 */
export const selectPastSessions = (sessions: Session[]): Session[] => {
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
export const selectSessionIds = (sessions: Session[]): string[] =>
  sessions.map((s) => s.id);

/**
 * Extracts unique course names
 */
export const selectUniqueCourses = (sessions: Session[]): string[] =>
  [...new Set(sessions.map((s) => s.courseName).filter(Boolean))] as string[];

/**
 * Groups sessions by status
 */
export const selectSessionsByStatusGroup = (
  sessions: Session[]
): Record<string, Session[]> =>
  sessions.reduce((acc, session) => {
    const status = session.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

/**
 * Groups sessions by leader
 */
export const selectSessionsByLeaderGroup = (
  sessions: Session[]
): Record<string, Session[]> =>
  sessions.reduce((acc, session) => {
    const leaderId = session.leaderId || "unknown";
    if (!acc[leaderId]) {
      acc[leaderId] = [];
    }
    acc[leaderId].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

// ============================================
// Pagination & Limiting Selectors
// ============================================

/**
 * Returns first N sessions
 */
export const selectFirstN =
  (n: number) =>
  (sessions: Session[]): Session[] =>
    sessions.slice(0, n);

/**
 * Returns recent N sessions (sorted by creation date)
 */
export const selectRecentSessions =
  (n: number) =>
  (sessions: Session[]): Session[] =>
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

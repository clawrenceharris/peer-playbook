import { Playbook, PlaybookStrategy, PlaybookWithStrategies } from "../domain";

/**
 * Playbook selectors for composable data transformations
 * Follows Redux selector patterns for use with React Query
 */

// ============================================
// Core Sorting Selectors
// ============================================

/**
 * Sorts playbooks by creation date (newest first)
 * Creates a new array to avoid mutation
 */
export const selectSortedPlaybooks = (playbooks: Playbook[]): Playbook[] =>
  [...playbooks].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

/**
 * Sorts playbooks by updated date (most recently updated first)
 */
export const selectSortedByUpdated = (playbooks: Playbook[]): Playbook[] =>
  [...playbooks].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

/**
 * Sorts playbooks alphabetically by topic
 */
export const selectSortedByTopic = (playbooks: Playbook[]): Playbook[] =>
  [...playbooks].sort((a, b) => a.topic.localeCompare(b.topic));

/**
 * Sorts playbooks alphabetically by course name
 */
export const selectSortedByCourse = (playbooks: Playbook[]): Playbook[] =>
  [...playbooks].sort((a, b) => {
    const courseA = a.courseName || "";
    const courseB = b.courseName || "";
    return courseA.localeCompare(courseB);
  });

// ============================================
// Filter Selectors - Ownership
// ============================================

/**
 * Filters playbooks by owner
 */
export const selectMyPlaybooks =
  (userId: string) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.filter((p) => p.createdBy === userId);

/**
 * Filters playbooks NOT owned by user (browsing others)
 */
export const selectOthersPlaybooks =
  (userId: string) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.filter((p) => p.createdBy !== userId);

// ============================================
// Filter Selectors - Published/Favorite
// ============================================

/**
 * Filters published playbooks
 */
export const selectPublishedPlaybooks = (playbooks: Playbook[]): Playbook[] =>
  playbooks.filter((p) => p.isPublished);

/**
 * Filters unpublished (draft) playbooks
 */
export const selectDraftPlaybooks = (playbooks: Playbook[]): Playbook[] =>
  playbooks.filter((p) => !p.isPublished);

/**
 * Filters user's favorite playbooks
 */
export const selectMyFavoritePlaybooks =
  (userId: string) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.filter((p) => p.favorite && p.createdBy === userId);

/**
 * Filters user's published playbooks
 */
export const selectMyPublishedPlaybooks =
  (userId: string) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.filter((p) => p.createdBy === userId && p.isPublished);

/**
 * Filters user's draft playbooks
 */
export const selectMyDraftPlaybooks =
  (userId: string) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.filter((p) => p.createdBy === userId && !p.isPublished);

// ============================================
// Filter Selectors - Course/Topic
// ============================================

/**
 * Filters playbooks by course name
 */
export const selectPlaybooksByCourse =
  (courseName: string) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.filter((p) => p.courseName === courseName);

/**
 * Filters playbooks by topic (case-insensitive partial match)
 */
export const selectPlaybooksByTopic =
  (topic: string) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.filter((p) =>
      p.topic.toLowerCase().includes(topic.toLowerCase()),
    );

// ============================================
// Transformation Selectors
// ============================================

/**
 * Extracts playbook IDs
 */
export const selectPlaybookIds = (playbooks: Playbook[]): string[] =>
  playbooks.map((p) => p.id);

/**
 * Extracts unique course names
 */
export const selectUniqueCourses = (playbooks: Playbook[]): string[] =>
  [...new Set(playbooks.map((p) => p.courseName).filter(Boolean))] as string[];

/**
 * Extracts unique topics
 */
export const selectUniqueTopics = (playbooks: Playbook[]): string[] => [
  ...new Set(playbooks.map((p) => p.topic)),
];

/**
 * Groups playbooks by owner
 */
export const selectPlaybooksByOwnerGroup = (
  playbooks: Playbook[],
): Record<string, Playbook[]> =>
  playbooks.reduce(
    (acc, playbook) => {
      const owner = playbook.createdBy || "unknown";
      if (!acc[owner]) {
        acc[owner] = [];
      }
      acc[owner].push(playbook);
      return acc;
    },
    {} as Record<string, Playbook[]>,
  );

/**
 * Groups playbooks by course
 */
export const selectPlaybooksByCourseGroup = (
  playbooks: Playbook[],
): Record<string, Playbook[]> =>
  playbooks.reduce(
    (acc, playbook) => {
      const course = playbook.courseName || "uncategorized";
      if (!acc[course]) {
        acc[course] = [];
      }
      acc[course].push(playbook);
      return acc;
    },
    {} as Record<string, Playbook[]>,
  );

// ============================================
// Pagination & Limiting Selectors
// ============================================

/**
 * Returns first N playbooks
 */
export const selectFirstN =
  (n: number) =>
  (playbooks: Playbook[]): Playbook[] =>
    playbooks.slice(0, n);

/**
 * Returns recent N playbooks (sorted by creation date)
 */
export const selectRecentPlaybooks =
  (n: number) =>
  (playbooks: Playbook[]): Playbook[] =>
    selectFirstN(n)(selectSortedByUpdated(playbooks));

// ============================================
// Playbook Strategy Selectors
// ============================================

/**
 * Sorts playbook strategies by phase order (warmup -> workout -> closer)
 */
export const selectSortedPlaybookStrategies = (
  playbook: PlaybookWithStrategies,
): PlaybookStrategy[] => {
  const phaseOrder = { warmup: 0, workout: 1, closer: 2 };
  return [...playbook.strategies].sort(
    (a, b) => phaseOrder[a.phase] - phaseOrder[b.phase],
  );
};

/**
 * Filters strategies by phase
 */
export const selectStrategiesByPhase =
  (phase: "warmup" | "workout" | "closer") =>
  (strategies: PlaybookStrategy[]): PlaybookStrategy[] =>
    strategies.filter((s) => s.phase === phase);

// ============================================
// Utility Functions for Composition
// ============================================

/**
 * Composes multiple selectors left to right
 * Usage: pipe(selectSortedPlaybooks, selectFirstN(5))
 */
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value);

/**
 * Composes selector functions right to left
 * Usage: compose(selectFirstN(5), selectSortedPlaybooks)
 */
export const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), value);

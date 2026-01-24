import { Strategy } from "@/features/strategies/domain";

/**
 * Strategy selectors for composable data transformations
 * Follows Redux selector patterns for use with React Query
 */

// ============================================
// Core Sorting Selectors
// ============================================

/**
 * Sorts strategies by creation date (newest first)
 * Creates a new array to avoid mutation
 */
export const selectSortedStrategies = (
  strategies: Strategy[]
): Strategy[] =>
  [...strategies].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

/**
 * Sorts strategies alphabetically by title
 */
export const selectSortedByTitle = (strategies: Strategy[]): Strategy[] =>
  [...strategies].sort((a, b) => a.title.localeCompare(b.title));

// ============================================
// Filter Selectors - Ownership & Publishing
// ============================================

/**
 * Filters strategies created by user
 */
export const selectMyStrategies =
  (userId: string) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) => s.createdBy === userId);

/**
 * Filters strategies NOT created by user
 */
export const selectOthersStrategies =
  (userId: string) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) => s.createdBy !== userId);

/**
 * Filters published strategies
 */
export const selectPublishedStrategies = (
  strategies: Strategy[]
): Strategy[] => strategies.filter((s) => s.isPublished);

/**
 * Filters draft (unpublished) strategies
 */
export const selectDraftStrategies = (strategies: Strategy[]): Strategy[] =>
  strategies.filter((s) => !s.isPublished);

/**
 * Filters system strategies
 */
export const selectSystemStrategies = (
  strategies: Strategy[]
): Strategy[] => strategies.filter((s) => s.isSystem);

/**
 * Filters custom (non-system) strategies
 */
export const selectCustomStrategies = (
  strategies: Strategy[]
): Strategy[] => strategies.filter((s) => !s.isSystem);

/**
 * Filters user's published strategies
 */
export const selectMyPublishedStrategies =
  (userId: string) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) => s.createdBy === userId && s.isPublished);

/**
 * Filters user's draft strategies
 */
export const selectMyDraftStrategies =
  (userId: string) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) => s.createdBy === userId && !s.isPublished);

// ============================================
// Filter Selectors - Category & Tags
// ============================================

/**
 * Filters strategies by course tag (single tag)
 */
export const selectStrategiesByCourseTag =
  (tag: string) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) => s.courseTags?.includes(tag));

/**
 * Filters strategies that have ALL specified course tags
 */
export const selectStrategiesByAllTags =
  (tags: string[]) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) => tags.every((tag) => s.courseTags?.includes(tag)));

/**
 * Filters strategies that have ANY of the specified course tags
 */
export const selectStrategiesByAnyTag =
  (tags: string[]) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) => tags.some((tag) => s.courseTags?.includes(tag)));

/**
 * Filters strategies by title search (case-insensitive partial match)
 */
export const selectStrategiesByTitle =
  (searchTerm: string) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

/**
 * Filters strategies by description search (case-insensitive partial match)
 */
export const selectStrategiesByDescription =
  (searchTerm: string) =>
  (strategies: Strategy[]): Strategy[] =>
    strategies.filter((s) =>
      s.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

/**
 * Full text search across title, description, and slug
 */
export const selectStrategiesBySearch =
  (searchTerm: string) =>
  (strategies: Strategy[]): Strategy[] => {
    const term = searchTerm.toLowerCase();
    return strategies.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term) ||
        s.slug?.toLowerCase().includes(term)
    );
  };

// ============================================
// Transformation Selectors
// ============================================

/**
 * Extracts strategy IDs
 */
export const selectStrategyIds = (strategies: Strategy[]): string[] =>
  strategies.map((s) => s.id);

/**
 * Extracts all unique course tags
 */
export const selectUniqueTags = (strategies: Strategy[]): string[] => [
  ...new Set(strategies.flatMap((s) => s.courseTags || [])),
];

/**
 * Groups strategies by creator
 */
export const selectStrategiesByCreatorGroup = (
  strategies: Strategy[]
): Record<string, Strategy[]> =>
  strategies.reduce((acc, strategy) => {
    const creator = strategy.createdBy || "unknown";
    if (!acc[creator]) {
      acc[creator] = [];
    }
    acc[creator].push(strategy);
    return acc;
  }, {} as Record<string, Strategy[]>);

/**
 * Creates a map of strategy ID to strategy
 */
export const selectStrategyMap = (
  strategies: Strategy[]
): Map<string, Strategy> => new Map(strategies.map((s) => [s.id, s]));

// ============================================
// Pagination & Limiting Selectors
// ============================================

/**
 * Returns first N strategies
 */
export const selectFirstN =
  (n: number) =>
  (strategies: Strategies[]): Strategies[] =>
    strategies.slice(0, n);

/**
 * Returns recent N strategies (sorted by creation date)
 */
export const selectRecentStrategies =
  (n: number) =>
  (strategies: Strategies[]): Strategies[] =>
    selectFirstN(n)(selectSortedStrategies(strategies));

// ============================================
// Saved Strategy Selectors (for IDs)
// ============================================

/**
 * Filters strategies that are in the saved IDs list
 */
export const selectSavedStrategiesFromIds =
  (savedIds: string[]) =>
  (strategies: Strategies[]): Strategies[] =>
    strategies.filter((s) => savedIds.includes(s.id));

/**
 * Filters strategies that are NOT in the saved IDs list
 */
export const selectUnsavedStrategies =
  (savedIds: string[]) =>
  (strategies: Strategies[]): Strategies[] =>
    strategies.filter((s) => !savedIds.includes(s.id));

// ============================================
// Utility Functions for Composition
// ============================================

/**
 * Composes multiple selectors left to right
 * Usage: pipe(selectSortedStrategies, selectFirstN(5))
 */
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value);

/**
 * Composes selector functions right to left
 * Usage: compose(selectFirstN(5), selectSortedStrategies)
 */
export const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), value);

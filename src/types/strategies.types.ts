/**
 * Base strategy shape used by the legacy Supabase strategy service.
 * The Prisma migration keeps this type local so it no longer depends on Drizzle table objects.
 */
export type BaseStrategy = {
  id?: string;
  title?: string;
  description?: string;
  steps?: string[];
  sessionSize?: string | null;
  virtualFriendly?: boolean;
  courseTags?: string[];
  goodFor?: string[];
  createdBy?: string | null;
  published?: boolean;
};

/**
 * Strategy override fields for playbook-specific customizations
 * Note: These fields need to be added to the playbook_strategies table
 */
export interface PlaybookStrategyOverrides {
  customTitle?: string | null;
  customDescription?: string | null;
  customSteps?: string[] | null;
  instructorNotes?: string | null;
}

/**
 * Strategy creation input for user-created strategies
 */
export interface CreateStrategyInput {
  title: string;
  description: string;
  steps: string[];
  category?: string | null;
  sessionSize?: BaseStrategy["sessionSize"];
  virtualFriendly?: boolean;
  courseTags?: string[];
  goodFor?: string[];
}

/**
 * Strategy publishing input
 */
export interface PublishStrategyInput {
  isPublished: boolean;
  visibility?: "private" | "public" | "unlisted";
}

/**
 * Playbook strategy creation input with optional overrides
 */
export interface CreatePlaybookStrategyInput {
  playbookId: string;
  strategyId: string; // or strategySlug for backwards compat
  phase: "warmup" | "workout" | "cooldown";
  overrides?: PlaybookStrategyOverrides;
}

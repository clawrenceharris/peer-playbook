import { DomainModel } from "@/lib/data/naming";
import { Strategies, PlaybookStrategies } from "./tables";

/**
 * Base strategy interface with ownership and publishing metadata
 * Note: Some fields (created_by, is_system, is_published) need to be added to the database schema
 */
export type BaseStrategy = DomainModel<Strategies>;

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
  phase: PlaybookStrategies["phase"];
  overrides?: PlaybookStrategyOverrides;
}

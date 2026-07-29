/**
 * Minimal display identity used when another feature needs to identify a user
 * without depending on the full profile read model.
 */
export type UserSummaryDTO = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

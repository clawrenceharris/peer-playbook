import { profiles } from "@/db/client";
import { InferSelectModel } from "drizzle-orm";
import { SelectResultFields } from "drizzle-orm/query-builders/select.types";

export const profileDetailProjection = {
  id: profiles.id,
  firstName: profiles.firstName,
  lastName: profiles.lastName,
  avatarUrl: profiles.avatarUrl,
  courses: profiles.courses,
  role: profiles.role,
  createdAt: profiles.createdAt,
  onboardingCompletedAt: profiles.onboardingCompletedAt,
  updatedAt: profiles.updatedAt,
};
export const profileCardProjection = {
  id: profiles.id,
  firstName: profiles.firstName,
  lastName: profiles.lastName,
  avatarUrl: profiles.avatarUrl,
};

export type ProfileDetailRecord = SelectResultFields<
  typeof profileDetailProjection
>;
export type ProfileCardRecord = SelectResultFields<
  typeof profileCardProjection
>;

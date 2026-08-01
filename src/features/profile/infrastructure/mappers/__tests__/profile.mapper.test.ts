import { describe, expect, it } from "vitest";
import type { ProfileDetailRecord } from "../profile.mapper";
import { ProfileMapper } from "../profile.mapper";

const profile = {
  id: "user-1",
  first_name: "Ada",
  last_name: null,
  avatar_url: null,
  courses: null,
  created_at: new Date("2026-01-01"),
  onboarding_completed_at: null,
  role: null,
  updated_at: null,
} satisfies ProfileDetailRecord;

describe("ProfileMapper", () => {
  it("returns null for a missing profile DTO", () => {
    expect(ProfileMapper.toDTO(null)).toBeNull();
  });

  it("normalizes optional profile values in detail and domain projections", () => {
    expect(ProfileMapper.toDetailDTO(profile)).toEqual(
      expect.objectContaining({
        displayName: "Ada",
        initials: "A",
        courses: [],
      }),
    );

    expect(ProfileMapper.toDomain(profile)).toEqual(
      expect.objectContaining({
        firstName: "Ada",
        lastName: null,
        courses: [],
        role: "user",
      }),
    );
  });
});

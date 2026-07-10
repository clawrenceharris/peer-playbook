import {
  ProfileCardDTO,
  ProfileDetailDTO,
} from "../../application/dto";
import { UserProfile } from "../../domain/entities";

export type ProfileDetailRecord = {
  id: string;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  courses: string[] | null;
  created_at: Date;
  onboarding_completed_at: Date | null;
  role: string | null;
  updated_at: Date | null;
};

export type ProfileCardRecord = Pick<
  ProfileDetailRecord,
  "id" | "first_name" | "last_name" | "avatar_url"
>;

export class ProfileMapper {
  static toDomain(profile: ProfileDetailRecord): UserProfile {
    return new UserProfile({
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      avatarUrl: profile.avatar_url,
      courses: profile.courses ?? [],
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      onboardingCompletedAt: profile.onboarding_completed_at,
      role: profile.role ?? "user",
    });
  }
  static toDetailDTO(profile: ProfileDetailRecord): ProfileDetailDTO {
    return {
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: `${profile.first_name} ${profile.last_name ?? ""}`.trim(),
      initials: `${profile.first_name.charAt(0).toUpperCase()}${profile?.last_name?.charAt(0).toUpperCase() ?? ""}`,
      onboardingCompletedAt: profile.onboarding_completed_at,
      avatarUrl: profile.avatar_url,
      courses: profile.courses ?? [],
    };
  }
  static toCardDTO(profile: ProfileCardRecord): ProfileCardDTO {
    return {
      id: profile.id,
      displayName: `${profile.first_name} ${profile.last_name ?? ""}`.trim(),
      initials: `${profile.first_name.charAt(0).toUpperCase()}${profile?.last_name?.charAt(0).toUpperCase() ?? ""}`,
      avatarUrl: profile.avatar_url,
    };
  }
}

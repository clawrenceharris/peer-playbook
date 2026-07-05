import {
  ProfileCardDTO,
  ProfileDetailDTO,
  UpdateProfileResult,
} from "../../application/dto";
import { UserProfile } from "../../domain/entities";
import { ProfileCardRecord, ProfileDetailRecord } from "../projections";

export class ProfileMapper {
  static toDomain(profile: ProfileDetailRecord): UserProfile {
    return new UserProfile({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatarUrl,
      courses: profile.courses ?? [],
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      onboardingCompletedAt: profile.onboardingCompletedAt,
      role: profile.role ?? "user",
    });
  }
  static toDetailDTO(profile: ProfileDetailRecord): ProfileDetailDTO {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: `${profile.firstName} ${profile.lastName}`,
      initials: `${profile.firstName.charAt(0).toUpperCase()}${profile?.lastName?.charAt(0).toUpperCase()}`,
      onboardingCompletedAt: profile.onboardingCompletedAt,
      avatarUrl: profile.avatarUrl,
      courses: profile.courses ?? [],
    };
  }
  static toCardDTO(profile: ProfileCardRecord): ProfileCardDTO {
    return {
      id: profile.id,
      displayName: `${profile.firstName} ${profile.lastName}`,
      initials: `${profile.firstName.charAt(0).toUpperCase()}${profile?.lastName?.charAt(0).toUpperCase()}`,
      avatarUrl: profile.avatarUrl,
    };
  }
}

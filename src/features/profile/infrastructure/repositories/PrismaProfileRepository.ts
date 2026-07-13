import { ProfileRepository } from "../../domain/repositories";
import { UserProfile } from "../../domain/entities";
import { ProfileMapper } from "../mappers";
import { CreateProfileCommand, UpdateProfileCommand } from "../../domain/types";
import { prisma, type PrismaClient } from "@/db/client";

export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async updateProfile(
    id: string,
    data: UpdateProfileCommand,
  ): Promise<UserProfile> {
    const record = await this.client.profiles.update({
      where: { id },
      data: {
        ...(data.school !== undefined && { school: data.school }),
        ...(data.firstName !== undefined && { first_name: data.firstName }),
        ...(data.lastName !== undefined && { last_name: data.lastName }),
        ...(data.avatarUrl !== undefined && { avatar_url: data.avatarUrl }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.courses !== undefined && { courses: data.courses }),
        ...(data.onboardingCompletedAt !== undefined && {
          onboarding_completed_at: data.onboardingCompletedAt,
        }),
        updated_at: new Date(),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
        courses: true,
        created_at: true,
        onboarding_completed_at: true,
        role: true,
        updated_at: true,
      },
    });

    return ProfileMapper.toDomain(record);
  }
  async createProfile(data: CreateProfileCommand): Promise<UserProfile> {
    const record = await this.client.profiles.create({
      data: {
        id: data.userId,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        courses: data.courses,
        role: data.role,
        avatar_url: data.avatarUrl,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
        courses: true,
        created_at: true,
        onboarding_completed_at: true,
        role: true,
        updated_at: true,
      },
    });
    return ProfileMapper.toDomain(record);
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.client.profiles.delete({ where: { id: userId } });
  }

  async existsById(userId: string): Promise<boolean> {
    const record = await this.client.profiles.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return record !== null;
  }
}

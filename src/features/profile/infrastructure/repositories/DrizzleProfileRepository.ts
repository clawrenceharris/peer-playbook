import { ProfileRepository } from "../../domain/repositories";
import { profileDetailProjection, ProfileDetailRecord } from "../projections";
import { UserProfile } from "../../domain/entities";
import { ProfileMapper } from "../mappers";
import { CreateProfileCommand, UpdateProfileCommand } from "../../domain/types";

import { DrizzleClient, profiles } from "@/db/client";
import { eq } from "drizzle-orm";

export class DrizzleProfileRepository implements ProfileRepository {
  constructor(private readonly drizzle: DrizzleClient) {}

  async updateProfile(
    id: string,
    data: UpdateProfileCommand,
  ): Promise<UserProfile> {
    const record = await this.drizzle
      .update(profiles)
      .set(data)
      .where(eq(profiles.id, id))
      .returning(profileDetailProjection);

    return ProfileMapper.toDomain(record[0]);
  }
  async createProfile(data: CreateProfileCommand): Promise<UserProfile> {
    const record = await this.drizzle
      .insert(profiles)
      .values({ id: data.userId, ...data })
      .returning(profileDetailProjection);
    return ProfileMapper.toDomain(record[0]);
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.drizzle.delete(profiles).where(eq(profiles.id, userId));
  }

  async existsById(userId: string): Promise<boolean> {
    const record = await this.drizzle
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);
    return record.length > 0 ? true : false;
  }
}

import { ProfileReadRepository } from "../../domain/repositories";
import {
  profileCardProjection,
  profileDetailProjection,
  ProfileDetailRecord,
} from "../projections";
import { ProfileMapper } from "../mappers";
import { ProfileCardDTO, ProfileDetailDTO } from "../../application/dto";
import { profiles } from "@/db/client";
import { DrizzleClient } from "@/db/client";
import {
  eq,
  InferRelationalQueryTableResult,
  InferSelectModel,
} from "drizzle-orm";
import { UserProfile } from "../../domain/entities";

export class DrizzleProfileReadRepository implements ProfileReadRepository {
  constructor(private readonly drizzle: DrizzleClient) {}
  async findProfileDetailById(id: string): Promise<ProfileDetailDTO | null> {
    const record = await this.drizzle
      .select(profileDetailProjection)
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);

    return record.length > 0 ? ProfileMapper.toDetailDTO(record[0]) : null;
  }

  async findProfileCardById(id: string): Promise<ProfileCardDTO | null> {
    const record = await this.drizzle
      .select(profileCardProjection)
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);
    return record.length > 0 ? ProfileMapper.toCardDTO(record[0]) : null;
  }

  async findProfileDetailByEmail(
    email: string,
  ): Promise<ProfileDetailDTO | null> {
    const record = await this.drizzle
      .select(profileDetailProjection)
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);
    return record.length > 0 ? ProfileMapper.toDetailDTO(record[0]) : null;
  }
}

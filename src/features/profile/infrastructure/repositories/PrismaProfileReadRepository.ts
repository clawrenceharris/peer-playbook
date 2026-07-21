import { ProfileReadRepository } from "../../domain/repositories";
import { ProfileMapper } from "../mappers";
import { ProfileCardDTO, ProfileDetailDTO } from "../../application/dto";
import { client, type PrismaClient } from "@/lib/db/client";

export class PrismaProfileReadRepository implements ProfileReadRepository {
  constructor(private readonly client: PrismaClient = client) {}
  async findProfileDetailById(id: string): Promise<ProfileDetailDTO | null> {
    const record = await this.client.profiles.findUnique({
      where: { id },
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

    return record ? ProfileMapper.toDetailDTO(record) : null;
  }

  async findProfileCardById(id: string): Promise<ProfileCardDTO | null> {
    const record = await this.client.profiles.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
      },
    });
    return record ? ProfileMapper.toCardDTO(record) : null;
  }

  async findProfileDetailByEmail(
    email: string,
  ): Promise<ProfileDetailDTO | null> {
    const record = await this.client.profiles.findFirst({
      where: { email },
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
    return record ? ProfileMapper.toDetailDTO(record) : null;
  }
}

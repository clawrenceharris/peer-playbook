import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { client } from "@/lib/db/client";
import { ProfileReadService } from "@/features/profile/application/services";

export function makeProfileReadService() {
  const profileReadRepository = new PrismaProfileReadRepository(client);
  return new ProfileReadService(profileReadRepository);
}

import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { db } from "@/db/client";
import { ProfileReadService } from "@/features/profile/application/services";

export function makeProfileReadService() {
  const profileReadRepository = new PrismaProfileReadRepository(db);
  return new ProfileReadService(profileReadRepository);
}

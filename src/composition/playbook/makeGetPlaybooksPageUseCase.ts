import { db } from "@/db/client";
import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { GetPlaybooksPageUseCase } from "@/features/playbooks/application/use-cases/GetPlaybooksPageUseCase";

export function makeGetPlaybooksPageUseCase() {
  const playbookReadRepository = new PrismaPlaybookReadRepository(db);
  const profileReadRepository = new PrismaProfileReadRepository(db);
  return new GetPlaybooksPageUseCase(
    playbookReadRepository,
    profileReadRepository,
  );
}

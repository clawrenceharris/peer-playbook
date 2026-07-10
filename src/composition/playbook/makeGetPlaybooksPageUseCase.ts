import { db } from "@/db/client";
import { DrizzlePlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { DrizzleProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { GetPlaybooksPageUseCase } from "@/features/playbooks/application/use-cases/GetPlaybooksPageUseCase";

export function makeGetPlaybooksPageUseCase() {
  const playbookReadRepository = new DrizzlePlaybookReadRepository(db);
  const profileReadRepository = new DrizzleProfileReadRepository(db);
  return new GetPlaybooksPageUseCase(
    playbookReadRepository,
    profileReadRepository,
  );
}

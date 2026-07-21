import { client } from "@/lib/db/client";
import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { GetPlaybooksPageUseCase } from "@/features/playbooks/application/use-cases/GetPlaybooksPageUseCase";

export function makeGetPlaybooksPageUseCase() {
  const playbookReadRepository = new PrismaPlaybookReadRepository(client);
  const profileReadRepository = new PrismaProfileReadRepository(client);
  return new GetPlaybooksPageUseCase(
    playbookReadRepository,
    profileReadRepository,
  );
}

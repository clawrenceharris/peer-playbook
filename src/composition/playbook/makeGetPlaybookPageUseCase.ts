import { GetPlaybookPageUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { db } from "@/db/client";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";

export const makeGetPlaybookPageUseCase = () => {
  const playbookReadRepository = new PrismaPlaybookReadRepository(db);
  const profileReadRepository = new PrismaProfileReadRepository(db);
  return new GetPlaybookPageUseCase(
    playbookReadRepository,
    profileReadRepository,
  );
};

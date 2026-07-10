import { GetPlaybookPageUseCase } from "@/features/playbooks/application/use-cases";
import { DrizzlePlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { db } from "@/db/client";
import { DrizzleProfileReadRepository } from "@/features/profile/infrastructure/repositories";

export const makeGetPlaybookPageUseCase = () => {
  const playbookReadRepository = new DrizzlePlaybookReadRepository(db);
  const profileReadRepository = new DrizzleProfileReadRepository(db);
  return new GetPlaybookPageUseCase(
    playbookReadRepository,
    profileReadRepository,
  );
};

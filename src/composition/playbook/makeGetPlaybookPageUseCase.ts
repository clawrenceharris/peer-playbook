import { GetPlaybookPageUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { client } from "@/lib/db/client";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";

export const makeGetPlaybookPageUseCase = () => {
  const playbookReadRepository = new PrismaPlaybookReadRepository(client);
  const profileReadRepository = new PrismaProfileReadRepository(client);
  return new GetPlaybookPageUseCase(
    playbookReadRepository,
    profileReadRepository,
  );
};

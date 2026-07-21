import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories/PrismaPlaybookReadRepository";
import { PlaybookReadService } from "@/features/playbooks/application/services";
import { client } from "@/lib/db/client";
export const makePlaybookReadService = () => {
  const playbookReadRepository = new PrismaPlaybookReadRepository(client);
  return new PlaybookReadService(playbookReadRepository);
};

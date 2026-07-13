import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories/PrismaPlaybookReadRepository";
import { PlaybookReadService } from "@/features/playbooks/application/services";
import { db } from "@/db/client";
export const makePlaybookReadService = () => {
  const playbookReadRepository = new PrismaPlaybookReadRepository(db);
  return new PlaybookReadService(playbookReadRepository);
};

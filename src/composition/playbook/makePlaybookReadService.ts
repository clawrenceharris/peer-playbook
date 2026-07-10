import { DrizzlePlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories/DrizzlePlaybookReadRepository";
import { PlaybookReadService } from "@/features/playbooks/application/services";
import { db } from "@/db/client";
export const makePlaybookReadService = () => {
  const playbookReadRepository = new DrizzlePlaybookReadRepository(db);
  return new PlaybookReadService(playbookReadRepository);
};

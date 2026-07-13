import { db } from "@/db/client";
import { UpdatePlaybookPhasesUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeUpdatePlaybookPhasesUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new UpdatePlaybookPhasesUseCase(playbookRepository);
}

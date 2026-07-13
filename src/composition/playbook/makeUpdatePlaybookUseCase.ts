import { db } from "@/db/client";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";
import { UpdatePlaybookUseCase } from "@/features/playbooks/application/use-cases";

export function makeUpdatePlaybookUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new UpdatePlaybookUseCase(playbookRepository);
}

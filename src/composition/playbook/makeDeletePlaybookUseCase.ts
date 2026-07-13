import { db } from "@/db/client";
import { DeletePlaybookUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeDeletePlaybookUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new DeletePlaybookUseCase(playbookRepository);
}

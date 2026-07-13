import { db } from "@/db/client";
import { CreatePlaybookUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeCreatePlaybookUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new CreatePlaybookUseCase(playbookRepository);
}

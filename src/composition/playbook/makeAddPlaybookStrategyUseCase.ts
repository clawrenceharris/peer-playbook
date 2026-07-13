import { db } from "@/db/client";
import { AddPlaybookStrategyUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeAddPlaybookStrategyUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new AddPlaybookStrategyUseCase(playbookRepository);
}


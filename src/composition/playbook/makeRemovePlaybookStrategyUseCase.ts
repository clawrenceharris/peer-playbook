import { db } from "@/db/client";
import { RemovePlaybookStrategyUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeRemovePlaybookStrategyUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new RemovePlaybookStrategyUseCase(playbookRepository);
}


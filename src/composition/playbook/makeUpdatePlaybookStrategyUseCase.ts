import { db } from "@/db/client";
import { UpdatePlaybookStrategyUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeUpdatePlaybookStrategyUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new UpdatePlaybookStrategyUseCase(playbookRepository);
}

import { client } from "@/lib/db/client";
import { AddPlaybookStrategyUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeAddPlaybookStrategyUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(client);
  return new AddPlaybookStrategyUseCase(playbookRepository);
}

import { client } from "@/lib/db/client";
import { UpdatePlaybookStrategyUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeUpdatePlaybookStrategyUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(client);
  return new UpdatePlaybookStrategyUseCase(playbookRepository);
}

import { client } from "@/lib/db/client";
import { UpdatePlaybookPhasesUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeUpdatePlaybookPhasesUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(client);
  return new UpdatePlaybookPhasesUseCase(playbookRepository);
}

import { client } from "@/lib/db/client";
import { AddPlaybookPhaseUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeAddPlaybookPhaseUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(client);
  return new AddPlaybookPhaseUseCase(playbookRepository);
}

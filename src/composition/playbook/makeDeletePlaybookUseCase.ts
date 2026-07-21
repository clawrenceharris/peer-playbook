import { client } from "@/lib/db/client";
import { DeletePlaybookUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeDeletePlaybookUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(client);
  return new DeletePlaybookUseCase(playbookRepository);
}

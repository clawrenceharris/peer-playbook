import { client } from "@/lib/db/client";
import { CreatePlaybookUseCase } from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeCreatePlaybookUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(client);
  return new CreatePlaybookUseCase(playbookRepository);
}

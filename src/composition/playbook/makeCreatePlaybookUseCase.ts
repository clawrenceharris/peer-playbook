import { db } from "@/db/client";
import { CreatePlaybookUseCase } from "@/features/playbooks/application/use-cases";
import { DrizzlePlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeCreatePlaybookUseCase() {
  const playbookRepository = new DrizzlePlaybookWriteRepository(db);
  return new CreatePlaybookUseCase(playbookRepository);
}

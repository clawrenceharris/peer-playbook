import { db } from "@/db/client";
import { DrizzlePlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";
import { UpdatePlaybookUseCase } from "@/features/playbooks/application/use-cases";

export function makeUpdatePlaybookUseCase() {
  const playbookRepository = new DrizzlePlaybookWriteRepository(db);
  return new UpdatePlaybookUseCase(playbookRepository);
}

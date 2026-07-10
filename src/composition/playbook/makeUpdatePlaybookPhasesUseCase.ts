import { db } from "@/db/client";
import { UpdatePlaybookPhasesUseCase } from "@/features/playbooks/application/use-cases";
import { DrizzlePlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeUpdatePlaybookPhasesUseCase() {
  const playbookRepository = new DrizzlePlaybookWriteRepository(db);
  return new UpdatePlaybookPhasesUseCase(playbookRepository);
}

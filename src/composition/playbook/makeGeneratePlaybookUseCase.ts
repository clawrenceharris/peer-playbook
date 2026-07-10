import { DrizzlePlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";
import { db } from "@/db/client";
import { GeneratePlaybookUseCase } from "@/features/playbooks/application/use-cases";
export const makeGeneratePlaybookUseCase = () => {
  const playbookWriteRepository = new DrizzlePlaybookWriteRepository(db);
  return new GeneratePlaybookUseCase(playbookWriteRepository);
};

import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";
import { db } from "@/db/client";
import { GeneratePlaybookUseCase } from "@/features/playbooks/application/use-cases";
import {
  OpenAIJsonCompletionAdapter,
  PlaybookGenerationPlanner,
  PrismaStrategyCatalogRepository,
} from "@/features/ai";

export const makeGeneratePlaybookUseCase = () => {
  const playbookWriteRepository = new PrismaPlaybookWriteRepository(db);
  const strategyCatalogRepository = new PrismaStrategyCatalogRepository(db);
  const jsonCompletion = new OpenAIJsonCompletionAdapter();
  const planner = new PlaybookGenerationPlanner(
    strategyCatalogRepository,
    jsonCompletion,
  );

  return new GeneratePlaybookUseCase(playbookWriteRepository, planner);
};

import { client } from "@/lib/db/client";
import { GetPlaybookCreationPageUseCase } from "@/features/playbooks/application/use-cases/GetPlaybookCreationPageUseCase";
import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { StaticInstructionalModelRepository } from "@/features/reference-data/instructional-models/infrastructure/repositories/StaticInstructionalModelRepository";
import { InstructionalModelService } from "@/features/reference-data/instructional-models/services/InstructionalModelService";

export function makeGetPlaybookCreationPageUseCase() {
  const playbookReadRepository = new PrismaPlaybookReadRepository(client);
  const instructionalModelRepository = new StaticInstructionalModelRepository();
  const instructionalModelService = new InstructionalModelService(
    instructionalModelRepository,
  );
  return new GetPlaybookCreationPageUseCase(
    playbookReadRepository,
    instructionalModelService,
  );
}

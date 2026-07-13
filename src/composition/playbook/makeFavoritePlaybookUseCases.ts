import { db } from "@/db/client";
import {
  AddFavoritePlaybookUseCase,
  RemoveFavoritePlaybookUseCase,
} from "@/features/playbooks/application/use-cases";
import { PrismaPlaybookWriteRepository } from "@/features/playbooks/infrastructure/repositories";

export function makeAddFavoritePlaybookUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new AddFavoritePlaybookUseCase(playbookRepository);
}

export function makeRemoveFavoritePlaybookUseCase() {
  const playbookRepository = new PrismaPlaybookWriteRepository(db);
  return new RemoveFavoritePlaybookUseCase(playbookRepository);
}

import {
  GetPlaybookDetailUseCase,
  ListPlaybookContextsUseCase,
  ListSavedPlaybookIdsUseCase,
  ListUserPlaybooksUseCase,
} from "@/features/playbooks/application/use-cases/PlaybookReadQueries";
import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { client } from "@/lib/db/client";

function makePlaybookReadPort() {
  return new PrismaPlaybookReadRepository(client);
}

export const makeListUserPlaybooksUseCase = () =>
  new ListUserPlaybooksUseCase(makePlaybookReadPort());
export const makeGetPlaybookDetailUseCase = () =>
  new GetPlaybookDetailUseCase(makePlaybookReadPort());
export const makeListPlaybookContextsUseCase = () =>
  new ListPlaybookContextsUseCase(makePlaybookReadPort());
export const makeListSavedPlaybookIdsUseCase = () =>
  new ListSavedPlaybookIdsUseCase(makePlaybookReadPort());

import {
  GetSessionByCodeUseCase,
  GetSessionDetailByIdUseCase,
  ListUserSessionsUseCase,
} from "@/features/sessions/application/use-cases/SessionReadQueries";
import { PrismaSessionReadRepository } from "@/features/sessions/infrastructure/repositories";
import { client } from "@/lib/db/client";

function makeSessionReadPort() {
  return new PrismaSessionReadRepository(client);
}

export const makeGetSessionByCodeUseCase = () =>
  new GetSessionByCodeUseCase(makeSessionReadPort());
export const makeGetSessionDetailByIdUseCase = () =>
  new GetSessionDetailByIdUseCase(makeSessionReadPort());
export const makeListUserSessionsUseCase = () =>
  new ListUserSessionsUseCase(makeSessionReadPort());

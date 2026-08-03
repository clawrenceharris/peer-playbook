import {
  GetProfileByIdUseCase,
  GetProfileCardByIdUseCase,
  GetProfileDetailByEmailUseCase,
  GetProfileDetailByIdUseCase,
} from "@/features/profile/application/use-cases/ProfileReadQueries";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { client } from "@/lib/db/client";

function makeProfileReadPort() {
  return new PrismaProfileReadRepository(client);
}

export const makeGetProfileByIdUseCase = () =>
  new GetProfileByIdUseCase(makeProfileReadPort());
export const makeGetProfileDetailByIdUseCase = () =>
  new GetProfileDetailByIdUseCase(makeProfileReadPort());
export const makeGetProfileCardByIdUseCase = () =>
  new GetProfileCardByIdUseCase(makeProfileReadPort());
export const makeGetProfileDetailByEmailUseCase = () =>
  new GetProfileDetailByEmailUseCase(makeProfileReadPort());

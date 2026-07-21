import { client } from "@/lib/db/client";
import { CreateSessionUseCase } from "@/features/sessions/application/use-cases/CreateSessionUseCase";
import { PrismaSessionWriteRepository } from "@/features/sessions/infrastructure/repositories/PrismaSessionWriteRepository";

export const makeCreateSessionUseCase = () => {
  const sessionRepository = new PrismaSessionWriteRepository(client);
  return new CreateSessionUseCase(sessionRepository);
};

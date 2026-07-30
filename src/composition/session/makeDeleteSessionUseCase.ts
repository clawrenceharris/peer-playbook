import { DeleteSessionUseCase } from "@/features/sessions/application/use-cases/DeleteSessionUseCase";
import { PrismaSessionWriteRepository } from "@/features/sessions/infrastructure/repositories/PrismaSessionWriteRepository";
import { client } from "@/lib/db/client";

export function makeDeleteSessionUseCase() {
  const sessionWriteRepository = new PrismaSessionWriteRepository(client);
  return new DeleteSessionUseCase(sessionWriteRepository);
}

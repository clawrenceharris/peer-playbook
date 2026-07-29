import { UpdateSessionUseCase } from "@/features/sessions/application/use-cases/UpdateSessionUseCase";
import { PrismaSessionWriteRepository } from "@/features/sessions/infrastructure/repositories";
import { client } from "@/lib/db/client";

export function makeUpdateSessionUseCase() {
  const sessionRepository = new PrismaSessionWriteRepository(client);
  return new UpdateSessionUseCase(sessionRepository);
}

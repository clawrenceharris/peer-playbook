import { PrismaSessionReadRepository } from "@/features/sessions/infrastructure/repositories/PrismaSessionReadRepository";
import { PrismaSessionWriteRepository } from "@/features/sessions/infrastructure/repositories/PrismaSessionWriteRepository";
import { UpdateSessionStatusUseCase } from "@/features/sessions/application/use-cases/UpdateSessionStatusUseCase";
import { client } from "@/lib/db/client";

export function makeUpdateSessionStatus() {
  const sessionReadRepository = new PrismaSessionReadRepository(client);
  const sessionWriteRepository = new PrismaSessionWriteRepository(client);
  const updateSessionStatusUseCase = new UpdateSessionStatusUseCase(
    sessionWriteRepository,
    sessionReadRepository,
  );
  return updateSessionStatusUseCase;
}

import { client } from "@/lib/db/client";
import { PrismaSessionReadRepository } from "@/features/sessions/infrastructure/repositories";
import { SessionReadService } from "@/features/sessions/application/services/SessionReadService";

export const makeSessionReadService = () => {
  const sessionReadRepository = new PrismaSessionReadRepository(client);
  return new SessionReadService(sessionReadRepository);
};

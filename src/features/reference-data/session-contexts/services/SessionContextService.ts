import { SessionContextDTO } from "../application/dto/SessionContextDTO";
import { SessionContextRepository } from "../domain/repositories/SessionContextRepository";

export class SessionContextService {
  constructor(
    private readonly sessionContextRepository: SessionContextRepository,
  ) {}

  async getSessionContexts(): Promise<SessionContextDTO[]> {
    return this.sessionContextRepository.findAll();
  }

  async getSessionContextByKey(key: string): Promise<SessionContextDTO> {
    return this.sessionContextRepository.findByKey(key);
  }
}

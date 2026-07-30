import { SessionContextDTO } from "../application/dto/SessionContextDTO";
import { SessionContextReadPort } from "../application/ports";

export class SessionContextService {
  constructor(
    private readonly sessionContextRepository: SessionContextReadPort,
  ) {}

  async getSessionContexts(): Promise<SessionContextDTO[]> {
    return this.sessionContextRepository.findAll();
  }

  async getSessionContextByKey(key: string): Promise<SessionContextDTO> {
    return this.sessionContextRepository.findByKey(key);
  }
}

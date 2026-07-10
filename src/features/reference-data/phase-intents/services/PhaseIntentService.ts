import { PhaseIntent } from "../domain/types/PhaseIntent";
import { PhaseIntentRepository } from "../domain/repositories/PhaseIntentRepository";

export class PhaseIntentService {
  constructor(private readonly phaseIntentRepository: PhaseIntentRepository) {}

  async getPhaseIntents(): Promise<PhaseIntent[]> {
    return this.phaseIntentRepository.findAll();
  }
}

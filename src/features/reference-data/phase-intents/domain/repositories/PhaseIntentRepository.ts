import { PhaseIntent } from "../types/PhaseIntent";

export interface PhaseIntentRepository {
  findAll(): Promise<PhaseIntent[]>;
  findById(id: string): Promise<PhaseIntent>;
}

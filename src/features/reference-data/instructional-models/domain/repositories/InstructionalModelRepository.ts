import { InstructionalModel } from "../types/InstructionalModel";

export interface InstructionalModelRepository {
  findAll(): Promise<InstructionalModel[]>;
  findById(id: string): Promise<InstructionalModel | null>;
}

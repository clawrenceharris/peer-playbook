import { InstructionalModelRepository } from "../../domain/repositories/InstructionalModelRepository";
import { InstructionalModel } from "../../domain/types/InstructionalModel";
import { instructionalModelCatalog } from "../catalogs/instructional-model.catalog";

export class StaticInstructionalModelRepository
  implements InstructionalModelRepository
{
  async findAll(): Promise<InstructionalModel[]> {
    return instructionalModelCatalog;
  }

  async findById(id: string): Promise<InstructionalModel | null> {
    return instructionalModelCatalog.find((model) => model.id === id) ?? null;
  }
}

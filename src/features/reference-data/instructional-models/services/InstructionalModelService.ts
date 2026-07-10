import { InstructionalModelDTO } from "../application/dto/InstructionalModelDTO";
import { InstructionalModelRepository } from "../domain/repositories/InstructionalModelRepository";
import { InstructionalModelMapper } from "../infrastructure/mappers/InstructionalModelMapper";

export class InstructionalModelService {
  constructor(
    private readonly instructionalModelRepository: InstructionalModelRepository,
  ) {}

  async getInstructionalModels(): Promise<InstructionalModelDTO[]> {
    const models = await this.instructionalModelRepository.findAll();
    return models.map(InstructionalModelMapper.toDTO);
  }
}

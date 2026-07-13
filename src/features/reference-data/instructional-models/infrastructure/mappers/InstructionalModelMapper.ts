import { InstructionalModelDTO } from "../../application/dto/InstructionalModelDTO";
import { InstructionalModel } from "../../domain/types/InstructionalModel";

export class InstructionalModelMapper {
  static toDTO(model: InstructionalModel): InstructionalModelDTO {
    return {
      id: model.id,
      label: model.label,
      description: model.description,
      supportsCustomPhases: model.supportsCustomPhases,
      phases: model.phases.map((phase) => ({
        key: phase.key,
        label: phase.label,
        description: phase.description,
        intentKey: phase.intent as InstructionalModelDTO["phases"][number]["intentKey"],
        position: phase.position,
      })),
    };
  }
}

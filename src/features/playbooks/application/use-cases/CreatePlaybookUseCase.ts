import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { CreatePlaybookPhaseCommand } from "../../domain/types";
import { CreatePlaybookInput, CreatePlaybookResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";

function buildDefaultPhases(
  input: CreatePlaybookInput,
): CreatePlaybookPhaseCommand[] {
  return [
    {
      title: "Warmup",
      intentKey: "activate",
      legacyPhase: "warmup",
      position: 0,
      strategies: input.warmup ?? [],
    },
    {
      title: "Workout",
      intentKey: "apply",
      legacyPhase: "workout",
      position: 1,
      strategies: input.workout ?? [],
    },
    {
      title: "Closer",
      intentKey: "reflect",
      legacyPhase: "closer",
      position: 2,
      strategies: input.closer ?? [],
    },
  ];
}

function buildCreatePhases(
  input: CreatePlaybookInput,
): CreatePlaybookPhaseCommand[] {
  if (input.phases && input.phases.length > 0) {
    return input.phases.map((phase, position) => ({
      title: phase.title.trim(),
      intentKey: phase.intentKey,
      templatePhaseKey: phase.templatePhaseKey,
      legacyPhase: phase.legacyPhase,
      position,
      strategies: phase.strategies ?? [],
    }));
  }

  return buildDefaultPhases(input);
}

export class CreatePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: CreatePlaybookInput,
  ): Promise<Result<CreatePlaybookResult>> {
    try {
      const { topic, courseName, title, subject, contexts, modes } = input;

      const result = await this.playbookRepository.createPlaybook({
        topic,
        courseName: courseName ?? null,
        subject: subject ?? "",
        createdBy: input.userId,
        methodology: null, // TODO: Implement methodology generation
        instructionalModelId: input.instructionalModelId,
        contexts,
        title,
        modes: modes ?? [],
        phases: buildCreatePhases(input),
      });
      return ok(result);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.startsWith("Missing phase intent") ||
          error.message.startsWith("Missing strategy") ||
          error.message.startsWith("Missing playbook phase"))
      ) {
        return fail(ApplicationError.validation(error.message));
      }

      const appError = ApplicationError.unexpected(
        error,
        "Failed to create playbook",
      );
      return fail(appError);
    }
  }
}

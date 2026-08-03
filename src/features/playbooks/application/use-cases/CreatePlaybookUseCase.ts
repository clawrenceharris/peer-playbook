import { ApplicationError } from "@/shared/utils";
import { PlaybookWritePort } from "../ports";
import { CreatePlaybookPhaseCommand } from "../../domain/types";
import { CreatePlaybookInput, CreatePlaybookResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";
import {
  PlaybookMetadataValidationError,
  PlaybookTitle,
  PlaybookTopic,
} from "../../domain/value-objects";
import {
  PlaybookPhaseCollection,
  PlaybookPhaseValidationError,
} from "../../domain/entities";

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
    return PlaybookPhaseCollection.normalize(input.phases).map((phase) => ({
      title: phase.title,
      intentKey: phase.intentKey,
      templatePhaseKey: phase.templatePhaseKey,
      legacyPhase: phase.legacyPhase,
      position: phase.position,
      strategies: phase.strategies ?? [],
    }));
  }

  return buildDefaultPhases(input);
}

export class CreatePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWritePort) {}

  async execute(
    input: CreatePlaybookInput,
  ): Promise<Result<CreatePlaybookResult>> {
    try {
      const { topic, courseName, title, subject, contexts, modes } = input;
      const playbookTitle = PlaybookTitle.create(title);
      const playbookTopic = PlaybookTopic.create(topic);

      const result = await this.playbookRepository.createPlaybook({
        topic: playbookTopic.value,
        courseName: courseName ?? null,
        subject: subject ?? "",
        createdBy: input.userId,
        methodology: null, // TODO: Implement methodology generation
        instructionalModelId: input.instructionalModelId,
        contexts,
        title: playbookTitle.value,
        modes: modes ?? [],
        phases: buildCreatePhases(input),
      });
      return ok(result);
    } catch (error) {
      if (
        error instanceof PlaybookMetadataValidationError ||
        error instanceof PlaybookPhaseValidationError
      ) {
        return fail(ApplicationError.validation(error.message));
      }
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

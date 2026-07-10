import { GetPlaybookPageInput, GetPlaybookPageOutput } from "../dto";

export class PlaybookPageAssembler {
  static toPageDTO(input: GetPlaybookPageInput): GetPlaybookPageOutput {
    const { playbook, strategies, creator, phases = [], sessions = [] } = input;

    return {
      playbook: {
        id: playbook.id,
        topic: playbook.topic,
        methodology: playbook.methodology,
        courseName: playbook.courseName,
        subject: playbook.subject,
        published: playbook.published,
        createdAt: playbook.createdAt,
        updatedAt: playbook.updatedAt,
        phases,
        sessions,
        creator,
      },

      strategies: strategies.map((strategy) => ({
        id: strategy.id,
        title: strategy.title,
        phase: strategy.phase,
        playbookPhaseId: strategy.playbookPhaseId,
        steps: strategy.steps,
        resources: strategy.resources,
        createdAt: strategy.createdAt,
        updatedAt: strategy.updatedAt,
      })),
    };
  }
}

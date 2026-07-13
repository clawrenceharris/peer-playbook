import {
  PlaybookPageInput,
  PlaybooksPageOutput,
} from "../dto/PlaybooksPageDTO";

export class PlaybooksPageAssembler {
  static toOutput(input: PlaybookPageInput): PlaybooksPageOutput {
    return {
      playbooks: input.playbooks.map((playbook) => ({
        ...playbook,
        creator: {
          id: playbook.creator.id,
          displayName:
            playbook.createdBy === input.userId
              ? "You"
              : playbook.creator.displayName,
          avatarUrl: playbook.creator.avatarUrl,
        },
      })),
    };
  }
}

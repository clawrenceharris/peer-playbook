import { PlaybookMetadataValidationError } from "./PlaybookTitle";

export class PlaybookTopic {
  private constructor(readonly value: string) {}

  static create(value: string): PlaybookTopic {
    const normalized = value.trim();
    if (!normalized) {
      throw new PlaybookMetadataValidationError("Playbook topic is required");
    }
    return new PlaybookTopic(normalized);
  }
}

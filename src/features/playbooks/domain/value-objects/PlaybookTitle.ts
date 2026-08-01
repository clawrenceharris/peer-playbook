export class PlaybookTitle {
  private constructor(readonly value: string) {}

  static create(value: string): PlaybookTitle {
    const normalized = value.trim();
    if (!normalized) {
      throw new PlaybookMetadataValidationError("Playbook title is required");
    }
    return new PlaybookTitle(normalized);
  }
}

export class PlaybookMetadataValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaybookMetadataValidationError";
  }
}

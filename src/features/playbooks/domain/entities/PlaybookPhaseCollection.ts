export class PlaybookPhaseValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaybookPhaseValidationError";
  }
}

/** Maintains the ordering and required title invariant for a playbook's phases. */
export class PlaybookPhaseCollection {
  static normalize<T extends { title: string }>(
    phases: readonly T[],
  ): Array<T & { position: number }> {
    return phases.map((phase, position) => {
      const title = phase.title.trim();
      if (!title) {
        throw new PlaybookPhaseValidationError("Phase title is required");
      }
      return { ...phase, title, position };
    });
  }
}

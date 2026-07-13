export type JsonCompletionRequest = {
  system: string;
  user: string;
};

export interface JsonCompletionPort {
  completeJson(request: JsonCompletionRequest): Promise<unknown>;
}

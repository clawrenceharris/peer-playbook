import { openai } from "@/lib/openai/client";
import { JsonCompletionPort, JsonCompletionRequest } from "../../domain";

export class OpenAIJsonCompletionAdapter implements JsonCompletionPort {
  constructor(
    private readonly model: string = process.env.OPENAI_PLAYBOOK_MODEL ??
      "gpt-4.1-mini",
  ) {}

  async completeJson(request: JsonCompletionRequest): Promise<unknown> {
    const response = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: request.system },
        { role: "user", content: request.user },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI provider returned an empty response.");
    }

    return JSON.parse(content);
  }
}

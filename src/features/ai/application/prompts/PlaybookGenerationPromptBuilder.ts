import {
  AiInstructionalContext,
  AiStrategyCatalogItem,
  PlaybookGenerationRequest,
} from "../../domain";

function formatInstructionalContext(context: AiInstructionalContext[]): string {
  return context
    .map(
      (item) =>
        `${item.title}: ${item.description}\n${item.bullets
          .map((bullet) => `- ${bullet}`)
          .join("\n")}`,
    )
    .join("\n\n");
}

function formatCatalog(catalog: AiStrategyCatalogItem[]): string {
  return catalog
    .map(
      (strategy) =>
        `${strategy.slug} | ${strategy.title} | ${strategy.description} | good_for: [${strategy.goodFor.join(", ")}]`,
    )
    .join("\n");
}

export class PlaybookGenerationPromptBuilder {
  build(input: {
    request: PlaybookGenerationRequest;
    catalog: AiStrategyCatalogItem[];
    instructionalContext: AiInstructionalContext[];
  }) {
    const { request, catalog, instructionalContext } = input;

    return {
      system: `You are a Supplemental Instruction lesson planner for college students.
Use only the provided strategy catalog.
Return strict JSON with no markdown or commentary.
The JSON shape must be:
{
  "strategies": [
    { "slug": string, "phase": "warmup" | "workout" | "closer", "rationale": string }
  ]
}
The response must contain exactly three strategies: one warmup, one workout, and one closer.`,
      user: `Lesson:
- Title: ${request.title}
- Subject: ${request.subject}
- Topic: ${request.topic}
- Course: ${request.courseName || "Not specified"}
- Delivery modes: ${request.modes.length ? request.modes.join(", ") : "Not specified"}
- Session contexts: ${request.contexts.length ? request.contexts.join(", ") : "Not specified"}
- Instructor instructions: ${request.instructions || "None"}

Instructional context:
${formatInstructionalContext(instructionalContext)}

Strategy catalog:
${formatCatalog(catalog)}`,
    };
  }
}

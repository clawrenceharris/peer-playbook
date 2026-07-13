import { AiInstructionalContext } from "../../domain";

export const playbookGenerationContext: AiInstructionalContext[] = [
  {
    key: "si-lesson-arc",
    title: "Supplemental Instruction lesson arc",
    description:
      "A playbook should create a cohesive session with a beginning, middle, and closing reflection.",
    bullets: [
      "Warmup activates prior knowledge and lowers the barrier to participation.",
      "Workout is the main collaborative learning activity.",
      "Closer helps students consolidate learning and identify next steps.",
    ],
  },
  {
    key: "strategy-selection",
    title: "Strategy selection rules",
    description:
      "The model must only select official strategies from the provided catalog.",
    bullets: [
      "Prefer strategies whose good_for tags complement the lesson topic and each other.",
      "Use exactly one strategy in each phase.",
      "Do not invent strategy slugs, titles, phases, or steps.",
    ],
  },
];

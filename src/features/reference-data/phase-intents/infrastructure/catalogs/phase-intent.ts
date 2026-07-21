import { Brain, Lightbulb, LucideProps, Puzzle, Search } from "lucide-react";
import { PhaseIntent } from "../../domain/types/PhaseIntent";

export const phaseIntentCatalog: {
  id: PhaseIntent;
  key: "activate" | "explore" | "apply" | "reflect";
  label: string;
  description: string;
  Icon: React.ComponentType<LucideProps>;
}[] = [
  {
    id: PhaseIntent.ACTIVATE,
    key: "activate",
    label: "Activate",
    description: "Build readiness, connection, focus, or prior knowledge.",
    Icon: Brain,
  },
  {
    id: PhaseIntent.EXPLORE,
    key: "explore",
    label: "Explore",
    description:
      "Investigate ideas, clarify concepts, and make meaning together.",
    Icon: Search,
  },
  {
    id: PhaseIntent.APPLY,
    key: "apply",
    label: "Apply",
    description: "Practice, solve, create, collaborate, or teach back.",
    Icon: Puzzle,
  },
  {
    id: PhaseIntent.REFLECT,
    key: "reflect",
    label: "Reflect",
    description: "Synthesize learning, assess progress, and plan next steps.",
    Icon: Lightbulb,
  },
];

import { Brain, Dumbbell, Lightbulb } from "lucide-react";

type PlaybookPhase = "warmup" | "workout" | "closer";

const phaseToPosition: Record<PlaybookPhase, number> = {
  warmup: 0,
  workout: 1,
  closer: 2,
};

const normalizePosition = (value: number | PlaybookPhase): number =>
  typeof value === "number" ? value : phaseToPosition[value];

export const getCardBackgroundColor = (position: number | PlaybookPhase) => {
  switch (normalizePosition(position)) {
    case 0:
      return "bg-success-500";
    case 1:
      return "bg-secondary-500";
    case 2:
      return "bg-accent-400";
  }
};

export const getCardIcon = (position: number | PlaybookPhase) => {
  switch (normalizePosition(position)) {
    case 0:
      return <Brain />;
    case 1:
      return <Dumbbell />;
    default:
      return <Lightbulb />;
  }
};

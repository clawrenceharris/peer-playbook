import {
  Brain,
  Clock,
  Lightbulb,
  LucideProps,
  Puzzle,
  Search,
} from "lucide-react";
import { PhaseIntent } from "../types/PhaseIntent";

export const PHASE_INTENT_LABELS: Record<PhaseIntent, React.ReactNode> = {
  [PhaseIntent.ACTIVATE]: "Activate",
  [PhaseIntent.EXPLORE]: "Explore",
  [PhaseIntent.APPLY]: "Apply",
  [PhaseIntent.REFLECT]: "Reflect",
  [PhaseIntent.TRANSITION]: "Transition",
};

export const PHASE_INTENT_ICONS: Record<
  PhaseIntent,
  React.ComponentType<LucideProps>
> = {
  [PhaseIntent.ACTIVATE]: Brain,
  [PhaseIntent.EXPLORE]: Search,
  [PhaseIntent.APPLY]: Puzzle,
  [PhaseIntent.REFLECT]: Lightbulb,
  [PhaseIntent.TRANSITION]: Clock,
};

export const PHASE_STYLES: Record<
  PhaseIntent,
  {
    icon: string;
    active: string;
    activeStrategy: string;
    card: string;
  }
> = {
  activate: {
    icon: "bg-white/40 text-intent-activate",
    activeStrategy:
      "border-intent-activate border-0 border-l-2 bg-intent-activate/70",
    active: "bg-intent-activate text-intent-activate",
    card: "bg-intent-activate/50  text-intent-activate",
  },
  [PhaseIntent.EXPLORE]: {
    icon: "bg-white/40 text-intent-explore",
    activeStrategy:
      "border-intent-explore border-0 border-l-2 bg-intent-explore/70",
    active: "bg-intent-explore text-intent-explore",
    card: "bg-intent-explore/50  text-intent-explore",
  },
  [PhaseIntent.APPLY]: {
    icon: "bg-white/40 text-intent-apply",
    activeStrategy:
      "border-intent-apply border-0 border-l-2 bg-intent-apply/70",
    active: "bg-intent-apply text-intent-apply",
    card: "bg-intent-apply/50  text-intent-apply",
  },
  [PhaseIntent.REFLECT]: {
    icon: "bg-white/40 text-intent-reflect",
    activeStrategy:
      "border-intent-reflect border-0 border-l-2 bg-intent-reflect/70",
    active: "bg-intent-reflect text-intent-reflect",
    card: "bg-intent-reflect/50  text-intent-reflect",
  },
  [PhaseIntent.TRANSITION]: {
    icon: "bg-white/40 text-intent-transition",
    activeStrategy:
      "border-intent-transition border-0 border-l-2 bg-intent-transition/70",
    active: "bg-intent-transition text-intent-transition",
    card: "bg-intent-transition/50  text-intent-transition",
  },
};

import {
  Atom,
  Beaker,
  BookPlus,
  Code,
  Divide,
  Earth,
  Key,
  Leaf,
  Microscope,
} from "lucide-react";

export const subjects: Record<
  import("@/types").Enums<"course_subject">,
  React.ReactNode
> = {
  Biology: <Leaf />,
  Chemistry: <Beaker />,
  Coding: <Code />,
  Cybersecurity: <Key />,
  Geography: <Earth />,
  Math: <Divide />,
  Physics: <Atom />,
  Science: <Microscope />,
  Other: <BookPlus />,
};

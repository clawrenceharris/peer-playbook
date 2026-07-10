import {
  GetPlaybookCreationPageInput,
  GetPlaybookCreationPageOutput,
} from "../dto";
import {
  Atom,
  Beaker,
  BookOpen,
  BookPlus,
  Code,
  Divide,
  Earth,
  Key,
  Leaf,
  Microscope,
} from "lucide-react";

export const subjects: { id: string; label: string; icon: React.ReactNode }[] =
  [
    { id: "biology", label: "Biology", icon: <Leaf /> },
    { id: "chemistry", label: "Chemistry", icon: <Beaker /> },
    { id: "coding", label: "Coding", icon: <Code /> },
    { id: "cybersecurity", label: "Cybersecurity", icon: <Key /> },
    { id: "geography", label: "Geography", icon: <Earth /> },
    { id: "math", label: "Math", icon: <Divide /> },
    { id: "physics", label: "Physics", icon: <Atom /> },
    { id: "science", label: "Science", icon: <Microscope /> },
    { id: "other", label: "Other", icon: <BookOpen /> },
  ];

export class PlaybookCreationPageAssembler {
  static toPageOutput(
    input: GetPlaybookCreationPageInput,
  ): GetPlaybookCreationPageOutput {
    const { contexts, instructionalModels, strategies } = input;
    return {
      contexts,
      instructionalModels,
      strategies,
      subjects,
    };
  }
}

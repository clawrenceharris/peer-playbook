import { PlaybookStrategyCardDTO } from "./PlaybookStrategyDTO";
import { SessionContextDTO } from "./SessionContextDTO";
import { InstructionalModelDTO } from "@/features/reference-data/instructional-models/application/dto/InstructionalModelDTO";

export type GetPlaybookCreationPageOutput = {
  contexts: SessionContextDTO[];
  instructionalModels: InstructionalModelDTO[];
  strategies: PlaybookStrategyCardDTO[];
  subjects: { id: string; label: string; icon: React.ReactNode }[];
};

export type GetPlaybookCreationPageInput = {
  contexts: SessionContextDTO[];
  instructionalModels: InstructionalModelDTO[];
  strategies: PlaybookStrategyCardDTO[];
};

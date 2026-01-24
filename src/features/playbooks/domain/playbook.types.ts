import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import {
  Playbooks,
  PlaybooksInsert,
  PlaybooksUpdate,
  PlaybookStrategies,
  PlaybookStrategiesInsert,
  PlaybookStrategiesUpdate,
} from "@/types/tables";

export type Playbook = DomainModel<Playbooks>;
export type PlaybookInsert = DomainInsert<PlaybooksInsert>;
export type PlaybookUpdate = DomainUpdate<PlaybooksUpdate>;
export type PlaybookStrategy = DomainModel<PlaybookStrategies> & {
  slug?: string;
  cardSlug?: string;
  position?: number;
};
export type PlaybookStrategyInsert = DomainInsert<PlaybookStrategiesInsert>;
export type PlaybookStrategyUpdate = DomainUpdate<PlaybookStrategiesUpdate> & {
  slug?: string;
  cardSlug?: string;
  position?: number;
};
export type PlaybookWithStrategies = Playbook & { strategies: PlaybookStrategy[] };

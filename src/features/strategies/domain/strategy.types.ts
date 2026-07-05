import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import {
  Strategies,
  StrategiesInsert,
  StrategiesUpdate,
} from "@/types/table.types";

export type Strategy = DomainModel<Strategies>;
export type StrategyInsert = DomainInsert<StrategiesInsert>;
export type StrategyUpdate = DomainUpdate<StrategiesUpdate>;

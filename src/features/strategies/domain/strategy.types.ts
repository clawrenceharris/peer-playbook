import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Strategies, StrategiesInsert, StrategiesUpdate } from "@/types/tables";

export type Strategy = DomainModel<Strategies>;
export type StrategyInsert = DomainInsert<StrategiesInsert>;
export type StrategyUpdate = DomainUpdate<StrategiesUpdate>;

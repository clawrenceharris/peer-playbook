import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import {
  UserStrategies,
  UserStrategiesInsert,
  UserStrategiesUpdate,
} from "@/types/tables";

export type UserStrategy = DomainModel<UserStrategies>;
export type UserStrategyInsert = DomainInsert<UserStrategiesInsert>;
export type UserStrategyUpdate = DomainUpdate<UserStrategiesUpdate>;


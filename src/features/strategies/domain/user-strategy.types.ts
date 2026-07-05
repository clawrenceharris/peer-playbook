import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Strategies } from "@/types";

export type UserStrategy = DomainModel<Strategies>;
export type UserStrategyInsert = DomainInsert<Strategies>;
export type UserStrategyUpdate = DomainUpdate<Strategies>;

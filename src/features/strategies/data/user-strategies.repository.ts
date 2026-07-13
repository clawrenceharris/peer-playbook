import { BaseRepository } from "@/repositories/base.repository";
import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Strategies, StrategiesInsert, StrategiesUpdate } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for user_strategies data operations using Supabase.
 * This is the canonical store for user-created strategies.
 */
type UserStrategy = DomainModel<Strategies>;
type UserStrategyInsert = DomainInsert<StrategiesInsert>;
type UserStrategyUpdate = DomainUpdate<StrategiesUpdate>;

export class UserStrategiesRepository extends BaseRepository<
  Strategies,
  UserStrategy,
  StrategiesInsert,
  StrategiesUpdate,
  UserStrategyInsert,
  UserStrategyUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "user_strategies");
  }
}

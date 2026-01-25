import { BaseRepository } from "@/repositories/base.repository";
import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import {
  UserStrategies,
  UserStrategiesInsert,
  UserStrategiesUpdate,
} from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for user_strategies data operations using Supabase.
 * This is the canonical store for user-created strategies.
 */
type UserStrategy = DomainModel<UserStrategies>;
type UserStrategyInsert = DomainInsert<UserStrategiesInsert>;
type UserStrategyUpdate = DomainUpdate<UserStrategiesUpdate>;

export class UserStrategiesRepository extends BaseRepository<
  UserStrategies,
  UserStrategy,
  UserStrategiesInsert,
  UserStrategiesUpdate,
  UserStrategyInsert,
  UserStrategyUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "user_strategies");
  }
}


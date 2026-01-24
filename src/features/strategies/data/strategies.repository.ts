import { BaseRepository } from "@/repositories/base.repository";
import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Strategies, StrategiesInsert, StrategiesUpdate } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for strategies data operations using Supabase
 * Contains only database access logic, no business rules
 */
type Strategy = DomainModel<Strategies>;
type StrategyInsert = DomainInsert<StrategiesInsert>;
type StrategyUpdate = DomainUpdate<StrategiesUpdate>;

export class StrategiesRepository extends BaseRepository<
  Strategies,
  Strategy,
  StrategiesInsert,
  StrategiesUpdate,
  StrategyInsert,
  StrategyUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "strategies");
  }

  async saveStrategy(userId: string, strategyId: string): Promise<void> {
    const { error } = await this.client.from("saved_strategies").insert({
      user_id: userId,
      strategy_id: strategyId,
    });
    if (error) throw error;
  }

  async unsaveStrategy(userId: string, strategyId: string): Promise<void> {
    const { error } = await this.client
      .from("saved_strategies")
      .delete()
      .eq("user_id", userId)
      .eq("strategy_id", strategyId);
    if (error) throw error;
  }

  async isSaved(userId: string, strategyId: string): Promise<boolean> {
    const { data, error } = await this.client
      .from("saved_strategies")
      .select("id")
      .eq("user_id", userId)
      .eq("strategy_id", strategyId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  }

  async getSavedStrategyIds(userId: string): Promise<string[]> {
    const { data, error } = await this.client
      .from("saved_strategies")
      .select("strategy_id")
      .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((row) => row.strategy_id);
  }

  async getSystemStrategies(): Promise<Strategy[]> {
    const { data, error } = await this.client
      .from("strategies")
      .select("*")
      .order("title", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => this.toDomain(row));
  }

  async getByIds(strategyIds: string[]): Promise<Strategy[]> {
    if (strategyIds.length === 0) return [];
    const { data, error } = await this.client
      .from("strategies")
      .select("*")
      .in("id", strategyIds);
    if (error) throw error;
    return (data ?? []).map((row) => this.toDomain(row));
  }
}

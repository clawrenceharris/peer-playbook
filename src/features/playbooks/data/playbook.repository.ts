import { BaseRepository } from "@/repositories/base.repository";
import { camelizeKeys, DomainInsert, DomainModel, DomainUpdate, snakeizeKeys } from "@/lib/data/naming";
import {
  Playbooks,
  PlaybooksInsert,
  PlaybooksUpdate,
  PlaybookStrategies,
  PlaybookStrategiesUpdate,
} from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for playbooks (lesson plans) data operations using Supabase
 * Contains only database access logic, no business rules
 */
type Playbook = DomainModel<Playbooks>;
type PlaybookInsert = DomainInsert<PlaybooksInsert>;
type PlaybookUpdate = DomainUpdate<PlaybooksUpdate>;
type PlaybookStrategy = DomainModel<PlaybookStrategies>;
type PlaybookStrategyUpdate = DomainUpdate<PlaybookStrategiesUpdate>;

export class PlaybooksRepository extends BaseRepository<
  Playbooks,
  Playbook,
  PlaybooksInsert,
  PlaybooksUpdate,
  PlaybookInsert,
  PlaybookUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "playbooks");
  }

  private toStrategyDomain(strategy: PlaybookStrategies): PlaybookStrategy {
    return camelizeKeys(strategy);
  }

  private toStrategyUpdate(update: PlaybookStrategyUpdate): PlaybookStrategiesUpdate {
    return snakeizeKeys(update) as PlaybookStrategiesUpdate;
  }

  async getPlaybookStrategies(playbookId: string): Promise<PlaybookStrategy[]> {
    const { error, data } = await this.client
      .from("playbook_strategies")
      .select()
      .eq("playbook_id", playbookId)
      .order("position");
    if (error) {
      throw error;
    }
    return (data ?? []).map((row) => this.toStrategyDomain(row));
  }
  async updatePlaybookStrategy(
    strategyId: string,
    data: PlaybookStrategyUpdate
  ): Promise<PlaybookStrategy> {
    const { error, data: card } = await this.client
      .from("playbook_strategies")
      .update<PlaybookStrategiesUpdate>(this.toStrategyUpdate(data))
      .eq("id", strategyId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return this.toStrategyDomain(card);
  }

  async deletePlaybookStrategy(strategyId: string): Promise<void> {
    const { error } = await this.client
      .from("playbook_strategies")
      .delete()
      .eq("id", strategyId);

    if (error) throw error;
  }
}


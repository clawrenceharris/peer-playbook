import { SupabaseClient } from "@supabase/supabase-js";

export abstract class BaseService<TDomain, TUpdate, TInsert> {
  protected constructor(
    protected readonly client: SupabaseClient,
    protected readonly tableName: string
  ) {}

  async getById(id: string): Promise<TDomain | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;

    return data;
  }

  async getSingleBy(column: string, value: string): Promise<TDomain> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select()
      .eq(column, value)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(data: TInsert): Promise<TDomain> {
    const { data: result, error } = await this.client
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update(id: string, updatedFields: TUpdate): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .update(updatedFields)
      .eq("id", id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
  async getAllBy(column: string, value: string): Promise<TDomain[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select()
      .eq(column, value)
      .order("created_at", { ascending: true });
    if (error) {
      throw error;
    }
    return data || [];
  }

  async getAll(): Promise<TDomain[]> {
    const { data, error } = await this.client.from(this.tableName).select();
    if (error) {
      throw error;
    }
    return data || [];
  }
}

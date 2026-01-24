import { BaseRepository } from "@/repositories/base.repository";
import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Sessions, SessionsInsert, SessionsUpdate } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for sessions data operations using Supabase
 * Contains only database access logic, no business rules
 */
type Session = DomainModel<Sessions>;
type SessionInsert = DomainInsert<SessionsInsert>;
type SessionUpdate = DomainUpdate<SessionsUpdate>;

export class SessionsRepository extends BaseRepository<
  Sessions,
  Session,
  SessionsInsert,
  SessionsUpdate,
  SessionInsert,
  SessionUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "sessions");
  }
}

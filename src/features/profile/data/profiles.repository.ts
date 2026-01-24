import { BaseRepository } from "@/repositories/base.repository";
import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Profiles, ProfilesInsert, ProfilesUpdate } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for profile data operations using Supabase
 * Contains only database access logic, no business rules
 */
type Profile = DomainModel<Profiles>;
type ProfileInsert = DomainInsert<ProfilesInsert>;
type ProfileUpdate = DomainUpdate<ProfilesUpdate>;

export class ProfilesRepository extends BaseRepository<
  Profiles,
  Profile,
  ProfilesInsert,
  ProfilesUpdate,
  ProfileInsert,
  ProfileUpdate
> {
  constructor(client: SupabaseClient) {
    super(client, "profiles");
  }
}

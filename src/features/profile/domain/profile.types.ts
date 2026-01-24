import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Profiles, ProfilesInsert, ProfilesUpdate } from "@/types/tables";

export type Profile = DomainModel<Profiles>;
export type ProfileInsert = DomainInsert<ProfilesInsert>;
export type ProfileUpdate = DomainUpdate<ProfilesUpdate>;

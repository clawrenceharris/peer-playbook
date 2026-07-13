import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Profiles, ProfilesInsert, ProfilesUpdate } from "@/types";

/**
 * @deprecated Use Profile DTO instead
 */
export type Profile = DomainModel<Profiles>;

/**
 * @deprecated Use Profile Create DTO instead
 */
export type ProfileInsert = DomainInsert<ProfilesInsert>;

/**
 * @deprecated Use Profile Update DTO instead
 */
export type ProfileUpdate = DomainUpdate<ProfilesUpdate>;

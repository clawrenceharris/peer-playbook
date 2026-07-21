import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Sessions, SessionsInsert, SessionsUpdate } from "@/types/table.types";

export type Session = DomainModel<Sessions>;
export type SessionInsert = DomainInsert<SessionsInsert>;
export type SessionUpdate = DomainUpdate<SessionsUpdate>;

import z from "zod";
import { DomainInsert, DomainModel, DomainUpdate } from "@/lib/data/naming";
import { Sessions, SessionsInsert, SessionsUpdate } from "@/types/tables";
import { createSessionSchema } from "./sessions.schema";

export type Session = DomainModel<Sessions>;
export type SessionInsert = DomainInsert<SessionsInsert>;
export type SessionUpdate = DomainUpdate<SessionsUpdate>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;

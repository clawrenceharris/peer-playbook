import { SupabaseClient } from "@supabase/supabase-js";
import { SessionsRepository } from "../data";
import { Session, SessionInsert, SessionUpdate } from "./session.types";

export const createSessionService = (client: SupabaseClient) => {
  const repository = new SessionsRepository(client);

  const getAll = () => repository.getAll();
  const getById = (id: string) => repository.getById(id);
  const getAllByUser = (userId: string) =>
    repository.getAllBy("leaderId", userId);

  const createSession = (data: SessionInsert): Promise<Session> =>
    repository.create(data);

  const updateSession = (id: string, data: SessionUpdate): Promise<Session> =>
    repository.update(id, data);

  const deleteSession = (id: string): Promise<void> => repository.delete(id);

  return {
    getAll,
    getById,
    getAllByUser,
    createSession,
    updateSession,
    deleteSession,
  };
};

export type SessionService = ReturnType<typeof createSessionService>;

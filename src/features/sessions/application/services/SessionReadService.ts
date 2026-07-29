// import { SupabaseClient } from "@supabase/supabase-js";
// import { SessionsRepository } from "../data";
// import { Session, SessionInsert, SessionUpdate } from "./session.types";
// import { supabase } from "@/lib/supabase/client";
// import { SessionMapper } from "../infrastructure/mappers/SessionMapper";
// import { SessionCardDTO } from "../application/dto";
// import { SessionReadRepository } from "./repositories/SessionReadRepository";

// export const createSessionService = (readRepository, client: SupabaseClient) => {
//   const readRepository = new SessionReadRepository();
//   const getAll = async (): Promise<SessionCardDTO[]> => {
//     const { data, error } = await supabase.from("sessions").select(`
//       *,
//       profiles (
//         id,
//         first_name,
//         last_name,
//         avatar_url
//       )
//     `);
//     if (error) {
//       throw error;
//     }
//     return data.map((session) => SessionMapper.toCard(session));
//   };
//   const getById = (id: string) => repository.getById(id);
//   const getAllByUser = async (userId: string): Promise<SessionCardDTO[]> => {
//     const { data, error } = await supabase.from("sessions").select(`
//       *,
//       profiles (
//         id,
//         first_name,
//         last_name,
//         avatar_url
//       )
//     `).eq("instructorId", userId);
//     if (error) {
//       throw error;
//     }
//     return data.map((session) => SessionMapper.toCard(session));

// }

//   const createSession = (data: SessionInsert): Promise<Session> =>
//     repository.create(data);

//   const updateSession = (id: string, data: SessionUpdate): Promise<Session> =>
//     repository.update(id, data);

//   const deleteSession = (id: string): Promise<void> => repository.delete(id);

//   return {
//     getAll,
//     getById,
//     getAllByUser,
//     createSession,
//     updateSession,
//     deleteSession,
//   };
// };

// export type SessionService = ReturnType<typeof createSessionService>;

import { fail, ok, Result } from "@/shared/application";

import { normalizeError } from "@/shared/utils";
import { SessionReadPort } from "../ports";
import { SessionCardDTO, SessionDetailDTO } from "../dto";

export class SessionReadService {
  //   const readRepository = new SessionReadRepository();
  //   const getAll = async (): Promise<SessionCardDTO[]> => {
  //     const { data, error } = await supabase.from("sessions").select(`
  //       *,
  //       profiles (
  //         id,
  //         first_name,
  //         last_name,
  //         avatar_url
  //       )
  //     `);
  //     if (error) {
  //       throw error;
  //     }
  //     return data.map((session) => SessionMapper.toCard(session));
  //   };
  //   const getById = (id: string) => repository.getById(id);
  //   const getAllByUser = async (userId: string): Promise<SessionCardDTO[]> => {
  //     const { data, error } = await supabase.from("sessions").select(`
  //       *,
  //       profiles (
  //         id,
  //         first_name,
  //         last_name,
  //         avatar_url
  //       )
  //     `).eq("instructorId", userId);
  //     if (error) {
  //       throw error;
  //     }
  //     return data.map((session) => SessionMapper.toCard(session));
  // }
  //   const createSession = (data: SessionInsert): Promise<Session> =>
  //     repository.create(data);
  //   const updateSession = (id: string, data: SessionUpdate): Promise<Session> =>
  //     repository.update(id, data);
  //   const deleteSession = (id: string): Promise<void> => repository.delete(id);
  //   return {
  //     getAll,
  //     getById,
  //     getAllByUser,
  //     createSession,
  //     updateSession,
  //     deleteSession,
  //   };
  // };
  // export type SessionService = ReturnType<typeof createSessionService>;
  async getByCode(code: string): Promise<Result<SessionDetailDTO | null>> {
    try {
      const session = await this.readRepository.findByCode(code);

      return ok(session);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
  constructor(private readonly readRepository: SessionReadPort) {}
  async listByUserId(userId: string): Promise<Result<SessionCardDTO[]>> {
    try {
      const sessions = await this.readRepository.listByUserId(userId);
      return ok(sessions);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async getDetailById(
    sessionId: string,
  ): Promise<Result<SessionDetailDTO | null>> {
    try {
      const session = await this.readRepository.findDetailById(sessionId);
      return ok(session);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async getCardById(sessionId: string): Promise<Result<SessionCardDTO | null>> {
    try {
      const strategies = await this.readRepository.findCardById(sessionId);
      return ok(strategies);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async listPlaybookStrategyDetails(
    sessionId: string,
  ): Promise<Result<SessionDetailDTO | null>> {
    try {
      const session = await this.readRepository.findDetailById(sessionId);
      return ok(session);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

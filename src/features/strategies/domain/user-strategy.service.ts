import { SupabaseClient } from "@supabase/supabase-js";
import { UserStrategiesRepository } from "../data";
import { UserStrategy, UserStrategyInsert, UserStrategyUpdate } from "./user-strategy.types";

export const createUserStrategyService = (client: SupabaseClient) => {
  const repository = new UserStrategiesRepository(client);

  const getAll = () => repository.getAll();
  const getById = (id: string) => repository.getById(id);
  const getAllByOwner = (ownerId: string) => repository.getAllBy("ownerId", ownerId);

  const create = (data: UserStrategyInsert): Promise<UserStrategy> => repository.create(data);
  const update = (id: string, data: UserStrategyUpdate): Promise<UserStrategy> =>
    repository.update(id, data);
  const remove = (id: string): Promise<void> => repository.delete(id);

  return {
    getAll,
    getById,
    getAllByOwner,
    create,
    update,
    delete: remove,
  };
};

export type UserStrategyService = ReturnType<typeof createUserStrategyService>;


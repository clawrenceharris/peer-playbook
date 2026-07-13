import { AiStrategyCatalogItem } from "../types/playbook-generation.types";

export interface StrategyCatalogRepository {
  listForPlaybookGeneration(
    contextKeys: string[],
  ): Promise<AiStrategyCatalogItem[]>;
}

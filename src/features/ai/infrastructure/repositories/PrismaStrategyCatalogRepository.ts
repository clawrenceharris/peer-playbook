import { type PrismaClient } from "@/lib/db/client";
import { AiStrategyCatalogItem, StrategyCatalogRepository } from "../../domain";

export class PrismaStrategyCatalogRepository implements StrategyCatalogRepository {
  constructor(private readonly client: PrismaClient = client) {}

  async listForPlaybookGeneration(
    contextKeys: string[],
  ): Promise<AiStrategyCatalogItem[]> {
    const contextRecords =
      contextKeys.length > 0
        ? await this.client.session_contexts.findMany({
            where: { key: { in: contextKeys } },
            select: { context: true },
          })
        : [];
    const contextValues = contextRecords.map((record) => record.context);
    if (contextKeys.length > 0 && contextValues.length === 0) {
      return [];
    }

    const records = await this.client.strategies.findMany({
      where: {
        published: true,
        ...(contextValues.length > 0 && {
          strategy_contexts: {
            some: {
              context: { in: contextValues },
            },
          },
        }),
      },
      orderBy: { title: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        description: true,
        good_for: true,
      },
    });

    return records.map((record) => ({
      id: record.id,
      slug: record.slug,
      title: record.title,
      category: record.category,
      description: record.description,
      goodFor: record.good_for,
    }));
  }
}

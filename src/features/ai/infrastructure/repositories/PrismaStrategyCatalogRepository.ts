import { type PrismaClient } from "@/lib/db/client";
import { AiStrategyCatalogItem, StrategyCatalogRepository } from "../../domain";

export class PrismaStrategyCatalogRepository implements StrategyCatalogRepository {
  constructor(private readonly client: PrismaClient = client) {}

  async listForPlaybookGeneration(
    contextKeys: string[],
  ): Promise<AiStrategyCatalogItem[]> {
    console.log("contextKeys", contextKeys);
    if (!contextKeys.length) {
      return [];
    }

    // direct join with strategy_contexts based on context
    const records = await this.client.strategies.findMany({
      where: {
        published: true,
        strategy_contexts: {
          some: {
            context: { in: contextKeys },
          },
        },
      },
      orderBy: { title: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        description: true,
        good_for: true,
        virtual_friendly: true,
        session_size: true,
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

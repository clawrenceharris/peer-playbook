import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * Prisma is the primary server-side data path for migrated features.
 * Supabase still handles auth and some legacy reads, so importing from this
 * module is the clearest signal that a flow is on the Prisma/Postgres path.
 */
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const client = new PrismaClient({ adapter });

export { client };
export * from "../../generated/prisma/client";

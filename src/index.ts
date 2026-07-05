import { drizzle } from "drizzle-orm/postgres-js";
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const db = drizzle(process.env.DATABASE_URL);
  console.log(db);
}
main();

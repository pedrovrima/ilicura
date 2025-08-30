import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schema";

const logQuery = (query: string, params: unknown[]) => {
  console.log("[DRIZZLE QUERY]", query, params);
};

export const db = drizzle(postgres(env.DATABASE_URL, { prepare: false }), {
  schema,
});

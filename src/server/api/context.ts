// server/api/context.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { createClient } from "@/utils/supabase/server";
import { ensureAuthorForSupabaseUser } from "@/server/db/ensureAuthor";

export type Ctx = {
  db: ReturnType<typeof drizzle>;
  user: { authorId: number } | null;
};

export async function createTRPCContext(): Promise<Ctx> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  console.table("data");
  console.table(data);
  console.table("error");
  console.table(error);
  const supaUser = data.user;
  console.table("supaUser");
  console.table(supaUser);
  let user: Ctx["user"] = null;
  if (supaUser) {
    const authorId = await ensureAuthorForSupabaseUser(db, {
      id: supaUser.id,
      email: supaUser.email,
      user_metadata: supaUser.user_metadata ?? null,
    });
    user = { authorId };
  }

  return { db, user };
}

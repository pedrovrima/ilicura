// src/server/db/ensureAuthor.ts
import { eq } from "drizzle-orm";
import { authors } from "@/server/db/schema";

export async function ensureAuthorForSupabaseUser(
  db: any,
  u: { id: string; email?: string | null; user_metadata?: any },
) {
  const got = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.userId, u.id))
    .limit(1);
  if (got.length) return got[0].id;

  const name =
    u?.user_metadata?.full_name ?? u?.user_metadata?.name ?? u?.email ?? u.id;

  const ins = await db
    .insert(authors)
    .values({ userId: u.id, email: u.email ?? null, name })
    .onConflictDoNothing({ target: authors.userId })
    .returning({ id: authors.id });

  if (ins.length) return ins[0].id;

  const again = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.userId, u.id))
    .limit(1);
  if (!again.length) throw new Error("Failed to ensure author");
  return again[0].id;
}

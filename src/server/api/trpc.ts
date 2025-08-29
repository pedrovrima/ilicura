// src/server/api/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { createClient } from "@/utils/supabase/server"; // your SSR helper
import { ensureAuthorForSupabaseUser } from "@/server/db/ensureAuthor";
import { sql } from "drizzle-orm";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = await createClient(); // must work in API routes (SSR)
  const { data } = await supabase.auth.getSession();
  const sUser = data.session?.user;

  let user: { authorId: number } | null = null;

  if (sUser) {
    const authorId = await ensureAuthorForSupabaseUser(db, {
      id: sUser.id,
      email: sUser.email,
      user_metadata: sUser.user_metadata ?? null,
    });
    user = { authorId, dataSourceId: 1 };
  } else {
    // TEMP DEV FALLBACK — remove in prod:
    const sys = Number(process.env.SYSTEM_AUTHOR_ID || 0);
    if (sys) user = { authorId: sys };
  }

  return { db, user, ...opts };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */ const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next();
});

const actorTx = t.middleware(async ({ ctx, next, rawInput }) => {
  const authorId = ctx.user!.authorId;
  const dataSourceId = 1;

  return ctx.db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.author_id', ${authorId}::text, true)`,
    );
    await tx.execute(
      sql`select set_config('app.data_source_id', ${dataSourceId}::text, true)`,
    );

    const result = await next({ ctx: { ...ctx, db: tx } }); // IMPORTANT: pass tx
    return result;
  });
});

export const writeProcedure = publicProcedure.use(requireUser).use(actorTx);

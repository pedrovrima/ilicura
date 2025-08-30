// src/server/api/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { createClient } from "@/utils/supabase/server"; // your SSR helper
import { ensureAuthorForSupabaseUser } from "@/server/db/ensureAuthor";
import { sql } from "drizzle-orm";
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const sUser = data.user;

  let user: { authorId: number } | null = null;
  if (sUser) {
    const authorId = await ensureAuthorForSupabaseUser(db, {
      id: sUser.id,
      email: sUser.email,
      user_metadata: sUser.user_metadata ?? null,
    });
    user = { authorId };
  } else {
    const sys = Number(process.env.SYSTEM_AUTHOR_ID || 0);
    if (sys) user = { authorId: sys };
  }

  return { db, user, ...opts };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
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
  console.table("requireUser");
  console.table(ctx);
  console.table("user ctx");
  console.table(ctx.user);
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next();
});

/**
 * ✅ Minimal and correct transaction wrapper:
 * - starts a tx
 * - sets GUCs (LOCAL to this tx)
 * - RETURNS the `next()` promise directly (so commit happens when resolver finishes)
 * - logs and rethrows on error
 */

function guardTx<TDb extends typeof ctx.db>(tx: TDb) {
  let closed = false;
  const markClosed = () => {
    closed = true;
  };
  const handler: ProxyHandler<any> = {
    get(target, prop, recv) {
      const v = Reflect.get(target, prop, recv);
      if (typeof v !== "function") return v;
      return (...args: any[]) => {
        if (closed) {
          // dump stack so you see where it happened
          console.error("❌ TX USED AFTER CLOSE", {
            prop,
            args,
            stack: new Error().stack,
          });
          throw new Error("Transaction used after it was closed");
        }
        return v.apply(target, args);
      };
    },
  };
  return { guarded: new Proxy(tx as any, handler) as TDb, markClosed };
}

const actorTx = t.middleware(async ({ ctx, next }) => {
  const authorId = ctx.user!.authorId;
  const DATA_SOURCE_ID = 1;
  return ctx.db.transaction(async (rawTx) => {
    const { guarded: tx, markClosed } = guardTx(rawTx as any);

    try {
      if (authorId != null) {
        console.log("DATA_SOURCE_ID", DATA_SOURCE_ID, "authorId", authorId);
        await tx.execute(
          sql`select set_config('app.author_id', ${authorId.toString()}, true)`,
        );
      }
      await tx.execute(
        sql`select set_config('app.data_source_id', ${DATA_SOURCE_ID.toString()}, true)`,
      );
      const ret = await next({ ctx: { db: tx } });
      return ret;
    } finally {
      // when the callback returns, mark the tx as closed
      markClosed();
    }
  });
});

const actorTx2 = t.middleware(async ({ ctx, next }) => {
  const authorId = ctx.user!.authorId;
  const DATA_SOURCE_ID = 1;

  let txid: string | number = "n/a";

  try {
    const result = await ctx.db.transaction(async (tx) => {
      // mark tx for debugging
      // const r = await tx.execute(sql`select txid_current() as txid`);
      // txid =
      //   (Array.isArray(r) ? (r as any)[0] : (r as any).rows?.[0])?.txid ??
      //   "n/a";
      // console.log("actorTx start", { txid, authorId, DATA_SOURCE_ID });

      // set LOCAL GUCs for policies/triggers
      // if (authorId != null) {
      //   console.log("DATA_SOURCE_ID", DATA_SOURCE_ID, "authorId", authorId);
      //   await tx.execute(
      //     sql`select set_config('app.author_id', ${authorId.toString()}, true)`,
      //   );
      // }
      // await tx.execute(
      //   sql`select set_config('app.data_source_id', ${DATA_SOURCE_ID.toString()}, true)`,
      // );

      // run resolver with the tx-bound db
      const ret = await next({ ctx: { ...ctx, db: tx } });

      // (Optional but very helpful) force any DEFERRABLE constraints to check now
      // so errors happen *inside* this callback (and are caught above).
      // await tx.execute(sql`SET CONSTRAINTS ALL IMMEDIATE`);

      return ret;
    });

    return result;
  } catch (err) {
    console.error("actorTx rolled back", { txid, err });
    throw err;
  }
});

// Use this ONLY for mutations (writes)
export const writeProcedure = publicProcedure.use(requireUser).use(actorTx);

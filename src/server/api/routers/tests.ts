import { sql } from "drizzle-orm";
import { writeProcedure } from "@/server/api/trpc";

export const whoAmI = writeProcedure.mutation(async ({ ctx }) => {
  const rows = await ctx.db.execute(
    sql`select current_setting('app.author_id', true) as author_id,
                 current_setting('app.data_source_id', true) as data_source_id`,
  );
  // depending on driver, rows may be at rows[0] or rows[0].author_id
  const r = Array.isArray(rows) ? (rows[0] as any) : (rows as any).rows?.[0];
  return {
    authorId: r?.author_id ?? null,
    dataSourceId: r?.data_source_id ?? null,
  };
});

import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { moltStrategies, species } from "@/server/db/schema";

type SpeciesData = typeof species.$inferSelect;

interface SpeciesByIdReturn extends SpeciesData {
  moltStrategies: (typeof moltStrategies.$inferSelect)[] | [];
}

export const speciesRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }): Promise<SpeciesByIdReturn> => {
      const data = await ctx.db
        .select()
        .from(species)
        .where(eq(species.id, input.id))
        .leftJoin(moltStrategies, eq(species.id, moltStrategies.speciesId));

      const filteredData = data.filter((d) => d !== null); // Filter out null values

      const speciesData = filteredData[0]?.species;

      const moltStrategiesData = filteredData.map((d) => d.molt_strategy);

      if (!moltStrategiesData[0])
        return { ...speciesData, moltStrategies: [] } as SpeciesByIdReturn;

      return {
        ...speciesData,
        moltStrategies:
          moltStrategiesData as (typeof moltStrategies.$inferSelect)[],
      } as SpeciesByIdReturn;
    }),
});

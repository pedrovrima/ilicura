import { z } from "zod";
import { eq, ilike, or } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  moltStrategies,
  species,
  speciesMoltExtensions,
  skull,
  sexualDimorphism,
  moltLimits,
} from "@/server/db/schema";

type SpeciesData = typeof species.$inferSelect;

interface SpeciesByIdReturn extends SpeciesData {
  moltStrategies: (typeof moltStrategies.$inferSelect)[] | [];
  skull: (typeof skull.$inferSelect)[] | [];
  moltExtensions: {
    moltType: string;
    extensions: { id: number; extension: string }[];
  }[];
  sexualDimorphism: (typeof sexualDimorphism.$inferSelect)[] | [];
  moltLimits: {
    age: string;
    limits: { id: number; limit: string; notes: string | null }[];
  }[];
}

export const speciesRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(species)
        .where(
          or(
            ilike(species.enName, `%${input.query}%`),
            ilike(species.ptName, `%${input.query}%`),
            ilike(species.scientificName, `%${input.query}%`),
            ilike(species.sciCode, `%${input.query}%`),
          ),
        );

      return data;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }): Promise<SpeciesByIdReturn> => {
      const strategiesData = await ctx.db
        .select()
        .from(species)
        .where(eq(species.id, input.id))
        .leftJoin(moltStrategies, eq(species.id, moltStrategies.speciesId));

      const extensionsData = await ctx.db
        .select()
        .from(speciesMoltExtensions)
        .where(eq(speciesMoltExtensions.speciesId, input.id));

      const skullData = await ctx.db
        .select()
        .from(skull)
        .where(eq(skull.speciesId, input.id));

      const sexualDimorphismData = await ctx.db
        .select()
        .from(sexualDimorphism)
        .where(eq(sexualDimorphism.speciesId, input.id));

      const moltLimitData = await ctx.db
        .select()
        .from(moltLimits)
        .where(eq(moltLimits.speciesId, input.id));

      const moltLimitsByAge = moltLimitData.reduce(
        (acc, curr) => {
          const key = curr.age;
          if (!curr.limit || !key) return acc;
          if (!acc.find((d) => d.age === key)) {
            acc.push({
              age: key,
              limits: [{ id: curr.id, limit: curr.limit, notes: curr.notes }],
            });
            return acc;
          }
          const index = acc.findIndex((d) => d.age === key);
          acc[index]?.limits.push({
            id: curr.id,
            limit: curr.limit,
            notes: curr.notes,
          });
          return acc;
        },
        [] as {
          age: string;
          limits: { id: number; limit: string; notes: string | null }[];
        }[],
      );

      //group extensionData by moltType, using it as moltType key
      const groupedExtensions = extensionsData.reduce(
        (acc, curr) => {
          const key = curr.moltType;
          if (!curr.extension || !key) return acc;
          if (!acc.find((d) => d.moltType === key)) {
            acc.push({
              moltType: key,
              extensions: [{ id: curr.id, extension: curr.extension }],
            });
            return acc;
          }
          const index = acc.findIndex((d) => d.moltType === key);
          acc[index]?.extensions.push({
            id: curr.id,
            extension: curr.extension,
          });
          return acc;
        },
        [] as {
          moltType: string;
          extensions: { id: number; extension: string }[];
        }[],
      );

      const filteredData = strategiesData.filter((d) => d !== null); // Filter out null values

      const speciesData = filteredData[0]?.species;

      const moltStrategiesData = filteredData
        .map((d) => d.molt_strategy)
        .filter((d) => d !== null);

      return {
        ...speciesData,
        sexualDimorphism: sexualDimorphismData,
        moltStrategies:
          moltStrategiesData as (typeof moltStrategies.$inferSelect)[],
        skull: skullData as (typeof skull.$inferSelect)[],
        moltLimits: moltLimitsByAge,
        moltExtensions: groupedExtensions as {
          moltType: string;
          extensions: { id: number; extension: string }[];
        }[],
      } as SpeciesByIdReturn;
    }),
});

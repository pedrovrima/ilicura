import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  moltExtensionEnum,
  moltStrategies,
  moltStrategiesEnum,
  moltTypesEnum,
  species,
  speciesMoltExtensions,
} from "@/server/db/schema";

export const speciesInfoRouter = createTRPCRouter({
  addSpeciesStrategy: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        strategy: z.enum(moltStrategiesEnum.enumValues),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(moltStrategies).values({
        speciesId: input.speciesId,
        strategy: input.strategy,
      });
    }),
  deleteSpeciesStrategy: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(moltStrategies)
        .where(eq(moltStrategies.id, input.id));
    }),
  getSpeciesStrategies: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(moltStrategies)
        .where(eq(moltStrategies.speciesId, input.speciesId));
      return data;
    }),
  addSpeciesMoltExtension: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        moltType: z.enum(moltTypesEnum.enumValues),
        extension: z.enum(moltExtensionEnum.enumValues),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log(input);
      return ctx.db.insert(speciesMoltExtensions).values({
        speciesId: input.speciesId,
        moltType: input.moltType,
        extension: input.extension,
      });
    }),
  deleteSpeciesMoltExtension: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(speciesMoltExtensions)
        .where(eq(speciesMoltExtensions.id, input.id));
    }),

  getSpeciesMoltExtensions: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(speciesMoltExtensions)
        .where(eq(speciesMoltExtensions.speciesId, input.speciesId));

      const moltTypeCollapsedData: {
        name: string;
        extensions: string[] | [];
      }[] = data.reduce(
        (
          acc: {
            name: string;
            extensions: string[];
          }[],
          curr,
        ) => {
          const thisMoltData = acc.find((d) => d.name === curr.moltType);
          if (!curr.extension) return acc;
          if (curr.moltType === null) return acc;
          if (thisMoltData) {
            thisMoltData.extensions.push(curr?.extension);
            const accWithoutThisMoltData = acc.filter(
              (d) => d.name !== curr.moltType,
            );
            return [...accWithoutThisMoltData, thisMoltData];
          }
          return [
            ...acc,
            {
              name: curr.moltType,
              extensions: [curr.extension],
            },
          ];
        },
        [],
      );

      return moltTypeCollapsedData;
    }),
});

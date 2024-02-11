import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  agesEnum,
  bandSizeEnum,
  cemaveBandSize,
  moltExtensionEnum,
  moltLimits,
  moltLimitsEnum,
  moltStrategies,
  moltStrategiesEnum,
  moltTypesEnum,
  sexualDimorphism,
  skull,
  skullClosesEnum,
  speciesMoltExtensions,
} from "@/server/db/schema";

export const speciesInfoRouter = createTRPCRouter({
  addBandSize: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        bandSize: z.enum(bandSizeEnum.enumValues),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(cemaveBandSize).values({
        speciesId: input.speciesId,
        bandSize: input.bandSize,
      });
    }),
  deleteBandSize: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(cemaveBandSize)
        .where(eq(cemaveBandSize.id, input.id));
    }),
  getBandSize: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(cemaveBandSize)
        .where(eq(cemaveBandSize.speciesId, input.speciesId));
      return data;
    }),

  addMoltLimits: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        age: z.enum(agesEnum.enumValues),
        limit: z.enum(moltLimitsEnum.enumValues),
        notes: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(moltLimits).values({
        speciesId: input.speciesId,
        age: input.age,
        limit: input.limit,
        notes: input.notes,
      });
    }),

  deleteMoltLimits: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(moltLimits).where(eq(moltLimits.id, input.id));
    }),
  getMoltLimits: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(moltLimits)
        .where(eq(moltLimits.speciesId, input.speciesId));
      return data;
    }),

  addSexualDimorphism: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        sexualDimorphism: z.boolean(),
        age: z.enum(agesEnum.enumValues),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(sexualDimorphism).values({
        speciesId: input.speciesId,
        sexualDimorphism: input.sexualDimorphism,
        age: input.age,
      });
    }),
  deleteSexualDimorphism: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(sexualDimorphism)
        .where(eq(sexualDimorphism.id, input.id));
    }),
  getSexualDimorphism: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(sexualDimorphism)
        .where(eq(sexualDimorphism.speciesId, input.speciesId));
      return data;
    }),

  addSpeciesSkullInfo: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        closes: z.enum(skullClosesEnum.enumValues),
        notes: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(skull).values({
        speciesId: input.speciesId,
        closes: input.closes,
        notes: input.notes,
      });
    }),
  deleteSpeciesSkullInfo: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(skull).where(eq(skull.id, input.id));
    }),

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

  getSpeciesRawMoltExtensions: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(speciesMoltExtensions)
        .where(eq(speciesMoltExtensions.speciesId, input.speciesId));

      return data;
    }),

  getSkullInfo: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(skull)
        .where(eq(skull.speciesId, input.speciesId));
      return data;
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

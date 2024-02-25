import { z } from "zod";
import { eq, ilike, or } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  moltStrategies,
  species,
  speciesMoltExtensions,
  skull,
  cemaveBandSize,
  moltLimits,
  speciesAgeInfo,
  speciesSexInfo,
} from "@/server/db/schema";

type SpeciesData = typeof species.$inferSelect;
type CompleteMoltExtesion = typeof speciesMoltExtensions.$inferSelect & {
  moltLimits: (typeof moltLimits.$inferSelect)[] | [];
};
type CompleteAgeInfo = typeof speciesAgeInfo.$inferSelect & {
  sex: (typeof speciesSexInfo.$inferSelect)[] | [];
};

interface SpeciesByIdReturn extends SpeciesData {
  moltStrategies: (typeof moltStrategies.$inferSelect)[] | [];
  skull: (typeof skull.$inferSelect)[] | [];
  moltExtensions: {
    moltType: string;
    extensions: { id: number; extension: string }[];
    molLimits: { id: number; limit: string; notes: string | null }[];
  }[];
  bandSize: (typeof cemaveBandSize.$inferSelect)[];
  ageInfo: CompleteAgeInfo[];
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

      const ageInfo = await ctx.db
        .select()
        .from(speciesAgeInfo)
        .where(eq(speciesAgeInfo.speciesId, input.id))
        .leftJoin(speciesSexInfo, eq(speciesAgeInfo.id, speciesSexInfo.ageId));

      const groupedAgeInfo = ageInfo.reduce(
        (acc: CompleteAgeInfo[], curr): CompleteAgeInfo[] => {
          const key = curr.species_age_info.age;
          const thisAge = acc.find((d) => d.age === key);
          if (!key) return acc;
          if (!thisAge) {
            return [
              ...acc,
              {
                ...curr.species_age_info,
                sex: curr.specues_sex_info ? [curr.specues_sex_info] : [],
              },
            ];
          }

          const noThis = acc.filter((d) => d.age !== key);

          return [
            ...noThis,
            {
              ...thisAge,
              sex: [
                ...thisAge.sex,
                curr.specues_sex_info,
              ] as (typeof speciesSexInfo.$inferSelect)[],
            },
          ];
        },
        [],
      );

      const extensionsData = await ctx.db
        .select()
        .from(speciesMoltExtensions)
        .leftJoin(
          moltLimits,
          eq(speciesMoltExtensions.id, moltLimits.speciesMoltExtensionId),
        )
        .where(eq(speciesMoltExtensions.speciesId, input.id));

      const combinedExtensionData = extensionsData.reduce(
        (combinedExtensions: CompleteMoltExtesion[], extension) => {
          if (!extension) return combinedExtensions;
          const thisMoltType = combinedExtensions.find(
            (d) =>
              d.moltType === extension.species_molt_extensions.moltType &&
              d.extension === extension.species_molt_extensions.extension,
          );
          if (thisMoltType && extension.molt_limits) {
            const ext = combinedExtensions.filter(
              (d) => d.moltType !== extension.species_molt_extensions.moltType,
            );
            return [
              ...ext,
              {
                ...thisMoltType,
                moltLimits: [...thisMoltType.moltLimits, extension.molt_limits],
              },
            ];
          }

          combinedExtensions.push({
            ...extension.species_molt_extensions,
            moltLimits: extension.molt_limits ? [extension.molt_limits] : [],
          });
          return combinedExtensions;
        },
        [],
      );

      const skullData = await ctx.db
        .select()
        .from(skull)
        .where(eq(skull.speciesId, input.id));

      const bandSizeData = await ctx.db
        .select()
        .from(cemaveBandSize)
        .where(eq(cemaveBandSize.speciesId, input.id));

      //group extensionData by moltType, using it as moltType key
      const groupedExtensions = combinedExtensionData.reduce(
        (
          acc: {
            moltType: string;
            molLimits: {
              id: number;
              limit: string | null;
              notes: string | null;
            }[];
            extensions: { id: number; extension: string | null }[];
          }[],
          curr,
        ) => {
          const key = curr.moltType;
          if (!curr.extension ?? !key) return acc;
          if (!acc.find((d) => d.moltType === key)) {
            acc.push({
              moltType: key,
              extensions: [{ id: curr.id, extension: curr.extension }],
              molLimits: curr.moltLimits.map((d) => ({
                id: d.id,
                limit: d.limit,
                notes: d.notes,
              })),
            });
            return acc;
          }
          const index = acc.findIndex((d) => d.moltType === key);
          acc[index]?.extensions.push({
            id: curr.id,
            extension: curr.extension,
          });
          acc[index]?.molLimits.push(
            ...curr.moltLimits.map((d) => ({
              id: d.id,
              limit: d.limit,
              notes: d.notes,
            })),
          );
          return acc;
        },
        [] as {
          moltType: string;
          molLimits: {
            id: number;
            limit: string | null;
            notes: string | null;
          }[];
          extensions: { id: number; extension: string | null }[];
        }[],
      );

      const filteredData = strategiesData.filter((d) => d !== null); // Filter out null values

      const speciesData = filteredData[0]?.species;

      const moltStrategiesData = filteredData
        .map((d) => d.molt_strategy)
        .filter((d) => d !== null);

      return {
        ...speciesData,
        moltStrategies:
          moltStrategiesData as (typeof moltStrategies.$inferSelect)[],
        skull: skullData as (typeof skull.$inferSelect)[],
        ageInfo: groupedAgeInfo,
        bandSize: bandSizeData,
        moltExtensions: groupedExtensions,
      } as SpeciesByIdReturn;
    }),
});

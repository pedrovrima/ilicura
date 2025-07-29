import { z } from "zod";
import { eq, ilike, inArray, or, and, isNotNull } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  moltStrategies,
  species,
  speciesMoltExtensions,
  skull,
  cemaveBandSize,
  hummingBirdBandCircumference,
  hummingBirdBillCorrugation,
  moltLimits,
  speciesAgeInfo,
  speciesSexInfo,
  speciesPicture,
  speciesFeaturedPicture,
  speciesInitialDescription,
  agesEnum,
  sexEnum,
  families,
  genus,
} from "@/server/db/schema";

type AgeEnum = (typeof agesEnum.enumValues)[number];
type SexEnum = (typeof sexEnum.enumValues)[number];
type SpeciesData = typeof species.$inferSelect;
type CompleteMoltExtesion = typeof speciesMoltExtensions.$inferSelect & {
  moltLimits: (typeof moltLimits.$inferSelect)[] | [];
};
type CompleteSexInfo = {
  sex: typeof speciesSexInfo.$inferSelect & {
    pictures: (typeof speciesPicture.$inferSelect)[] | [];
  };

  ageInfo: typeof speciesAgeInfo.$inferSelect;
};

type CompleteAgeInfo = typeof speciesAgeInfo.$inferSelect & {
  sex: (typeof speciesSexInfo.$inferSelect & {
    pictures: (typeof speciesPicture.$inferSelect)[] | [];
  })[];
};

interface SpeciesByIdReturn extends SpeciesData {
  moltStrategies: (typeof moltStrategies.$inferSelect)[] | [];
  skull: (typeof skull.$inferSelect)[] | [];
  genus: string;
  family: string;
  moltExtensions: {
    moltType: string;
    extensions: { id: number; extension: string }[];
    molLimits: { id: number; limit: string; notes: string | null }[];
  }[];
  featuredPictures: {
    age: AgeEnum;
    sex: SexEnum;
    url: string;
    id: number;
  }[];
  bandSize: (typeof cemaveBandSize.$inferSelect)[];
  hummingbirdBandCircumference: (typeof hummingBirdBandCircumference.$inferSelect)[];
  hummingbirdBillCorrugation: (typeof hummingBirdBillCorrugation.$inferSelect)[];
  initialDescription: typeof speciesInitialDescription.$inferSelect | null;
  ageInfo: CompleteAgeInfo[];
}

export const speciesRouter = createTRPCRouter({
  getAllSpecies: publicProcedure.query(async ({ ctx }) => {
    // Fix: Execute the query to get actual species IDs
    const moltStrategiesData = await ctx.db
      .select({ speciesId: moltStrategies.speciesId })
      .from(moltStrategies);

    const speciesIds = moltStrategiesData.map((item) => item.speciesId);

    const speciesWithStrategies = await ctx.db
      .select()
      .from(species)
      .where(
        and(
          inArray(species.id, speciesIds),
          isNotNull(species.infoLastUpdatedAt),
        ),
      );

    const featuredPicture = await ctx.db
      .select({
        id: speciesFeaturedPicture.id,
        speciesId: speciesFeaturedPicture.speciesId,
        url: speciesPicture.url,
      })
      .from(speciesFeaturedPicture)
      .where(
        and(
          inArray(speciesFeaturedPicture.speciesId, speciesIds),
          eq(speciesFeaturedPicture.cover, true),
        ),
      )
      .leftJoin(
        speciesPicture,
        eq(speciesFeaturedPicture.pictureId, speciesPicture.id),
      );

    const speciesWithFeaturedPicture = speciesWithStrategies.map((species) => {
      const picture = featuredPicture.find(
        (picture) => picture.speciesId === species.id,
      );
      return {
        ...species,
        featuredPicture: picture,
      };
    });

    return speciesWithFeaturedPicture;
  }),

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
        .leftJoin(moltStrategies, eq(species.id, moltStrategies.speciesId))
        .leftJoin(genus, eq(genus.id, species.genusId))
        .leftJoin(families, eq(genus.familyId, families.id));

      const ageInfo = await ctx.db
        .select()
        .from(speciesAgeInfo)
        .where(eq(speciesAgeInfo.speciesId, input.id))
        .leftJoin(speciesSexInfo, eq(speciesAgeInfo.id, speciesSexInfo.ageId))
        .leftJoin(
          speciesPicture,
          eq(speciesSexInfo.id, speciesPicture.sexInfoId),
        );

      const groupedSexInfo = ageInfo.reduce(
        (acc: CompleteSexInfo[], curr): CompleteSexInfo[] => {
          const key = curr.specues_sex_info?.sex;
          const thisSex = acc.find(
            (d) =>
              d.sex?.sex === key && d.ageInfo.age === curr.species_age_info.age,
          );
          if (!key) return acc;
          if (!thisSex && curr.specues_sex_info) {
            return [
              ...acc,
              {
                sex: {
                  ...curr.specues_sex_info,
                  pictures: curr.species_picture ? [curr.species_picture] : [],
                },

                ageInfo: curr.species_age_info,
              },
            ];
          }
          const notThis = acc.filter(
            (d) =>
              d.sex?.sex !== key || d.ageInfo.age !== curr.species_age_info.age,
          );

          if (!thisSex?.sex.pictures)
            return [
              ...notThis,
              {
                ...thisSex,
                sex: { ...thisSex?.sex, pictures: [curr.species_picture] },
              } as CompleteSexInfo,
            ] as CompleteSexInfo[];

          return [
            ...notThis,
            {
              ...thisSex,
              sex: {
                ...thisSex.sex,
                pictures: [...thisSex.sex.pictures, curr.species_picture],
              },
            } as CompleteSexInfo,
          ] as CompleteSexInfo[];
        },
        [],
      );

      const featuredPictures = await ctx.db
        .select({
          id: speciesFeaturedPicture.id,
          age: speciesAgeInfo.age,
          sex: speciesSexInfo.sex,
          url: speciesPicture.url,
        })
        .from(speciesFeaturedPicture)
        .leftJoin(
          speciesPicture,
          eq(speciesFeaturedPicture.pictureId, speciesPicture.id),
        )
        .leftJoin(
          speciesSexInfo,
          eq(speciesPicture.sexInfoId, speciesSexInfo.id),
        )
        .leftJoin(speciesAgeInfo, eq(speciesSexInfo.ageId, speciesAgeInfo.id))
        .where(eq(speciesFeaturedPicture.speciesId, input.id));

      const groupedAgeInfo = groupedSexInfo.reduce(
        (acc: CompleteAgeInfo[], curr: CompleteSexInfo): CompleteAgeInfo[] => {
          const key = curr.ageInfo.age;
          const thisAge = acc.find((d) => d.age === key);
          if (!key) return acc;
          if (!thisAge) {
            return [
              ...acc,
              {
                ...curr.ageInfo,
                sex: curr.sex ? [curr.sex] : [],
              },
            ];
          }

          const noThis = acc.filter((d) => d.age !== key);

          if (!thisAge.sex) {
            return [
              ...noThis,
              {
                ...thisAge,
                sex: [curr.sex],
              },
            ];
          }

          return [
            ...noThis,
            {
              ...thisAge,
              sex: [...thisAge.sex, curr.sex],
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

      const hummingbirdBandCircumferenceData = await ctx.db
        .select()
        .from(hummingBirdBandCircumference)
        .where(eq(hummingBirdBandCircumference.speciesId, input.id));

      const hummingbirdBillCorrugationData = await ctx.db
        .select()
        .from(hummingBirdBillCorrugation)
        .where(eq(hummingBirdBillCorrugation.speciesId, input.id));

      const initialDescriptionData = await ctx.db
        .select()
        .from(speciesInitialDescription)
        .where(eq(speciesInitialDescription.speciesId, input.id))
        .limit(1);

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
        genus: filteredData[0]?.genus?.genusName,
        family: filteredData[0]?.families?.name,
        moltStrategies:
          moltStrategiesData as (typeof moltStrategies.$inferSelect)[],
        skull: skullData as (typeof skull.$inferSelect)[],
        ageInfo: groupedAgeInfo,
        bandSize: bandSizeData,
        hummingbirdBandCircumference: hummingbirdBandCircumferenceData,
        hummingbirdBillCorrugation: hummingbirdBillCorrugationData,
        initialDescription: initialDescriptionData[0] || null,
        moltExtensions: groupedExtensions,
        featuredPictures,
      } as SpeciesByIdReturn;
    }),
});

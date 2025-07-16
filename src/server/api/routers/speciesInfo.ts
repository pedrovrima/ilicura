import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  agesEnum,
  bandSizeEnum,
  cemaveBandSize,
  hummingBirdBandCircumference,
  hummingBirdBillCorrugation,
  moltExtensionEnum,
  moltLimits,
  moltLimitsEnum,
  moltStrategies,
  moltStrategiesEnum,
  moltTypesEnum,
  skull,
  skullClosesEnum,
  speciesMoltExtensions,
  speciesAgeInfo,
  speciesSexInfo,
  speciesPicture,
  speciesFeaturedPicture,
  speciesInitialDescription,
} from "@/server/db/schema";
import ImageKit from "imagekit";
import { env } from "@/env";

type CompleteMoltExtesion = typeof speciesMoltExtensions.$inferSelect & {
  moltLimits: (typeof moltLimits.$inferSelect)[] | [];
};

type Nullable<T> = { [K in keyof T]: T[K] | null };

export type CompleteAgeInfo = typeof speciesAgeInfo.$inferSelect & {
  sex: (typeof speciesSexInfo.$inferSelect)[] | [];
};

export type NullableCompleteAgeInfo = Nullable<CompleteAgeInfo>;

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

  addHummingbirdBandCircumference: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        bandCircumference: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(hummingBirdBandCircumference).values({
        speciesId: input.speciesId,
        bandCircumference: input.bandCircumference,
      });
    }),
  deleteHummingbirdBandCircumference: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(hummingBirdBandCircumference)
        .where(eq(hummingBirdBandCircumference.id, input.id));
    }),
  getHummingbirdBandCircumference: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(hummingBirdBandCircumference)
        .where(eq(hummingBirdBandCircumference.speciesId, input.speciesId));
      return data;
    }),

  addHummingbirdBillCorrugation: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        age: z.string(),
        billCorrugation: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(hummingBirdBillCorrugation).values({
        speciesId: input.speciesId,
        age: input.age,
        billCorrugation: input.billCorrugation,
      });
    }),
  deleteHummingbirdBillCorrugation: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(hummingBirdBillCorrugation)
        .where(eq(hummingBirdBillCorrugation.id, input.id));
    }),
  getHummingbirdBillCorrugation: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(hummingBirdBillCorrugation)
        .where(eq(hummingBirdBillCorrugation.speciesId, input.speciesId));
      return data;
    }),

  addSpeciesInitialDescription: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(speciesInitialDescription).values({
        speciesId: input.speciesId,
        description: input.description,
      });
    }),
  updateSpeciesInitialDescription: publicProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(speciesInitialDescription)
        .set({ description: input.description })
        .where(eq(speciesInitialDescription.id, input.id));
    }),
  deleteSpeciesInitialDescription: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(speciesInitialDescription)
        .where(eq(speciesInitialDescription.id, input.id));
    }),
  getSpeciesInitialDescription: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(speciesInitialDescription)
        .where(eq(speciesInitialDescription.speciesId, input.speciesId));
      return data[0] || null; // Return first description or null if none exists
    }),

  addMoltLimits: publicProcedure
    .input(
      z.object({
        speciesMoltExtensionId: z.number(),
        limit: z.enum(moltLimitsEnum.enumValues),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(moltLimits).values({
        speciesMoltExtensionId: input.speciesMoltExtensionId,
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
        .where(eq(moltLimits.speciesMoltExtensionId, input.speciesId));

      return data;
    }),

  addAgeInfo: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        sexualDimorphism: z.boolean(),
        age: z.enum(agesEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const ageInfo = await tx
          .insert(speciesAgeInfo)
          .values({
            speciesId: input.speciesId,
            sexualDimorphism: input.sexualDimorphism,
            age: input.age,
          })
          .returning();

        const insertedId = ageInfo[0]?.id;
        console.log(ageInfo);
        if (input.sexualDimorphism) {
          await tx.insert(speciesSexInfo).values({
            ageId: insertedId,
            sex: "M",
            description: "",
          });
          await tx.insert(speciesSexInfo).values({
            ageId: insertedId,
            sex: "F",
            description: "",
          });
          return;
        }
        await tx.insert(speciesSexInfo).values({
          ageId: insertedId,
          sex: "U",
          description: "",
        });
        return;
      });
    }),

  deleteSexualDimorphism: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx
          .delete(speciesSexInfo)
          .where(eq(speciesSexInfo.ageId, input.id));
        await tx.delete(speciesAgeInfo).where(eq(speciesAgeInfo.id, input.id));
      });
    }),
  updateSexInfo: publicProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(speciesSexInfo)
        .set({ description: input.description })
        .where(eq(speciesSexInfo.id, input.id));
    }),

  addSexImage: publicProcedure
    .input(
      z.object({
        sexId: z.number(),
        url: z.string(),
        thumbnailUrl: z.string(),
        fileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(speciesPicture).values({
        sexInfoId: input.sexId,
        url: input.url,
        thumbnail: input.thumbnailUrl,
        fileId: input.fileId,
      });
    }),

  getSexImages: publicProcedure
    .input(z.object({ sexId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(speciesPicture)
        .where(eq(speciesPicture.sexInfoId, input.sexId));
      return data;
    }),

  deleteSexImage: publicProcedure
    .input(z.object({ id: z.number(), fileId: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const imagek = new ImageKit({
        publicKey: env.IMAGEK_PUBLIC_KEY,
        privateKey: env.IMAGEK_PRIVATE_KEY,
        urlEndpoint: env.IMAGEK_URL_ENDPOINT,
      });
      if (!input.fileId) return;

      const del = await imagek
        .deleteFile(input.fileId)
        .then(async (res) => {
          console.log(res);

          await ctx.db
            .delete(speciesPicture)
            .where(eq(speciesPicture.id, input.id));
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(del);

      return;
    }),

  getSexualDimorphism: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(speciesAgeInfo)
        .leftJoin(speciesSexInfo, eq(speciesAgeInfo.id, speciesSexInfo.ageId))
        .where(eq(speciesAgeInfo.speciesId, input.speciesId));

      const sexedAge = data.reduce(
        (age: CompleteAgeInfo[], ageInfo): CompleteAgeInfo[] => {
          const thisAge = age.find(
            (d) => d.age === ageInfo.species_age_info.age,
          );
          if (!thisAge) {
            return [
              ...age,
              {
                ...ageInfo.species_age_info,
                sex: ageInfo.specues_sex_info ? [ageInfo.specues_sex_info] : [],
              },
            ];
          }
          if (ageInfo.specues_sex_info) {
            const otherAges = age.filter(
              (d) => d.age !== ageInfo.species_age_info.age,
            );

            const newAge = [
              ...otherAges,
              { ...thisAge, sex: [...thisAge.sex, ageInfo.specues_sex_info] },
            ];

            return newAge;
          }
          return age;
        },
        [],
      );

      return sexedAge;
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
      return ctx.db.transaction(async (tx) => {
        await tx
          .delete(moltLimits)
          .where(eq(moltLimits.speciesMoltExtensionId, input.id));
        await tx
          .delete(speciesMoltExtensions)
          .where(eq(speciesMoltExtensions.id, input.id));
      });
    }),

  getSpeciesRawMoltExtensions: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(speciesMoltExtensions)
        .leftJoin(
          moltLimits,
          eq(speciesMoltExtensions.id, moltLimits.speciesMoltExtensionId),
        )
        .where(eq(speciesMoltExtensions.speciesId, input.speciesId));

      const combinedExtensionData = data.reduce(
        (combinedExtensions: CompleteMoltExtesion[], extension) => {
          if (!extension) return combinedExtensions;
          const thisMoltType = combinedExtensions.find(
            (d) =>
              d.moltType === extension.species_molt_extensions.moltType &&
              d.extension === extension.species_molt_extensions.extension,
          );
          if (thisMoltType && extension.molt_limits) {
            return [
              ...combinedExtensions.filter(
                (d) =>
                  d.extension !== extension.species_molt_extensions.extension &&
                  d.moltType !== extension.species_molt_extensions.moltType,
              ),
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

      return combinedExtensionData;
    }),

  getFeaturedPictures: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const featuredPictures = await ctx.db
        .select({
          pictureId: speciesFeaturedPicture.pictureId,
          url: speciesPicture.url,
          thumbnail: speciesPicture.thumbnail,
          cover: speciesFeaturedPicture.cover,
        })
        .from(speciesFeaturedPicture)
        .leftJoin(
          speciesPicture,
          eq(speciesFeaturedPicture.pictureId, speciesPicture.id),
        )
        .where(eq(speciesFeaturedPicture.speciesId, input.speciesId));
      return featuredPictures;
    }),

  addFeaturedPicture: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        pictureId: z.number(),
        cover: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sppFeaturedPic = await ctx.db
        .select()
        .from(speciesFeaturedPicture)
        .where(
          and(
            eq(speciesFeaturedPicture.speciesId, input.speciesId),
            eq(speciesFeaturedPicture.cover, input.cover),
          ),
        );

      if (sppFeaturedPic[0]) {
        return await ctx.db
          .update(speciesFeaturedPicture)
          .set({
            pictureId: input.pictureId,
          })
          .where(eq(speciesFeaturedPicture.id, sppFeaturedPic[0].id));
      }
      return ctx.db.insert(speciesFeaturedPicture).values({
        speciesId: input.speciesId,
        pictureId: input.pictureId,
        cover: input.cover,
      });
    }),

  getPictures: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const pictures = await ctx.db
        .select({
          id: speciesPicture.id,
          speciesId: speciesAgeInfo.speciesId,
          url: speciesPicture.url,
        })
        .from(speciesPicture)
        .leftJoin(
          speciesSexInfo,
          eq(speciesPicture.sexInfoId, speciesSexInfo.id),
        )
        .leftJoin(speciesAgeInfo, eq(speciesAgeInfo.id, speciesSexInfo.ageId))
        .where(eq(speciesAgeInfo.speciesId, input.speciesId));

      return pictures;
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

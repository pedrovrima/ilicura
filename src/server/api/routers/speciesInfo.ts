import { Pool } from "pg";
import { z } from "zod";
import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  writeProcedure,
} from "@/server/api/trpc";
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
  totalCapturesBySpecies,
  species,
  familiesInfo,
  genus,
  speciesFeaturedPictureCover,
} from "@/server/db/schema";
import ImageKit from "imagekit";
import { env } from "@/env";
import { getUnpackedSettings } from "http2";

type CompleteMoltExtesion = typeof speciesMoltExtensions.$inferSelect & {
  moltLimits: (typeof moltLimits.$inferSelect)[] | [];
};

type Nullable<T> = { [K in keyof T]: T[K] | null };

export type CompleteAgeInfo = typeof speciesAgeInfo.$inferSelect & {
  sex: (typeof speciesSexInfo.$inferSelect)[] | [];
};

export type NullableCompleteAgeInfo = Nullable<CompleteAgeInfo>;

export const speciesInfoRouter = createTRPCRouter({
  getFamilyInfo: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const familyId = await ctx.db
        .select({
          familyId: genus.familyId,
          description: familiesInfo.description,
          n_primary_feathers: familiesInfo.n_primary_feathers,
          n_secondary_feathers: familiesInfo.n_secondary_feathers,
        })
        .from(genus)
        .leftJoin(species, eq(genus.id, species.genusId))
        .leftJoin(familiesInfo, eq(familiesInfo.familyId, genus.familyId))
        .where(eq(species.id, input.speciesId));
      return familyId;
    }),
  updateFamilyDescription: writeProcedure
    .input(z.object({ familyId: z.number(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db
        .insert(familiesInfo)
        .values({
          familyId: input.familyId,
          description: input.description,
        })
        .onConflictDoUpdate({
          target: familiesInfo.familyId,
          set: { description: input.description },
        });
      return data;
    }),

  updateFamilyPrimaryFeathers: writeProcedure
    .input(z.object({ familyId: z.number(), n_primary_feathers: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db
        .insert(familiesInfo)
        .values({
          familyId: input.familyId,
          n_primary_feathers: input.n_primary_feathers,
        })
        .onConflictDoUpdate({
          target: familiesInfo.familyId,
          set: { n_primary_feathers: input.n_primary_feathers },
        });
      console.log("updated", data);
      return data;
    }),
  updateFamilySecondaryFeathers: writeProcedure
    .input(z.object({ familyId: z.number(), n_secondary_feathers: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db
        .update(familiesInfo)
        .set({ n_secondary_feathers: input.n_secondary_feathers })
        .where(eq(familiesInfo.familyId, input.familyId));
      return data;
    }),
  getTotalCaptures: publicProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(totalCapturesBySpecies)
        .where(eq(totalCapturesBySpecies.speciesId, input.speciesId));
      console.log(data);
      return data[0] || null;
    }),
  updateTotalCaptures: writeProcedure
    .input(z.object({ speciesId: z.number(), total: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db
        .insert(totalCapturesBySpecies)
        .values({
          speciesId: input.speciesId,
          total: input.total,
        })
        .onConflictDoUpdate({
          target: totalCapturesBySpecies.speciesId,

          set: { total: input.total },
        })
        .returning();
      console.log("updated", data);
      await ctx.db
        .update(species)
        .set({ infoLastUpdatedAt: new Date() })
        .where(eq(species.id, input.speciesId));
      return { ok: true };
    }),
  addBandSize: publicProcedure
    .input(
      z.object({
        speciesId: z.number(),
        bandSize: z.enum(bandSizeEnum.enumValues),
        isSecondary: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("addBandSize input", input);
      try {
        const inserted = await ctx.db.transaction(async (tx) => {
          console.log(ctx.user);
          await tx.execute(
            sql`select set_config('app.author_id', ${ctx.user!.authorId.toString()}, true)`,
          );
          await tx.execute(
            sql`select set_config('app.data_source_id', ${"1"}, true)`,
          );

          return await tx
            .insert(cemaveBandSize)
            .values({
              speciesId: input.speciesId,
              bandSize: input.bandSize,
              isSecondary: input.isSecondary,
            })
            .returning();
        });

        return inserted;
      } catch (error) {
        console.error("addBandSize error", error);
        throw new Error(
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : "Unknown error",
        );
      }
    }),

  deleteBandSize: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(cemaveBandSize)
        .where(eq(cemaveBandSize.id, input.id))
        .returning({
          id: cemaveBandSize.id,
          speciesId: cemaveBandSize.speciesId,
        });

      if (!deleted)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Band size not found",
        });

      return { ok: true, deletedId: deleted.id };
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

  addHummingbirdBandCircumference: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        bandCircumference: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.transaction(async (tx) => {
          await tx.insert(hummingBirdBandCircumference).values({
            speciesId: input.speciesId,
            bandCircumference: input.bandCircumference,
          });
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, input.speciesId));
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  deleteHummingbirdBandCircumference: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const bandCircumferenceRecord = await tx
          .select({ speciesId: hummingBirdBandCircumference.speciesId })
          .from(hummingBirdBandCircumference)
          .where(eq(hummingBirdBandCircumference.id, input.id));

        await tx
          .delete(hummingBirdBandCircumference)
          .where(eq(hummingBirdBandCircumference.id, input.id));

        if (bandCircumferenceRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, bandCircumferenceRecord[0].speciesId));
        }
      });
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

  addHummingbirdBillCorrugation: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        age: z.string(),
        billCorrugation: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(hummingBirdBillCorrugation).values({
          speciesId: input.speciesId,
          age: input.age,
          billCorrugation: input.billCorrugation,
        });
        await tx
          .update(species)
          .set({ infoLastUpdatedAt: new Date() })
          .where(eq(species.id, input.speciesId));
      });
    }),
  deleteHummingbirdBillCorrugation: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const billCorrugationRecord = await tx
          .select({ speciesId: hummingBirdBillCorrugation.speciesId })
          .from(hummingBirdBillCorrugation)
          .where(eq(hummingBirdBillCorrugation.id, input.id));

        await tx
          .delete(hummingBirdBillCorrugation)
          .where(eq(hummingBirdBillCorrugation.id, input.id));

        if (billCorrugationRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, billCorrugationRecord[0].speciesId));
        }
      });
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

  addSpeciesInitialDescription: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(speciesInitialDescription).values({
          speciesId: input.speciesId,
          description: input.description,
        });
        await tx
          .update(species)
          .set({ infoLastUpdatedAt: new Date() })
          .where(eq(species.id, input.speciesId));
      });
    }),
  updateSpeciesInitialDescription: writeProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        await tx
          .update(speciesInitialDescription)
          .set({ description: input.description })
          .where(eq(speciesInitialDescription.id, input.id));

        await tx
          .update(species)
          .set({ infoLastUpdatedAt: new Date() })
          .where(eq(species.id, input.id));
      });
    }),
  deleteSpeciesInitialDescription: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const descriptionRecord = await tx
          .select({ speciesId: speciesInitialDescription.speciesId })
          .from(speciesInitialDescription)
          .where(eq(speciesInitialDescription.id, input.id));

        await tx
          .delete(speciesInitialDescription)
          .where(eq(speciesInitialDescription.id, input.id));

        if (descriptionRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, descriptionRecord[0].speciesId));
        }
      });
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

  addMoltLimits: writeProcedure
    .input(
      z.object({
        speciesMoltExtensionId: z.number(),
        limit: z.enum(moltLimitsEnum.enumValues),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const moltExtensionRecord = await tx
          .select({ speciesId: speciesMoltExtensions.speciesId })
          .from(speciesMoltExtensions)
          .where(eq(speciesMoltExtensions.id, input.speciesMoltExtensionId));

        await tx.insert(moltLimits).values({
          speciesMoltExtensionId: input.speciesMoltExtensionId,
          limit: input.limit,
          notes: input.notes,
        });

        if (moltExtensionRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, moltExtensionRecord[0].speciesId));
        }
      });
    }),

  deleteMoltLimits: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const moltLimitRecord = await tx
          .select({
            speciesMoltExtensionId: moltLimits.speciesMoltExtensionId,
          })
          .from(moltLimits)
          .where(eq(moltLimits.id, input.id));

        await tx.delete(moltLimits).where(eq(moltLimits.id, input.id));

        if (moltLimitRecord[0]?.speciesMoltExtensionId) {
          const moltExtensionRecord = await tx
            .select({ speciesId: speciesMoltExtensions.speciesId })
            .from(speciesMoltExtensions)
            .where(
              eq(
                speciesMoltExtensions.id,
                moltLimitRecord[0].speciesMoltExtensionId,
              ),
            );

          if (moltExtensionRecord[0]?.speciesId) {
            await tx
              .update(species)
              .set({ infoLastUpdatedAt: new Date() })
              .where(eq(species.id, moltExtensionRecord[0].speciesId));
          }
        }
      });
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

  addAgeInfo: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        sexualDimorphism: z.boolean(),
        age: z.enum(agesEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
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
          } else {
            await tx.insert(speciesSexInfo).values({
              ageId: insertedId,
              sex: "U",
              description: "",
            });
          }

          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, input.speciesId));
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  deleteSexualDimorphism: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const ageInfoRecord = await tx
          .select({ speciesId: speciesAgeInfo.speciesId })
          .from(speciesAgeInfo)
          .where(eq(speciesAgeInfo.id, input.id));

        await tx
          .delete(speciesSexInfo)
          .where(eq(speciesSexInfo.ageId, input.id));
        await tx.delete(speciesAgeInfo).where(eq(speciesAgeInfo.id, input.id));

        if (ageInfoRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, ageInfoRecord[0].speciesId));
        }
      });
    }),
  updateSexInfo: writeProcedure
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

  addSexImage: writeProcedure
    .input(
      z.object({
        sexId: z.number(),
        url: z.string(),
        thumbnailUrl: z.string(),
        fileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const sexInfoRecord = await tx
          .select({ ageId: speciesSexInfo.ageId })
          .from(speciesSexInfo)
          .where(eq(speciesSexInfo.id, input.sexId));

        if (sexInfoRecord[0]?.ageId) {
          const ageInfoRecord = await tx
            .select({ speciesId: speciesAgeInfo.speciesId })
            .from(speciesAgeInfo)
            .where(eq(speciesAgeInfo.id, sexInfoRecord[0].ageId));

          await tx.insert(speciesPicture).values({
            sexInfoId: input.sexId,
            url: input.url,
            thumbnail: input.thumbnailUrl,
            fileId: input.fileId,
          });

          if (ageInfoRecord[0]?.speciesId) {
            await tx
              .update(species)
              .set({ infoLastUpdatedAt: new Date() })
              .where(eq(species.id, ageInfoRecord[0].speciesId));
          }
        }
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

  deleteSexImage: writeProcedure
    .input(z.object({ id: z.number(), fileId: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const imagek = new ImageKit({
        publicKey: env.IMAGEK_PUBLIC_KEY,
        privateKey: env.IMAGEK_PRIVATE_KEY,
        urlEndpoint: env.IMAGEK_URL_ENDPOINT,
      });
      if (!input.fileId) return;

      await ctx.db.transaction(async (tx) => {
        const pictureRecord = await tx
          .select({ sexInfoId: speciesPicture.sexInfoId })
          .from(speciesPicture)
          .where(eq(speciesPicture.id, input.id));

        if (pictureRecord[0]?.sexInfoId) {
          const sexInfoRecord = await tx
            .select({ ageId: speciesSexInfo.ageId })
            .from(speciesSexInfo)
            .where(eq(speciesSexInfo.id, pictureRecord[0].sexInfoId));

          if (sexInfoRecord[0]?.ageId) {
            const ageInfoRecord = await tx
              .select({ speciesId: speciesAgeInfo.speciesId })
              .from(speciesAgeInfo)
              .where(eq(speciesAgeInfo.id, sexInfoRecord[0].ageId));

            const del = await imagek
              .deleteFile(input.fileId!)
              .then(async (res) => {
                console.log(res);
                await tx
                  .delete(speciesPicture)
                  .where(eq(speciesPicture.id, input.id));
              })
              .catch(async (err) => {
                console.log(err);
                if (
                  err.message.includes("file does not exist.") ||
                  err.message.includes("invalid fileId parameter.")
                ) {
                  await tx
                    .delete(speciesPicture)
                    .where(eq(speciesPicture.id, input.id));
                }
              });
            console.log(del);

            if (ageInfoRecord[0]?.speciesId) {
              await tx
                .update(species)
                .set({ infoLastUpdatedAt: new Date() })
                .where(eq(species.id, ageInfoRecord[0].speciesId));
            }
          }
        }
      });
    }),

  getSexualDimorphism: writeProcedure
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

  addSpeciesSkullInfo: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        closes: z.enum(skullClosesEnum.enumValues),
        notes: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(skull).values({
          speciesId: input.speciesId,
          closes: input.closes,
          notes: input.notes,
        });
        await tx
          .update(species)
          .set({ infoLastUpdatedAt: new Date() })
          .where(eq(species.id, input.speciesId));
      });
    }),
  deleteSpeciesSkullInfo: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const skullRecord = await tx
          .select({ speciesId: skull.speciesId })
          .from(skull)
          .where(eq(skull.id, input.id));

        await tx.delete(skull).where(eq(skull.id, input.id));

        if (skullRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, skullRecord[0].speciesId));
        }
      });
    }),

  addSpeciesStrategy: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        strategy: z.enum(moltStrategiesEnum.enumValues),
        isCertain: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("input", input);
      try {
        await ctx.db.transaction(async (tx) => {
          await tx.insert(moltStrategies).values({
            speciesId: input.speciesId,
            strategy: input.strategy,
            isCertain: input.isCertain,
          });

          console.log("inserted");
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, input.speciesId));
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  deleteSpeciesStrategy: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const strategyRecord = await tx
          .select({ speciesId: moltStrategies.speciesId })
          .from(moltStrategies)
          .where(eq(moltStrategies.id, input.id));

        await tx.delete(moltStrategies).where(eq(moltStrategies.id, input.id));

        if (strategyRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, strategyRecord[0].speciesId));
        }
      });
    }),
  getSpeciesStrategies: writeProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(moltStrategies)
        .where(eq(moltStrategies.speciesId, input.speciesId));
      return data;
    }),
  addSpeciesMoltExtension: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        moltType: z.enum(moltTypesEnum.enumValues),
        extension: z.enum(moltExtensionEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.transaction(async (tx) => {
          await tx.insert(speciesMoltExtensions).values({
            speciesId: input.speciesId,
            moltType: input.moltType,
            extension: input.extension,
          });

          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, input.speciesId));
        });
        console.log("updated");
      } catch (error) {
        console.log("error", error);
      }
    }),
  deleteSpeciesMoltExtension: writeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const moltExtensionRecord = await tx
          .select({ speciesId: speciesMoltExtensions.speciesId })
          .from(speciesMoltExtensions)
          .where(eq(speciesMoltExtensions.id, input.id));

        await tx
          .delete(moltLimits)
          .where(eq(moltLimits.speciesMoltExtensionId, input.id));
        await tx
          .delete(speciesMoltExtensions)
          .where(eq(speciesMoltExtensions.id, input.id));

        if (moltExtensionRecord[0]?.speciesId) {
          await tx
            .update(species)
            .set({ infoLastUpdatedAt: new Date() })
            .where(eq(species.id, moltExtensionRecord[0].speciesId));
        }
      });
    }),

  getSpeciesRawMoltExtensions: writeProcedure
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

  getFeaturedPictures: writeProcedure
    .input(z.object({ speciesId: z.number() }))
    .query(async ({ ctx, input }) => {
      const featuredPictures = await ctx.db
        .select({
          id: speciesFeaturedPicture.id,
          pictureId: speciesFeaturedPicture.pictureId,
          url: speciesPicture.url,
          thumbnail: speciesPicture.thumbnail,
          cover: speciesFeaturedPictureCover.cover,
        })
        .from(speciesFeaturedPicture)
        .leftJoin(
          speciesPicture,
          eq(speciesFeaturedPicture.pictureId, speciesPicture.id),
        )
        .leftJoin(
          speciesFeaturedPictureCover,
          eq(
            speciesFeaturedPicture.pictureId,
            speciesFeaturedPictureCover.pictureId,
          ),
        )
        .where(eq(speciesFeaturedPicture.speciesId, input.speciesId));
      return featuredPictures;
    }),

  addFeaturedPicture: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        pictureId: z.number(),
        cover: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(speciesFeaturedPicture)
        .values({
          speciesId: input.speciesId,
          pictureId: input.pictureId,
          cover: input.cover,
        })
        .where(eq(speciesFeaturedPicture.speciesId, input.speciesId))
        .where(eq(speciesFeaturedPicture.pictureId, input.pictureId));

      await ctx.db
        .update(species)
        .set({ infoLastUpdatedAt: new Date() })
        .where(eq(species.id, input.speciesId));
    }),
  addFeaturedPictureCover: writeProcedure
    .input(
      z.object({
        speciesId: z.number(),
        pictureId: z.number(),
        cover: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(speciesFeaturedPictureCover)
        .values({
          speciesId: input.speciesId,
          pictureId: input.pictureId,
          cover: input.cover,
        })
        .onConflictDoUpdate({
          target: [speciesFeaturedPictureCover.speciesId],
          set: {
            pictureId: input.pictureId,
          },
        });
    }),

  deleteFeaturedPicture: writeProcedure
    .input(z.object({ id: z.number(), speciesId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log("deleteFeaturedPicture input", input);
      await ctx.db
        .delete(speciesFeaturedPicture)
        .where(eq(speciesFeaturedPicture.id, input.id));

      await ctx.db
        .update(species)
        .set({ infoLastUpdatedAt: new Date() })
        .where(eq(species.id, input.speciesId));
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

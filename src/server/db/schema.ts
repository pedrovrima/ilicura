// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  pgEnum,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { string } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ilicura_${name}`);

export const moltStrategiesEnum = pgEnum("molt_strategies_enum", [
  "SBS",
  "SAS",
  "CBS",
  "CAS",
]);

export const sexEnum = pgEnum("sex_enum", ["M", "F", "U"]);

export const moltLimitsEnum = pgEnum("molt_limits_enum", [
  "alula",
  "body",
  "primaries",
  "secondaries",
  "tertials",
  "greater coverts",
  "lesser-median coverts",
  "vs greater-coverts and primaries",
  "primary coverts",
  "underwing coverts",
]);

export const moltExtensionEnum = pgEnum("molt_extension_enum", [
  "complete",
  "incomplete",
  "incomplete-excentric",
  "partial",
  "limited",
  "absent",
]);

export const moltTypesEnum = pgEnum("molt_types_enum", [
  "1PJ",
  "1PF",
  "1PA",
  "DPB",
  "DPA",
  "2PB",
  "2PA",
  "3PB",
  "3PA",
  "4PB",
  "4PA",
]);

export const bandSizeEnum = pgEnum("band_size_enum", [
  "A",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "L",
  "M",
  "N",
  "P",
  "R",
  "S",
  "T",
]);

export const agesEnum = pgEnum("ages_enum", [
  "FPJ",
  "FCJ",
  "FPF",
  "FCF",
  "FPA",
  "FCA",
  "M-FPF",
  "M-FCF",
  "M-FPA",
  "M-FCA",
  "DPB",
  "DCB",
  "DPA",
  "DCA",
  "SPB",
  "SCB",
  "M-SPB",
  "M-SCB",
  "SPA",
  "SCA",
  "M-SPA",
  "M-SCA",
  "TPB",
  "TCB",
  "M-TPB",
  "M-TCB",
  "TPA",
  "TCA",
  "M-TPA",
  "M-TCA",
  "4PB",
  "4CB",
  "M-4PB",
  "M-4CB",
  "4PA",
  "4CA",
  "M-4PA",
  "M-4CA",
  "5PB",
  "5CB",
  "M-5PB",
  "M-5CB",
  "5PA",
  "5CA",
  "M-5PA",
  "M-5CA",
  "6PB",
  "6CB",
  "M-6PB",
  "M-6CB",
  "6PA",
  "6CA",
  "M-6PA",
  "M-6CA",
]);

export const skullClosesEnum = pgEnum("skull_closes_enum", [
  "true",
  "maybe",
  "false",
]);

export const tagEnum = pgEnum("tag_enum", ["cover", "molt-limit"]);

export const families = createTable(
  "families",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const familiesInfo = createTable("families_info", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id").references(() => families.id),
  description: varchar("description", { length: 512 }),
  n_primary_feathers: integer("n_primary_feathers"),
  n_secondary_feathers: integer("n_secondary_feathers"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const genus = createTable("genus", {
  id: serial("id").primaryKey(),
  genusName: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  familyId: integer("family_id").references(() => families.id),
});

export const species = createTable("species", {
  id: serial("id").primaryKey(),
  scientificName: varchar("scientific_name", { length: 256 }),
  ptName: varchar("pt_name", { length: 256 }),
  enName: varchar("en_name", { length: 256 }),
  sciCode: varchar("sci_code", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  genusId: integer("genus_id").references(() => genus.id),
});

export const speciesInfo = createTable("species_info", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  description: varchar("description", { length: 512 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const speciesPicture = createTable("species_picture", {
  id: serial("id").primaryKey(),
  sexInfoId: integer("sexInfoId").references(() => speciesSexInfo.id),
  fileId: varchar("file_id", { length: 256 }),
  url: varchar("url", { length: 256 }),
  thumbnail: varchar("thumbnail", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const picturesTags = createTable("pictures_tags", {
  id: serial("id").primaryKey(),
  pictureId: integer("picture_id").references(() => speciesPicture.id),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const totalCapturesBySpecies = createTable("total_captures_by_species", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  total: integer("total"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const moltLimits = createTable("molt_limits", {
  id: serial("id").primaryKey(),
  speciesMoltExtensionId: integer("molt_id").references(
    () => speciesMoltExtensions.id,
  ),
  limit: moltLimitsEnum("limit"),
  notes: varchar("notes", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const cemaveBandSize = createTable("cemave_band_size", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  bandSize: bandSizeEnum("band_size"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const moltStrategies = createTable("molt_strategy", {
  id: serial("id").primaryKey(),
  strategy: moltStrategiesEnum("strategy"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  speciesId: integer("species_id").references(() => species.id),
});

export const speciesMoltExtensions = createTable(
  "species_molt_extensions",
  {
    id: serial("id").primaryKey(),
    speciesId: integer("species_id").references(() => species.id),
    moltType: moltTypesEnum("molt_type"),
    extension: moltExtensionEnum("extension"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    uniqueTest: unique("extension").on(
      table.speciesId,
      table.moltType,
      table.extension,
    ),
  }),
);

export const speciesAgeInfo = createTable("species_age_info", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  age: agesEnum("age"),
  sexualDimorphism: boolean("sexual_dimorphism"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const speciesSexInfo = createTable("specues_sex_info", {
  id: serial("id").primaryKey(),
  ageId: integer("age_id").references(() => speciesAgeInfo.id),
  description: varchar("description", { length: 512 }),
  sex: sexEnum("sex"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const skull = createTable("skull", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  closes: skullClosesEnum("closes"),
  notes: varchar("notes", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

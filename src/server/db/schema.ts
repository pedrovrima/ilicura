// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

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

export const agesEnum = pgEnum("molt_types_enum", [
  "FCJ",
  "FCF",
  "FCA",
  "M-FCF",
  "M-FCA",
  "DCB",
  "DCA",
  "SCB",
  "M-SCB",
  "SCA",
  "M-SCA",
  "TCB",
  "M-TCB",
  "TCA",
  "M-TCA",
  "4CB",
  "M-4CB",
  "4CA",
  "M-4CA",
  "5CB",
  "M-5CB",
  "5CA",
  "M-5CA",
  "6CB",
  "M-6CB",
  "6CA",
  "M-6CA",
]);

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

  scientificName: varchar("scientificName", { length: 256 }),
  ptName: varchar("ptName", { length: 256 }),
  enName: varchar("enName", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  genusId: integer("genus_id").references(() => genus.id),
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

export const speciesMolt = createTable("species_molt", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  moltType: moltTypesEnum("molt_type"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const speciesMoltExtensions = createTable("species_molt_extensions", {
  id: serial("id").primaryKey(),
  speciesMoltId: integer("species_molt_id").references(() => speciesMolt.id),
  extension: moltExtensionEnum("extension"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const sexualDimorphism = createTable("sexual_dimorphism", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  age: agesEnum("age"),
  sexualDimorphism: boolean("sexual_dimorphism"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const skull = createTable("skull", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  closes: boolean("skull"),
  notes: varchar("notes", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

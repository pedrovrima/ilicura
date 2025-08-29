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
  uuid,
  jsonb,
  bigserial,
  bigint,
  text,
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
  infoLastUpdatedAt: timestamp("info_last_updated_at"),
  rowUid: uuid("row_uid").defaultRandom().notNull(),
});

export const speciesInfo = createTable("species_info", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  description: varchar("description", { length: 512 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  rowUid: uuid("row_uid").defaultRandom().notNull(),
});

export const speciesInitialDescription = createTable(
  "species_initial_description",
  {
    id: serial("id").primaryKey(),
    speciesId: integer("species_id").references(() => species.id),
    description: varchar("description", { length: 1000 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    rowUid: uuid("row_uid").defaultRandom().notNull(),
  },
);

export const speciesFeaturedPicture = createTable("species_featured_picture", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  pictureId: integer("picture_id").references(() => speciesPicture.id),
  cover: boolean("cover"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  rowUid: uuid("row_uid").defaultRandom().notNull(),
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
  rowUid: uuid("row_uid").defaultRandom().notNull(),
});

export const picturesTags = createTable("pictures_tags", {
  id: serial("id").primaryKey(),
  pictureId: integer("picture_id").references(() => speciesPicture.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  rowUid: uuid("row_uid").defaultRandom().notNull(),
});

export const totalCapturesBySpecies = createTable("total_captures_by_species", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  total: integer("total"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  rowUid: uuid("row_uid").defaultRandom().notNull(),
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
  rowUid: uuid("row_uid").defaultRandom().notNull(),
});

export const cemaveBandSize = createTable("cemave_band_size", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").references(() => species.id),
  bandSize: bandSizeEnum("band_size"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  rowUid: uuid("row_uid").defaultRandom().notNull(),
});

export const hummingBirdBandCircumference = createTable(
  "humming_bird_band_circumference",
  {
    id: serial("id").primaryKey(),
    speciesId: integer("species_id").references(() => species.id),
    bandCircumference: integer("band_circumference"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    rowUid: uuid("row_uid").defaultRandom().notNull(),
  },
);

export const hummingBirdBillCorrugation = createTable(
  "humming_bird_bill_corrugation",
  {
    id: serial("id").primaryKey(),
    speciesId: integer("species_id").references(() => species.id),
    age: varchar("age", { length: 10 }), // ← keep this
    billCorrugation: varchar("bill_corrugation", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    rowUid: uuid("row_uid").defaultRandom().notNull(),
  },
);

export const moltStrategies = createTable("molt_strategy", {
  id: serial("id").primaryKey(),
  strategy: moltStrategiesEnum("strategy"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  speciesId: integer("species_id").references(() => species.id),
  rowUid: uuid("row_uid").defaultRandom().notNull(),
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
    rowUid: uuid("row_uid").defaultRandom().notNull(),
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
  rowUid: uuid("row_uid").defaultRandom().notNull(),
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
  rowUid: uuid("row_uid").defaultRandom().notNull(),
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
  rowUid: uuid("row_uid").defaultRandom().notNull(),
});

export const authors = createTable(
  "authors",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }),
    userId: varchar("user_id", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    userIdUq: unique("authors_user_id_uq").on(t.userId),
  }),
);

export const organizations = createTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const authorsDataSources = createTable("authors_data_sources", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").references(() => authors.id),

  dataSourceId: integer("data_source_id").references(() => dataSource.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const dataSource = createTable("data_source", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  organizationId: integer("organization_id").references(() => organizations.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const auditLog = createTable(
  "audit_log",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    txid: bigint("txid", { mode: "number" })
      .notNull()
      .default(sql`txid_current()`),

    tableSchema: text("table_schema").notNull(),
    tableName: text("table_name").notNull(),

    // Row pointer
    rowUid: uuid("row_uid").notNull(),
    pk: jsonb("pk").notNull(), // e.g. {"id": 123}

    op: varchar("op", { length: 10 }).notNull(), // 'insert' | 'update' | 'delete'
    oldData: jsonb("old_data"),
    newData: jsonb("new_data"),
    changedCols: text("changed_cols").array(),

    // Provenance
    authorId: integer("author_id")
      .references(() => authors.id)
      .notNull(),
    dataSourceId: integer("data_source_id").references(() => dataSource.id),

    // Approval-ready
    approvalStatus: varchar("approval_status", { length: 16 })
      .notNull()
      .default("applied"),
    approvedBy: integer("approved_by").references(() => authors.id),
    approvedAt: timestamp("approved_at", { withTimezone: true }),

    parentEventId: bigint("parent_event_id", { mode: "number" }),
    comment: text("comment"),

    // 🔑 Subject (root of the change for history grouping)
    subjectTable: text("subject_table").notNull(), // e.g. 'ilicura_species'
    subjectRowUid: uuid("subject_row_uid").notNull(), // species.row_uid
  },
  (t) => ({
    byTableRow: index("audit_by_table_row").on(t.tableName, t.rowUid),
    bySubject: index("audit_by_subject").on(t.subjectTable, t.subjectRowUid),
    byTx: index("audit_by_tx").on(t.txid),
    byAuthor: index("audit_by_author").on(t.authorId),
  }),
);

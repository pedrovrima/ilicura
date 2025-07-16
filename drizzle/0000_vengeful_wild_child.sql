DO $$ BEGIN
 CREATE TYPE "ages_enum" AS ENUM('FPJ', 'FCJ', 'FPF', 'FCF', 'FPA', 'FCA', 'M-FPF', 'M-FCF', 'M-FPA', 'M-FCA', 'DPB', 'DCB', 'DPA', 'DCA', 'SPB', 'SCB', 'M-SPB', 'M-SCB', 'SPA', 'SCA', 'M-SPA', 'M-SCA', 'TPB', 'TCB', 'M-TPB', 'M-TCB', 'TPA', 'TCA', 'M-TPA', 'M-TCA', '4PB', '4CB', 'M-4PB', 'M-4CB', '4PA', '4CA', 'M-4PA', 'M-4CA', '5PB', '5CB', 'M-5PB', 'M-5CB', '5PA', '5CA', 'M-5PA', 'M-5CA', '6PB', '6CB', 'M-6PB', 'M-6CB', '6PA', '6CA', 'M-6PA', 'M-6CA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "band_size_enum" AS ENUM('A', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'R', 'S', 'T');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "molt_extension_enum" AS ENUM('complete', 'incomplete', 'incomplete-excentric', 'partial', 'limited', 'absent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "molt_limits_enum" AS ENUM('alula', 'body', 'primaries', 'secondaries', 'tertials', 'greater coverts', 'lesser-median coverts', 'vs greater-coverts and primaries', 'primary coverts', 'underwing coverts');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "molt_strategies_enum" AS ENUM('SBS', 'SAS', 'CBS', 'CAS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "molt_types_enum" AS ENUM('1PJ', '1PF', '1PA', 'DPB', 'DPA', '2PB', '2PA', '3PB', '3PA', '4PB', '4PA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "sex_enum" AS ENUM('M', 'F', 'U');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "skull_closes_enum" AS ENUM('true', 'maybe', 'false');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "tag_enum" AS ENUM('cover', 'molt-limit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_cemave_band_size" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"band_size" "band_size_enum",
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_families" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_families_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" integer,
	"description" varchar(512),
	"n_primary_feathers" integer,
	"n_secondary_feathers" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_genus" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"family_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_humming_bird_band_circumference" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"band_circumference" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_molt_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"molt_id" integer,
	"limit" "molt_limits_enum",
	"notes" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_molt_strategy" (
	"id" serial PRIMARY KEY NOT NULL,
	"strategy" "molt_strategies_enum",
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"species_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_pictures_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"picture_id" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_skull" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"closes" "skull_closes_enum",
	"notes" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"scientific_name" varchar(256),
	"pt_name" varchar(256),
	"en_name" varchar(256),
	"sci_code" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"genus_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_species_age_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"age" "ages_enum",
	"sexual_dimorphism" boolean,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_species_featured_picture" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"picture_id" integer,
	"cover" boolean,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_species_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"description" varchar(512),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_species_molt_extensions" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"molt_type" "molt_types_enum",
	"extension" "molt_extension_enum",
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "extension" UNIQUE("species_id","molt_type","extension")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_species_picture" (
	"id" serial PRIMARY KEY NOT NULL,
	"sexInfoId" integer,
	"file_id" varchar(256),
	"url" varchar(256),
	"thumbnail" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_specues_sex_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"age_id" integer,
	"description" varchar(512),
	"sex" "sex_enum",
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_total_captures_by_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"total" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "ilicura_families" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_cemave_band_size" ADD CONSTRAINT "ilicura_cemave_band_size_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_families_info" ADD CONSTRAINT "ilicura_families_info_family_id_ilicura_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "ilicura_families"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_genus" ADD CONSTRAINT "ilicura_genus_family_id_ilicura_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "ilicura_families"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_humming_bird_band_circumference" ADD CONSTRAINT "ilicura_humming_bird_band_circumference_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_molt_limits" ADD CONSTRAINT "ilicura_molt_limits_molt_id_ilicura_species_molt_extensions_id_fk" FOREIGN KEY ("molt_id") REFERENCES "ilicura_species_molt_extensions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_molt_strategy" ADD CONSTRAINT "ilicura_molt_strategy_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_pictures_tags" ADD CONSTRAINT "ilicura_pictures_tags_picture_id_ilicura_species_picture_id_fk" FOREIGN KEY ("picture_id") REFERENCES "ilicura_species_picture"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_skull" ADD CONSTRAINT "ilicura_skull_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species" ADD CONSTRAINT "ilicura_species_genus_id_ilicura_genus_id_fk" FOREIGN KEY ("genus_id") REFERENCES "ilicura_genus"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_age_info" ADD CONSTRAINT "ilicura_species_age_info_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_featured_picture" ADD CONSTRAINT "ilicura_species_featured_picture_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_featured_picture" ADD CONSTRAINT "ilicura_species_featured_picture_picture_id_ilicura_species_picture_id_fk" FOREIGN KEY ("picture_id") REFERENCES "ilicura_species_picture"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_info" ADD CONSTRAINT "ilicura_species_info_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_molt_extensions" ADD CONSTRAINT "ilicura_species_molt_extensions_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_picture" ADD CONSTRAINT "ilicura_species_picture_sexInfoId_ilicura_specues_sex_info_id_fk" FOREIGN KEY ("sexInfoId") REFERENCES "ilicura_specues_sex_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_specues_sex_info" ADD CONSTRAINT "ilicura_specues_sex_info_age_id_ilicura_species_age_info_id_fk" FOREIGN KEY ("age_id") REFERENCES "ilicura_species_age_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_total_captures_by_species" ADD CONSTRAINT "ilicura_total_captures_by_species_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

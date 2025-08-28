CREATE TABLE IF NOT EXISTS "ilicura_audit_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"txid" bigint DEFAULT txid_current() NOT NULL,
	"table_schema" text NOT NULL,
	"table_name" text NOT NULL,
	"row_uid" uuid NOT NULL,
	"pk" jsonb NOT NULL,
	"op" varchar(10) NOT NULL,
	"old_data" jsonb,
	"new_data" jsonb,
	"changed_cols" text[],
	"author_id" integer NOT NULL,
	"data_source_id" integer,
	"approval_status" varchar(16) DEFAULT 'applied' NOT NULL,
	"approved_by" integer,
	"approved_at" timestamp with time zone,
	"parent_event_id" bigint,
	"comment" text,
	"subject_table" text NOT NULL,
	"subject_row_uid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"email" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_authors_data_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer,
	"data_source_id" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_data_source" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"organization_id" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ilicura_organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ilicura_cemave_band_size" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_humming_bird_band_circumference" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_humming_bird_bill_corrugation" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_molt_limits" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_molt_strategy" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_pictures_tags" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_skull" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_species" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_species_age_info" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_species_featured_picture" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_species_info" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_species_initial_description" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_species_molt_extensions" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_species_picture" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_specues_sex_info" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ilicura_total_captures_by_species" ADD COLUMN "row_uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_by_table_row" ON "ilicura_audit_log" ("table_name","row_uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_by_subject" ON "ilicura_audit_log" ("subject_table","subject_row_uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_by_tx" ON "ilicura_audit_log" ("txid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_by_author" ON "ilicura_audit_log" ("author_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_audit_log" ADD CONSTRAINT "ilicura_audit_log_author_id_ilicura_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "ilicura_authors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_audit_log" ADD CONSTRAINT "ilicura_audit_log_data_source_id_ilicura_data_source_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "ilicura_data_source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_audit_log" ADD CONSTRAINT "ilicura_audit_log_approved_by_ilicura_authors_id_fk" FOREIGN KEY ("approved_by") REFERENCES "ilicura_authors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_authors_data_sources" ADD CONSTRAINT "ilicura_authors_data_sources_author_id_ilicura_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "ilicura_authors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_authors_data_sources" ADD CONSTRAINT "ilicura_authors_data_sources_data_source_id_ilicura_data_source_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "ilicura_data_source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_data_source" ADD CONSTRAINT "ilicura_data_source_organization_id_ilicura_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "ilicura_organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

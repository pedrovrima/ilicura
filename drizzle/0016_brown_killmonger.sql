CREATE TABLE IF NOT EXISTS "ilicura_species_featured_picture_cover" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"cover" boolean,
	"picture_id" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"row_uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "ilicura_species_featured_picture_cover_species_id_unique" UNIQUE("species_id"),
	CONSTRAINT "species_featured_picture_cover_species_id_picture_id_uq" UNIQUE("species_id","picture_id")
);
--> statement-breakpoint
ALTER TABLE "ilicura_species_featured_picture" DROP COLUMN IF EXISTS "cover";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_featured_picture_cover" ADD CONSTRAINT "ilicura_species_featured_picture_cover_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_featured_picture_cover" ADD CONSTRAINT "ilicura_species_featured_picture_cover_picture_id_ilicura_species_picture_id_fk" FOREIGN KEY ("picture_id") REFERENCES "ilicura_species_picture"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

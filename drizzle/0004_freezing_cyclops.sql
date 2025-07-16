CREATE TABLE IF NOT EXISTS "ilicura_species_initial_description" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"description" varchar(1000),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_species_initial_description" ADD CONSTRAINT "ilicura_species_initial_description_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

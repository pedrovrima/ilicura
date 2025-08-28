CREATE TABLE IF NOT EXISTS "ilicura_humming_bird_bill_corrugation" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"age_id" integer,
	"bill_corrugation" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ilicura_humming_bird_bill_corrugation" ADD CONSTRAINT "ilicura_humming_bird_bill_corrugation_species_id_ilicura_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "ilicura_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

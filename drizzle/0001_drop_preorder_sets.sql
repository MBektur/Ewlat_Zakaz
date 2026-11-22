DROP TABLE "preorder_sets" CASCADE;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "unit_price_try" integer NOT NULL;
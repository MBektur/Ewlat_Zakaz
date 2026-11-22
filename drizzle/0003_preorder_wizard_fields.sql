ALTER TABLE "preorders" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "country" text DEFAULT 'TR' NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "region" text;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "neighborhood" text;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "delivery_method" text DEFAULT 'cargo' NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "is_gift" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "recipient_name" text;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "recipient_phone" text;
CREATE TABLE "settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"campaign_price_try" integer DEFAULT 8500 NOT NULL,
	"campaign_ends_at" timestamp with time zone,
	"regular_price_try" integer,
	"preorders_open" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "settings" ("id") VALUES (1) ON CONFLICT DO NOTHING;

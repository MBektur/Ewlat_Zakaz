CREATE TYPE "public"."preorder_status" AS ENUM('new', 'contacted', 'confirmed', 'shipped', 'cancelled');--> statement-breakpoint
CREATE TABLE "book_sets" (
	"book_id" integer NOT NULL,
	"set_id" integer NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "book_sets_book_id_set_id_pk" PRIMARY KEY("book_id","set_id")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"title_tr" text,
	"title_ug" text,
	"topic_tr" text,
	"topic_ug" text,
	"cover_url" text,
	"cover_width" integer DEFAULT 148 NOT NULL,
	"cover_height" integer DEFAULT 210 NOT NULL,
	"thickness_mm" real DEFAULT 6 NOT NULL,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"featured_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"missing_info" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"byte_size" integer NOT NULL,
	"data" "bytea" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preorder_sets" (
	"preorder_id" integer NOT NULL,
	"set_id" integer NOT NULL,
	CONSTRAINT "preorder_sets_preorder_id_set_id_pk" PRIMARY KEY("preorder_id","set_id")
);
--> statement-breakpoint
CREATE TABLE "preorders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "preorders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"note" text,
	"locale" text NOT NULL,
	"status" "preorder_status" DEFAULT 'new' NOT NULL,
	"admin_note" text,
	"consent_at" timestamp with time zone NOT NULL,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"name_tr" text NOT NULL,
	"name_ug" text,
	"description_tr" text,
	"description_ug" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "book_sets" ADD CONSTRAINT "book_sets_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_sets" ADD CONSTRAINT "book_sets_set_id_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preorder_sets" ADD CONSTRAINT "preorder_sets_preorder_id_preorders_id_fk" FOREIGN KEY ("preorder_id") REFERENCES "public"."preorders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preorder_sets" ADD CONSTRAINT "preorder_sets_set_id_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "book_sets_set_idx" ON "book_sets" USING btree ("set_id");--> statement-breakpoint
CREATE INDEX "books_featured_idx" ON "books" USING btree ("is_featured","featured_order");--> statement-breakpoint
CREATE INDEX "preorders_created_idx" ON "preorders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "preorders_ip_idx" ON "preorders" USING btree ("ip_hash","created_at");
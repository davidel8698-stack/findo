CREATE TYPE "public"."review_status" AS ENUM('detected', 'auto_replied', 'pending_approval', 'reminded', 'approved', 'edited', 'replied', 'expired');--> statement-breakpoint
CREATE TABLE "processed_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"google_connection_id" uuid NOT NULL,
	"review_id" varchar(255) NOT NULL,
	"review_name" varchar(512) NOT NULL,
	"reviewer_name" varchar(255) NOT NULL,
	"star_rating" integer NOT NULL,
	"comment" text,
	"review_create_time" timestamp with time zone NOT NULL,
	"review_update_time" timestamp with time zone NOT NULL,
	"status" "review_status" DEFAULT 'detected' NOT NULL,
	"is_positive" integer NOT NULL,
	"draft_reply" text,
	"draft_tone" varchar(20),
	"posted_reply" text,
	"replied_at" timestamp with time zone,
	"approval_message_id" varchar(255),
	"approval_sent_at" timestamp with time zone,
	"reminder_sent_at" timestamp with time zone,
	"owner_response" text,
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "processed_reviews_tenant_review_unique" UNIQUE("tenant_id","review_id")
);
--> statement-breakpoint
CREATE TABLE "review_poll_state" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"last_poll_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_review_update_time" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "processed_reviews" ADD CONSTRAINT "processed_reviews_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processed_reviews" ADD CONSTRAINT "processed_reviews_google_connection_id_google_connections_id_fk" FOREIGN KEY ("google_connection_id") REFERENCES "public"."google_connections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_poll_state" ADD CONSTRAINT "review_poll_state_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "processed_reviews_status_idx" ON "processed_reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "processed_reviews_approval_sent_idx" ON "processed_reviews" USING btree ("approval_sent_at");
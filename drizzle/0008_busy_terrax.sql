CREATE TYPE "public"."gbp_photo_category" AS ENUM('COVER', 'PROFILE', 'EXTERIOR', 'INTERIOR', 'PRODUCT', 'AT_WORK', 'FOOD_AND_DRINK', 'MENU', 'COMMON_AREA', 'ROOMS', 'TEAMS', 'ADDITIONAL');--> statement-breakpoint
CREATE TYPE "public"."gbp_photo_status" AS ENUM('processing', 'live', 'rejected', 'removed');--> statement-breakpoint
CREATE TYPE "public"."photo_request_status" AS ENUM('sent', 'received', 'uploaded', 'skipped', 'expired');--> statement-breakpoint
CREATE TYPE "public"."post_request_status" AS ENUM('requested', 'owner_content', 'ai_generating', 'pending_approval', 'approved', 'published', 'skipped', 'auto_published');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('STANDARD', 'EVENT', 'OFFER');--> statement-breakpoint
CREATE TABLE "gbp_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"photo_request_id" uuid,
	"media_item_id" text NOT NULL,
	"category" "gbp_photo_category" NOT NULL,
	"source_url" text NOT NULL,
	"status" "gbp_photo_status" DEFAULT 'processing' NOT NULL,
	"uploaded_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "photo_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"status" "photo_request_status" DEFAULT 'sent' NOT NULL,
	"requested_at" timestamp with time zone NOT NULL,
	"received_at" timestamp with time zone,
	"uploaded_at" timestamp with time zone,
	"reminder_sent_at" timestamp with time zone,
	"media_ids" text[],
	"gbp_media_ids" text[],
	"week" integer NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "photo_requests_week_unique" UNIQUE("tenant_id","week","year")
);
--> statement-breakpoint
CREATE TABLE "post_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"status" "post_request_status" DEFAULT 'requested' NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"owner_content" text,
	"ai_draft" text,
	"final_content" text,
	"post_type" "post_type" DEFAULT 'STANDARD',
	"call_to_action_type" text,
	"call_to_action_url" text,
	"image_url" text,
	"requested_at" timestamp with time zone,
	"reminder1_sent_at" timestamp with time zone,
	"reminder2_sent_at" timestamp with time zone,
	"draft_sent_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"gbp_post_id" text,
	"gbp_post_state" text,
	"is_safe_content" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "google_connections" ADD COLUMN "place_id" varchar(100);--> statement-breakpoint
ALTER TABLE "gbp_photos" ADD CONSTRAINT "gbp_photos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gbp_photos" ADD CONSTRAINT "gbp_photos_photo_request_id_photo_requests_id_fk" FOREIGN KEY ("photo_request_id") REFERENCES "public"."photo_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_requests" ADD CONSTRAINT "photo_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_requests" ADD CONSTRAINT "post_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gbp_photos_tenant_idx" ON "gbp_photos" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "gbp_photos_request_idx" ON "gbp_photos" USING btree ("photo_request_id");--> statement-breakpoint
CREATE INDEX "gbp_photos_status_idx" ON "gbp_photos" USING btree ("status");--> statement-breakpoint
CREATE INDEX "photo_requests_status_idx" ON "photo_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "photo_requests_tenant_idx" ON "photo_requests" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "post_requests_tenant_month_idx" ON "post_requests" USING btree ("tenant_id","month","year");--> statement-breakpoint
CREATE INDEX "post_requests_status_idx" ON "post_requests" USING btree ("status");
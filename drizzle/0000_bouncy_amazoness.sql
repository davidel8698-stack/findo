CREATE TYPE "public"."tenant_status" AS ENUM('trial', 'active', 'grace', 'paused', 'cancelled');--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"business_type" varchar(100),
	"owner_name" varchar(255) NOT NULL,
	"owner_email" varchar(255) NOT NULL,
	"owner_phone" varchar(50),
	"address" text,
	"status" "tenant_status" DEFAULT 'trial' NOT NULL,
	"trial_ends_at" timestamp with time zone,
	"grace_period_ends_at" timestamp with time zone,
	"timezone" varchar(50) DEFAULT 'Asia/Jerusalem' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "tenants_owner_email_unique" UNIQUE("owner_email")
);

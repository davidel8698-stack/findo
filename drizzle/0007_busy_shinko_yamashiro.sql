CREATE TYPE "public"."accounting_provider" AS ENUM('greeninvoice', 'icount');--> statement-breakpoint
CREATE TYPE "public"."review_request_source" AS ENUM('greeninvoice', 'icount', 'manual', 'forwarded');--> statement-breakpoint
CREATE TYPE "public"."review_request_status" AS ENUM('pending', 'requested', 'reminded', 'completed', 'stopped', 'skipped');--> statement-breakpoint
CREATE TABLE "accounting_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"provider" "accounting_provider" NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"credentials_vault_id" uuid NOT NULL,
	"last_poll_at" timestamp with time zone,
	"last_invoice_date" timestamp with time zone,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounting_connections_provider_unique" UNIQUE("tenant_id","provider")
);
--> statement-breakpoint
CREATE TABLE "review_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"source" "review_request_source" NOT NULL,
	"invoice_id" varchar(255),
	"invoice_number" varchar(100),
	"customer_phone" varchar(20),
	"customer_name" varchar(255),
	"customer_email" varchar(255),
	"status" "review_request_status" DEFAULT 'pending' NOT NULL,
	"invoice_detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"scheduled_for_at" timestamp with time zone,
	"requested_at" timestamp with time zone,
	"reminder_sent_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"request_message_id" varchar(255),
	"reminder_message_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_requests_invoice_unique" UNIQUE("tenant_id","source","invoice_id")
);
--> statement-breakpoint
ALTER TABLE "accounting_connections" ADD CONSTRAINT "accounting_connections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_requests" ADD CONSTRAINT "review_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "review_requests_status_idx" ON "review_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_requests_scheduled_idx" ON "review_requests" USING btree ("scheduled_for_at");
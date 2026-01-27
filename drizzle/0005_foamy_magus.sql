CREATE TYPE "public"."google_connection_status" AS ENUM('pending', 'active', 'disconnected', 'invalid');--> statement-breakpoint
CREATE TABLE "google_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"account_id" varchar(50) NOT NULL,
	"account_name" varchar(255) NOT NULL,
	"location_id" varchar(50),
	"location_name" varchar(255),
	"status" "google_connection_status" DEFAULT 'pending' NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "google_connections_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
ALTER TABLE "google_connections" ADD CONSTRAINT "google_connections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "google_connections_status_idx" ON "google_connections" USING btree ("status");
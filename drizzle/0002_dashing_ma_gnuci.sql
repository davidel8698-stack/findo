CREATE TYPE "public"."token_provider" AS ENUM('whatsapp', 'google', 'voicenter', 'greeninvoice', 'icount', 'clerk');--> statement-breakpoint
CREATE TYPE "public"."token_type" AS ENUM('access_token', 'refresh_token', 'api_key', 'webhook_secret');--> statement-breakpoint
CREATE TABLE "token_vault" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"provider" "token_provider" NOT NULL,
	"token_type" "token_type" NOT NULL,
	"identifier" varchar(255),
	"encrypted_value" text NOT NULL,
	"expires_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"last_refreshed_at" timestamp with time zone,
	"is_valid" varchar(10) DEFAULT 'true' NOT NULL,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "token_vault_unique" UNIQUE("tenant_id","provider","token_type","identifier")
);
--> statement-breakpoint
ALTER TABLE "token_vault" ADD CONSTRAINT "token_vault_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "token_vault_tenant_provider_idx" ON "token_vault" USING btree ("tenant_id","provider");--> statement-breakpoint
CREATE INDEX "token_vault_expires_at_idx" ON "token_vault" USING btree ("expires_at");
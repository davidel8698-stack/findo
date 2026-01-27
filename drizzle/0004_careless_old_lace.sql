CREATE TYPE "public"."lead_conversation_state" AS ENUM('awaiting_response', 'awaiting_name', 'awaiting_need', 'awaiting_preference', 'completed', 'unresponsive');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('missed_call', 'manual', 'website');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'qualifying', 'qualified', 'unresponsive', 'contacted', 'converted', 'lost');--> statement-breakpoint
CREATE TABLE "lead_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"state" "lead_conversation_state" DEFAULT 'awaiting_response' NOT NULL,
	"reminder1_sent_at" timestamp with time zone,
	"reminder2_sent_at" timestamp with time zone,
	"whatsapp_conversation_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lead_conversations_lead_id_unique" UNIQUE("lead_id")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"source" "lead_source" DEFAULT 'missed_call' NOT NULL,
	"source_id" varchar(100),
	"customer_phone" varchar(20) NOT NULL,
	"customer_name" varchar(255),
	"need" text,
	"contact_preference" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"qualified_at" timestamp with time zone,
	"contacted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missed_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"call_id" varchar(100) NOT NULL,
	"caller_phone" varchar(20) NOT NULL,
	"business_phone" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"called_at" timestamp with time zone NOT NULL,
	"processed_at" timestamp with time zone,
	"lead_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "missed_calls_call_id_unique" UNIQUE("call_id")
);
--> statement-breakpoint
ALTER TABLE "lead_conversations" ADD CONSTRAINT "lead_conversations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_calls" ADD CONSTRAINT "missed_calls_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_calls" ADD CONSTRAINT "missed_calls_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_conversations_lead_id_idx" ON "lead_conversations" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "leads_tenant_id_idx" ON "leads" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_customer_phone_idx" ON "leads" USING btree ("customer_phone");
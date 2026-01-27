CREATE TYPE "public"."whatsapp_connection_status" AS ENUM('pending', 'active', 'disconnected', 'invalid');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_message_status" AS ENUM('pending', 'sent', 'delivered', 'read', 'failed');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_message_type" AS ENUM('text', 'image', 'template', 'unknown');--> statement-breakpoint
CREATE TABLE "whatsapp_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"waba_id" varchar(50) NOT NULL,
	"phone_number_id" varchar(50) NOT NULL,
	"display_phone_number" varchar(20) NOT NULL,
	"business_name" varchar(255),
	"status" "whatsapp_connection_status" DEFAULT 'pending' NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_connections_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"customer_name" varchar(255),
	"window_opened_at" timestamp with time zone,
	"window_expires_at" timestamp with time zone,
	"last_message_at" timestamp with time zone,
	"message_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_conversations_unique" UNIQUE("tenant_id","customer_phone")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"conversation_id" uuid,
	"wa_message_id" varchar(100),
	"direction" "whatsapp_message_direction" NOT NULL,
	"type" "whatsapp_message_type" NOT NULL,
	"content" text,
	"media_id" varchar(255),
	"template_name" varchar(100),
	"recipient_phone" varchar(20) NOT NULL,
	"sender_phone" varchar(20) NOT NULL,
	"status" "whatsapp_message_status" DEFAULT 'pending' NOT NULL,
	"error_code" varchar(20),
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "whatsapp_connections" ADD CONSTRAINT "whatsapp_connections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_conversation_id_whatsapp_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."whatsapp_conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "whatsapp_connections_status_idx" ON "whatsapp_connections" USING btree ("status");--> statement-breakpoint
CREATE INDEX "whatsapp_conversations_window_expires_idx" ON "whatsapp_conversations" USING btree ("window_expires_at");--> statement-breakpoint
CREATE INDEX "whatsapp_conversations_tenant_phone_idx" ON "whatsapp_conversations" USING btree ("tenant_id","customer_phone");--> statement-breakpoint
CREATE INDEX "whatsapp_messages_wa_message_id_idx" ON "whatsapp_messages" USING btree ("wa_message_id");--> statement-breakpoint
CREATE INDEX "whatsapp_messages_tenant_recipient_idx" ON "whatsapp_messages" USING btree ("tenant_id","recipient_phone");--> statement-breakpoint
CREATE INDEX "whatsapp_messages_conversation_idx" ON "whatsapp_messages" USING btree ("conversation_id");
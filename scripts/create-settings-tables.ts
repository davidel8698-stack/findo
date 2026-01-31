import 'dotenv/config';
import { db } from '../src/db/index';
import { sql } from 'drizzle-orm';

async function createTables() {
  try {
    // Create notification_preferences table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "notification_preferences" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "tenant_id" uuid NOT NULL,
        "notify_new_lead" boolean DEFAULT true NOT NULL,
        "notify_lead_qualified" boolean DEFAULT true NOT NULL,
        "notify_lead_unresponsive" boolean DEFAULT true NOT NULL,
        "notify_new_review" boolean DEFAULT true NOT NULL,
        "notify_negative_review" boolean DEFAULT true NOT NULL,
        "notify_review_posted" boolean DEFAULT false NOT NULL,
        "notify_photo_request" boolean DEFAULT true NOT NULL,
        "notify_post_approval" boolean DEFAULT true NOT NULL,
        "notify_system_alert" boolean DEFAULT true NOT NULL,
        "notify_weekly_report" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "notification_preferences_tenant_id_unique" UNIQUE("tenant_id")
      )
    `);
    console.log('Created notification_preferences table');

    // Create chatbot_config table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "chatbot_config" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "tenant_id" uuid NOT NULL,
        "questions" jsonb DEFAULT '[{"id":"name","text":"איך קוראים לך?","expectedType":"text","order":1,"isRequired":true,"isActive":true},{"id":"need","text":"במה אוכל לעזור לך?","expectedType":"text","order":2,"isRequired":true,"isActive":true},{"id":"preference","text":"מתי נוח לך שנחזור אליך?","expectedType":"text","order":3,"isRequired":false,"isActive":true}]'::jsonb NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "chatbot_config_tenant_id_unique" UNIQUE("tenant_id")
      )
    `);
    console.log('Created chatbot_config table');

    // Add foreign keys (use DO block to handle IF NOT EXISTS for constraints)
    try {
      await db.execute(sql`
        ALTER TABLE "notification_preferences"
        ADD CONSTRAINT "notification_preferences_tenant_id_tenants_id_fk"
        FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action
      `);
    } catch (e: any) {
      if (!e.message?.includes('already exists')) throw e;
    }

    try {
      await db.execute(sql`
        ALTER TABLE "chatbot_config"
        ADD CONSTRAINT "chatbot_config_tenant_id_tenants_id_fk"
        FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action
      `);
    } catch (e: any) {
      if (!e.message?.includes('already exists')) throw e;
    }

    console.log('Tables created successfully!');
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

createTables();

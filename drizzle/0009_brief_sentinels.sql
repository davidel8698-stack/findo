CREATE TYPE "public"."ab_test_type" AS ENUM('review_request_message', 'review_request_timing', 'review_reminder_message', 'photo_request_message', 'post_request_message');--> statement-breakpoint
CREATE TYPE "public"."metric_period" AS ENUM('week', 'month');--> statement-breakpoint
CREATE TABLE "ab_test_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone NOT NULL,
	"samples_collected" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"conversion_rate" numeric(5, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"deactivated_at" timestamp with time zone,
	"deactivation_reason" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ab_test_assignments_unique" UNIQUE("tenant_id","variant_id")
);
--> statement-breakpoint
CREATE TABLE "ab_test_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_type" "ab_test_type" NOT NULL,
	"variant_name" varchar(100) NOT NULL,
	"variant_content" text NOT NULL,
	"is_control" boolean DEFAULT false NOT NULL,
	"is_global_winner" boolean DEFAULT false NOT NULL,
	"global_winner_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ab_test_variants_unique" UNIQUE("test_type","variant_name")
);
--> statement-breakpoint
CREATE TABLE "metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"snapshot_date" date NOT NULL,
	"period" "metric_period" NOT NULL,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"review_count" integer DEFAULT 0 NOT NULL,
	"response_percentage" numeric(5, 2),
	"impressions" integer,
	"searches" integer,
	"actions" integer,
	"image_count" integer DEFAULT 0 NOT NULL,
	"image_views" integer,
	"review_requests_sent" integer DEFAULT 0 NOT NULL,
	"review_requests_completed" integer DEFAULT 0 NOT NULL,
	"review_request_conversion_rate" numeric(5, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "metric_snapshots_unique" UNIQUE("tenant_id","snapshot_date","period")
);
--> statement-breakpoint
CREATE TABLE "optimization_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"review_request_delay_hours" integer DEFAULT 24 NOT NULL,
	"review_reminder_delay_days" integer DEFAULT 3 NOT NULL,
	"max_review_requests_per_customer_per_month" integer DEFAULT 1 NOT NULL,
	"override_limits" boolean DEFAULT false NOT NULL,
	"last_tuning_run" timestamp with time zone,
	"last_tuning_action" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "optimization_config_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "tenant_baselines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"baseline_review_rate" numeric(5, 2),
	"baseline_response_rate" numeric(5, 2),
	"baseline_conversion_rate" numeric(5, 2),
	"samples_count" integer DEFAULT 0 NOT NULL,
	"calculated_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_baselines_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
ALTER TABLE "ab_test_assignments" ADD CONSTRAINT "ab_test_assignments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ab_test_assignments" ADD CONSTRAINT "ab_test_assignments_variant_id_ab_test_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."ab_test_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_config" ADD CONSTRAINT "optimization_config_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_baselines" ADD CONSTRAINT "tenant_baselines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ab_test_assignments_variant_idx" ON "ab_test_assignments" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "ab_test_variants_type_idx" ON "ab_test_variants" USING btree ("test_type");--> statement-breakpoint
CREATE INDEX "metric_snapshots_tenant_idx" ON "metric_snapshots" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "metric_snapshots_date_idx" ON "metric_snapshots" USING btree ("snapshot_date");
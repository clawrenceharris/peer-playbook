-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "lesson_phase" AS ENUM('warmup', 'workout', 'closer');--> statement-breakpoint
CREATE TYPE "session_size" AS ENUM('1+', '2+', '4+', '2-4', '4-8', '8+');--> statement-breakpoint
CREATE TYPE "session_status" AS ENUM('scheduled', 'active', 'completed', 'canceled');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('si_leader', 'student', 'coordinator');--> statement-breakpoint
CREATE TABLE "activity_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"activity_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"state" jsonb DEFAULT '{"status":"idle", "participants": []}' NOT NULL,
	"results" jsonb
);
--> statement-breakpoint
ALTER TABLE "activity_executions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "activity_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"execution_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"block_id" varchar(255) NOT NULL,
	"response" jsonb NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_responses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"tags" text[],
	"definition" jsonb NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "valid_activity_definition" CHECK (validate_activity_definition(definition))
);
--> statement-breakpoint
ALTER TABLE "custom_activities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "flow_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"flow_id" uuid,
	"type" text NOT NULL,
	"position" integer NOT NULL,
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "flow_blocks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "flows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"description" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "flows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "playbook_strategies" (
	"id" uuid DEFAULT gen_random_uuid(),
	"playbook_id" uuid NOT NULL,
	"card_slug" text DEFAULT 'custom-card' NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"steps" text[] NOT NULL,
	"phase" "lesson_phase" NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"virtualized" boolean DEFAULT false,
	"description" text DEFAULT 'No description' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "lesson_cards_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "playbook_strategies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "playbooks" (
	"id" uuid DEFAULT gen_random_uuid(),
	"topic" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"course_name" text,
	"owner" uuid DEFAULT auth.uid(),
	CONSTRAINT "lessons_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "playbooks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT auth.uid(),
	"email" text,
	"first_name" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"onboarding_completed" boolean DEFAULT false,
	"courses" text[] DEFAULT '{}'::text[],
	"role" "user_role" DEFAULT 'si_leader'::"user_role",
	"updated_at" timestamp with time zone DEFAULT now(),
	"last_name" text,
	"onboarding_complete" boolean DEFAULT false NOT NULL,
	"courses_instructed" text[] DEFAULT '{}'::text[]
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "session_contexts" (
	"id" uuid DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"context" text NOT NULL CONSTRAINT "student_contexts_context_key" UNIQUE,
	CONSTRAINT "situations_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "session_contexts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"description" text DEFAULT '',
	"course_name" text DEFAULT '',
	"topic" text DEFAULT '',
	"leader_id" uuid DEFAULT auth.uid(),
	"session_code" text CONSTRAINT "sessions_session_code_key" UNIQUE,
	"status" "session_status" DEFAULT 'scheduled'::"session_status" NOT NULL,
	"scheduled_start" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"playbook_id" uuid,
	"virtual" boolean DEFAULT false NOT NULL,
	"call_id" uuid
);
--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "strategies" (
	"id" uuid DEFAULT gen_random_uuid(),
	"slug" text DEFAULT 'custom-card' CONSTRAINT "strategy_cards_slug_key" UNIQUE,
	"title" text NOT NULL,
	"category" text DEFAULT '',
	"steps" text[] NOT NULL,
	"good_for" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"course_tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"session_size" "session_size" DEFAULT '2+'::"session_size" NOT NULL,
	"virtual_friendly" boolean DEFAULT false NOT NULL,
	"virtualized" boolean DEFAULT false,
	"description" text DEFAULT 'No description' NOT NULL,
	CONSTRAINT "strategy_cards_pkey" PRIMARY KEY("id","slug")
);
--> statement-breakpoint
ALTER TABLE "strategies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "strategy_contexts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"context" text NOT NULL,
	"strategy_slug" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "strategy_contexts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "context_card_unique" ON "strategy_contexts" ("context","strategy_slug");--> statement-breakpoint
CREATE INDEX "idx_activity_executions_activity_id" ON "activity_executions" ("activity_id");--> statement-breakpoint
CREATE INDEX "idx_activity_executions_session_id" ON "activity_executions" ("session_id");--> statement-breakpoint
CREATE INDEX "idx_activity_executions_started_at" ON "activity_executions" ("started_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_activity_responses_block_id" ON "activity_responses" ("block_id");--> statement-breakpoint
CREATE INDEX "idx_activity_responses_execution_id" ON "activity_responses" ("execution_id");--> statement-breakpoint
CREATE INDEX "idx_activity_responses_participant_id" ON "activity_responses" ("participant_id");--> statement-breakpoint
CREATE INDEX "idx_activity_responses_submitted_at" ON "activity_responses" ("submitted_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_custom_activities_created_at" ON "custom_activities" ("created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_custom_activities_created_by" ON "custom_activities" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_custom_activities_is_public" ON "custom_activities" ("is_public");--> statement-breakpoint
CREATE INDEX "idx_custom_activities_name" ON "custom_activities" ("name");--> statement-breakpoint
CREATE INDEX "idx_custom_activities_tags" ON "custom_activities" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "idx_profiles_onboarding_complete" ON "profiles" ("onboarding_complete");--> statement-breakpoint
CREATE INDEX "idx_sessions_course_name" ON "sessions" ("course_name");--> statement-breakpoint
CREATE INDEX "idx_sessions_course_topic" ON "sessions" ("course_name","topic");--> statement-breakpoint
CREATE INDEX "idx_sessions_scheduled_start" ON "sessions" ("scheduled_start");--> statement-breakpoint
CREATE INDEX "idx_sessions_session_code" ON "sessions" ("session_code");--> statement-breakpoint
CREATE INDEX "idx_sessions_si_leader_id" ON "sessions" ("leader_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_status" ON "sessions" ("status");--> statement-breakpoint
CREATE INDEX "strategy_cards_course_tags_gin" ON "strategies" USING gin ("course_tags");--> statement-breakpoint
CREATE INDEX "strategy_cards_session_virtual_idx" ON "strategies" ("session_size","virtual_friendly");--> statement-breakpoint
ALTER TABLE "activity_executions" ADD CONSTRAINT "activity_executions_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "custom_activities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "activity_executions" ADD CONSTRAINT "activity_executions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "activity_responses" ADD CONSTRAINT "activity_responses_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "activity_executions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "activity_responses" ADD CONSTRAINT "activity_responses_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "custom_activities" ADD CONSTRAINT "custom_activities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "flow_blocks" ADD CONSTRAINT "flow_blocks_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "flows" ADD CONSTRAINT "flows_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "playbook_strategies" ADD CONSTRAINT "lesson_cards_lesson_id_fkey" FOREIGN KEY ("playbook_id") REFERENCES "playbooks"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "playbooks" ADD CONSTRAINT "lessons_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "playbooks" ADD CONSTRAINT "playbooks_owner_fkey" FOREIGN KEY ("owner") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_leader_id_fkey1" FOREIGN KEY ("leader_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_playbook_id_fkey" FOREIGN KEY ("playbook_id") REFERENCES "playbooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "strategy_contexts" ADD CONSTRAINT "strategy_contexts_context_fkey" FOREIGN KEY ("context") REFERENCES "session_contexts"("context") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "strategy_contexts" ADD CONSTRAINT "strategy_contexts_strategy_slug_fkey" FOREIGN KEY ("strategy_slug") REFERENCES "strategies"("slug") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
CREATE POLICY "users_view_own_activities" ON "custom_activities" AS PERMISSIVE FOR SELECT TO public USING ((created_by = auth.uid()));--> statement-breakpoint
CREATE POLICY "Users can manage blocks for their flows" ON "flow_blocks" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM flows f
  WHERE ((f.id = flow_blocks.flow_id) AND (f.created_by = auth.uid())))));--> statement-breakpoint
CREATE POLICY "Users can manage own flows" ON "flows" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = created_by));--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "playbook_strategies" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "own lesson_cards via lesson" ON "playbook_strategies" AS PERMISSIVE FOR ALL TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM playbooks l
  WHERE ((l.id = playbook_strategies.playbook_id) AND (l.owner = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM playbooks l
  WHERE ((l.id = playbook_strategies.playbook_id) AND (l.owner = auth.uid())))));--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "playbooks" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "own lessons" ON "playbooks" AS PERMISSIVE FOR ALL TO "authenticated" USING ((owner = auth.uid())) WITH CHECK ((owner = auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "user owns their profile" ON "profiles" AS PERMISSIVE FOR ALL TO "authenticated" USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "session_contexts" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "sessions" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "own sessions" ON "sessions" AS PERMISSIVE FOR ALL TO public USING ((leader_id = auth.uid())) WITH CHECK ((leader_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "strategies" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "strategy_contexts" AS PERMISSIVE FOR SELECT TO public USING (true);
*/
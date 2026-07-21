ALTER TABLE "public"."playbook_strategies"
ADD COLUMN IF NOT EXISTS "facilitator_notes" TEXT,
ADD COLUMN IF NOT EXISTS "estimated_minutes" INTEGER;

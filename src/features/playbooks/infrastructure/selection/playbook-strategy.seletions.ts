import { Prisma } from "@/lib/db/client";

export const playbookStrategyCardArgs = {
  select: {
    id: true,
    title: true,
    category: true,
    slug: true,
    steps: true,
    description: true,
    created_at: true,
    updated_at: true,
    phase: true,
    position: true,
    source_id: true,
    source_type: true,
    playbook_phase_id: true,
  },
} satisfies Prisma.playbook_strategiesDefaultArgs;
export const playbookStrategyDetailArgs = {
  select: {
    id: true,
    slug: true,
    category: true,
    playbook_phase_id: true,
    playbook_id: true,
    title: true,
    phase: true,
    position: true,
    source_id: true,
    source_type: true,
    steps: true,
    description: true,
    facilitator_notes: true,
    estimated_minutes: true,
    created_at: true,
    updated_at: true,
  },
} satisfies Prisma.playbook_strategiesDefaultArgs;
export type PlaybookStrategyDetailRecord = Prisma.playbook_strategiesGetPayload<
  typeof playbookStrategyDetailArgs
>;
export type PlaybookStrategyCardRecord = Prisma.playbook_strategiesGetPayload<
  typeof playbookStrategyCardArgs
>;

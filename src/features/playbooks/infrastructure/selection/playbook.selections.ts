import { Prisma } from "@/lib/db/client";

export const playbookPhaseArgs = {
  select: {
    id: true,
    title: true,
    description: true,
    objective: true,
    estimated_minutes: true,
    position: true,
    phase_intent_id: true,
    phase_intents: {
      select: {
        id: true,
        description: true,
        key: true,
        label: true,
        color_token: true,
        icon_name: true,
        sort_order: true,
      },
    },
  },
} satisfies Prisma.playbook_phasesDefaultArgs;
export const playbookDetailArgs = {
  select: {
    id: true,
    title: true,
    topic: true,
    course_name: true,
    subject: true,
    created_by: true,
    created_at: true,
    updated_at: true,
    published: true,
    playbook_phases: {
      ...playbookPhaseArgs,
    },
    playbook_strategies: {
      select: {
        id: true,
        slug: true,
        category: true,
        title: true,
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
    },
  },
} satisfies Prisma.playbooksDefaultArgs;
export const playbookCardArgs = {
  select: {
    id: true,
    title: true,
    topic: true,
    course_name: true,
    subject: true,
    created_by: true,
    created_at: true,
    updated_at: true,
    published: true,
  },
} satisfies Prisma.playbooksDefaultArgs;

export type PlaybookDetailRecord = Prisma.playbooksGetPayload<
  typeof playbookDetailArgs
>;

export type PlaybookPhaseRecord = Prisma.playbook_phasesGetPayload<
  typeof playbookPhaseArgs
>;
export type PlaybookCardRecord = Prisma.playbooksGetPayload<
  typeof playbookCardArgs
>;

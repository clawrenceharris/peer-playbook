import { Prisma } from "@/db/client";

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
    playbook_phases: true,
    playbook_strategies: {
      select: {
        id: true,
        card_slug: true,
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
export const playbookPhaseArgs = {
  select: {
    id: true,
    title: true,
    description: true,
    objective: true,
    estimated_minutes: true,
    position: true,
    phase_intents: {
      select: {
        id: true,
        key: true,
        label: true,
        description: true,
        color_token: true,
        icon_name: true,
        sort_order: true,
      },
    },
  },
} satisfies Prisma.playbook_phasesDefaultArgs;
export type PlaybookDetailRecord = Prisma.playbooksGetPayload<
  typeof playbookDetailArgs
>;

export type PlaybookPhaseRecord = Prisma.playbook_phasesGetPayload<
  typeof playbookPhaseArgs
>;
export type PlaybookCardRecord = Prisma.playbooksGetPayload<
  typeof playbookCardArgs
>;

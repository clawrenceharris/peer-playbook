import { Prisma } from "@/lib/db/client";

export const sessionDetailSelection = {
  select: {
    id: true,
    title: true,
    playbooks: true,
    profiles: true,
    scheduled_start: true,
    mode: true,
    subject: true,
    topic: true,
    course_name: true,
    description: true,
    status: true,
  },
} satisfies Prisma.public_sessionsDefaultArgs;

export const sessionCardSelection = {
  select: {
    id: true,
    title: true,
    playbook_id: true,
    scheduled_start: true,
    mode: true,
    profiles: {
      select: {
        id: true,
        avatar_url: true,
        first_name: true,
        last_name: true,
      },
    },
    subject: true,
    topic: true,
    course_name: true,
    description: true,
    status: true,
  },
} satisfies Prisma.public_sessionsDefaultArgs;

export type SessionDetailRecord = Prisma.public_sessionsGetPayload<
  typeof sessionDetailSelection
>;
export type SessionCardRecord = Prisma.public_sessionsGetPayload<
  typeof sessionCardSelection
>;

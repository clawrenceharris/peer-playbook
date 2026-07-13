export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { makeCreatePlaybookUseCase } from "@/composition/playbook";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildPlaybookSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await createServerSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = {
    title: body.title ?? body.topic,
    subject: body.subject,
    courseName: body.courseName ?? body.course_name,
    topic: body.topic,
    modes: body.modes,
    contexts: body.contexts,
    instructionalModelId: body.instructionalModelId,
    phases: body.phases,
    warmup: body.strategies?.warmup,
    workout: body.strategies?.workout,
    closer: body.strategies?.closer,
    userId: user.id,
  };
  const { error } = buildPlaybookSchema.safeParse(input);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const useCase = makeCreatePlaybookUseCase();
  const result = await useCase.execute(input);
  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ playbookId: result.data.id }, { status: 200 });
}

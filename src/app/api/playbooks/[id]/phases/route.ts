import { NextRequest, NextResponse } from "next/server";
import { makeUpdatePlaybookPhasesUseCase } from "@/composition/playbook";
import { phaseIntentKeySchema } from "@/lib/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

export const runtime = "nodejs";

const updatePlaybookPhasesSchema = z.object({
  phases: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1),
      intentKey: phaseIntentKeySchema,
      position: z.number().int().nonnegative(),
      estimatedMinutes: z.number().int().nonnegative().nullable(),
      objective: z.string().nullable(),
    }),
  ),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const client = await createServerSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: playbookId } = await params;
  const body = await req.json();
  const parsed = updatePlaybookPhasesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const useCase = makeUpdatePlaybookPhasesUseCase();
  const result = await useCase.execute({
    playbookId,
    phases: parsed.data.phases,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json(result.data);
}

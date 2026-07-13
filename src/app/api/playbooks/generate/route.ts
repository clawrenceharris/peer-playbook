export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generatePlaybookSchema } from "@/lib/validation";
import { generatePlaybookAction } from "@/actions/playbook";

export async function POST(req: NextRequest) {
  try {
    const { title, subject, courseName, course_name, topic, modes, instructions, contexts } =
      await req.json();
    const input = {
      title: title ?? topic,
      subject,
      courseName: courseName ?? course_name,
      topic,
      modes,
      instructions,
      contexts,
    };
    const { error: validationError } = generatePlaybookSchema.safeParse(input);
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 },
      );
    }
    const client = await createServerSupabaseClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await generatePlaybookAction({ ...input, userId: user.id });
    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    return NextResponse.json({ id: result.data.id }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

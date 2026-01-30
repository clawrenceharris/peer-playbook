export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";

import {
  PlaybookStrategies,
  PlaybookStrategiesInsert,
  PlaybooksInsert,
  Strategies,
} from "@/types/tables";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { subject, course_name, topic, modes, instructions, contexts } =
    await req.json();

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: strategies = [], error: ce } = await client.rpc(
    "get_strategies_by_context",
    {
      contexts,
    }
  );
  if (ce) return NextResponse.json({ error: ce.message }, { status: 500 });

  // Builds a small, prompt-safe catalog

  if (strategies.length < 3) {
    return NextResponse.json(
      {
        error:
          "Playbooks need at least 3 strategies but your filters returned less than that",
      },
      { status: 404 }
    );
  }

  const catalog = strategies.map((c: Strategies) => ({
    slug: c.slug,
    id: c.id,
    title: c.title,
    good_for: c.good_for ?? [],
  })) as Strategies[];
  // Prompt for GPT
  const sys = `You are a Supplement Instruction lesson planner for college students.
              Use ONLY the provided catalog of official strategies by slug.
              Choose exactly 3 SI strategies: one warmup, one workout (main activity), one closer.
              Selection rules:
              - Prefer strategies whose "good_for" tags work together to create a cohesive, well rounded lesson, with a beginning middle and end.
              Return STRICT JSON with no commentary:
              {
                "strategies": [
                  { "slug": string, "phase": "warmup"|"workout"|"closer"  }
                ]
              }`;
  const usr = ` Subject: ${subject} Topic: ${topic}
   ${instructions ? "Instructions: " + instructions : ""}
  Catalog (slug | title | good_for | session_size):
  ${catalog
    .map((c) => `${c.slug} | ${c.title} | [${c.good_for.join(", ")}]`)
    .join("\n")}
  `;

  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr },
    ],
    response_format: { type: "json_object" },
  });

  const choice = JSON.parse(resp.choices[0].message?.content ?? "{}") as {
    strategies: { slug: string; phase: PlaybookStrategies["phase"] }[];
  };
  // Create the playbook
  const { data: playbook, error: le } = await client
    .from("playbooks")
    .insert<PlaybooksInsert>({
      topic,
      subject,
      modes,
      course_name,
    })
    .select()
    .single();

  if (le) return NextResponse.json({ error: le.message }, { status: 500 });

  // Rehydrates selected strategies from database and copy steps into playbook_strategies with editable copies
  const slugs = choice.strategies.map((c) => c.slug);
  const { data: fullStrategies, error: se } = await client
    .from("strategies")
    .select("id,slug,title,steps")
    .in("slug", slugs);

  if (se) return NextResponse.json({ error: se.message }, { status: 500 });

  const rows = choice.strategies.map((sel, position) => {
    const s = fullStrategies.find((fc) => fc.slug === sel.slug)!;
    const strategy: PlaybookStrategiesInsert = {
      playbook_id: playbook.id,
      title: s.title,
      steps: s.steps,
      phase: sel.phase,
      // Polymorphic reference (system strategy)
      source_type: "system",
      source_id: s.id,
      // Position for ordering within the playbook
      position,
    }
    return strategy
  });

  const { error: li } = await client.from("playbook_strategies").insert(rows);

  if (li) return NextResponse.json({ error: li.message }, { status: 500 });

  return NextResponse.json({ id: playbook.id }, { status: 200 });
}

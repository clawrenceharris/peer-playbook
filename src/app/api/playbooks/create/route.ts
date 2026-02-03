/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  PlaybooksInsert,
  Strategies,
  UserStrategies,
} from "@/types/tables";

type StrategyRef = { sourceType: "system" | "user"; sourceId: string };

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    subject: string;
    course_name: string;
    topic: string;
    modes: string[];
    contexts?: string[];
    notes?: string;
    strategies: {
      warmup: StrategyRef[];
      workout: StrategyRef[];
      closer: StrategyRef[];
    };
  };

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: playbook, error: pe } = await client
    .from("playbooks")
    .insert<PlaybooksInsert>({
      topic: body.topic,
      subject: body.subject as any,
      modes: body.modes as any,
      course_name: body.course_name,
    })
    .select()
    .single();

  if (pe || !playbook) {
    return NextResponse.json(
      { error: pe?.message || "Failed to create playbook" },
      { status: 500 }
    );
  }

  const warmup = body.strategies?.warmup ?? [];
  const workout = body.strategies?.workout ?? [];
  const closer = body.strategies?.closer ?? [];
  const all = [
    ...warmup.map((r, idx) => ({
      ...r,
      phase: "warmup" as const,
      position: idx,
    })),
    ...workout.map((r, idx) => ({
      ...r,
      phase: "workout" as const,
      position: idx,
    })),
    ...closer.map((r, idx) => ({
      ...r,
      phase: "closer" as const,
      position: idx,
    })),
  ];

  const systemIds = all
    .filter((r) => r.sourceType === "system")
    .map((r) => r.sourceId);
  const userIds = all
    .filter((r) => r.sourceType === "user")
    .map((r) => r.sourceId);

  const { data: systemStrategies, error: se } = systemIds.length
    ? await client
        .from("strategies")
        .select("id,title,steps,description")
        .in("id", systemIds)
    : { data: [] as Strategies[], error: null };

  if (se) return NextResponse.json({ error: se.message }, { status: 500 });

  const { data: userStrategies, error: ue } = userIds.length
    ? await client
        .from("user_strategies")
        .select("id,title,steps")
        .in("id", userIds)
    : { data: [] as UserStrategies[], error: null };

  if (ue) return NextResponse.json({ error: ue.message }, { status: 500 });

  const rows = all.map((sel) => {
    if (sel.sourceType === "system") {
      const s = (systemStrategies ?? []).find((x) => x.id === sel.sourceId);
      if (!s) throw new Error("Missing strategy");
      return {
        playbook_id: playbook.id,
        title: s.title,
        steps: s.steps,
        description: s.description ?? "",
        phase: sel.phase as any,
        source_type: "system",
        source_id: s.id,
        position: sel.position,
      };
    }

    const us = (userStrategies ?? []).find((x) => x.id === sel.sourceId);
    if (!us) throw new Error("Missing user strategy");
    return {
      playbook_id: playbook.id,
      title: us.title,
      steps: us.steps ?? [],
      description: "",
      phase: sel.phase as any,
      source_type: "user",
      source_id: us.id,
      position: sel.position,
    };
  });

  try {
    const { error: ie } = await client
      .from("playbook_strategies")
      .insert(rows as any);
    if (ie) {
      return NextResponse.json({ error: ie.message }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to create playbook strategies" },
      { status: 500 }
    );
  }

  return NextResponse.json({ playbookId: playbook.id }, { status: 200 });
}

import React from "react";

import PlaybookPage from "./PlaybookPage";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

async function fetchPlaybookTitle(id: string): Promise<string> {
  const supabase = await createClient();
  const { data: playbook } = await supabase
    .from("playbooks")
    .select("topic")
    .eq("id", id)
    .single();

  return playbook?.topic ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const topic = await fetchPlaybookTitle(params.id);
  return {
    title: `Playbook${topic ? " - " + topic : ""}`,
  };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <PlaybookPage playbookId={id} />;
}

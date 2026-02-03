import React from "react";
// import PlaybookEditorPage from "./PlaybookEditorPage";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

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
    title: `Edit Playbook${topic ? " - " + topic : ""}`,
  };
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <></>;
}

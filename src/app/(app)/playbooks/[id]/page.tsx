"use server";
import PlaybookPage from "./PlaybookPage";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function fetchPlaybookTitle(id: string): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const { data: playbook } = await supabase
    .from("playbooks")
    .select("title")
    .eq("id", id)
    .single();
  console.log("playbook", playbook);
  return playbook?.title ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = await fetchPlaybookTitle(id);
  return {
    title: `Playbook${title ? " - " + title : ""}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaybookPage playbookId={id} />;
}

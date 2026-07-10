"use server";
import React from "react";
import PlaybookPage from "./PlaybookPage";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPlaybookPageAction } from "@/actions/playbook/queries/getPlaybookPageAction";
import { ErrorState } from "@/components/states";
import { getUserErrorMessage } from "@/shared/utils/errors";
import { getCurrentUser } from "@/actions/auth";
import { SidebarLayout } from "@/components/sidebar";

async function fetchPlaybookTitle(id: string): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const { data: playbook } = await supabase
    .from("playbooks")
    .select("topic")
    .eq("id", id)
    .single();
  console.log("playbook", playbook);
  return playbook?.topic ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const topic = await fetchPlaybookTitle(id);
  console.log("topic", topic, "id", id);
  return {
    title: `Playbook${topic ? " - " + topic : ""}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getPlaybookPageAction(id);
  if (!result.success) {
    return (
      <SidebarLayout>
        <ErrorState variant="card" message={result.error.message} />
      </SidebarLayout>
    );
  }

  const page = result.data;
  return <PlaybookPage page={page} />;
}

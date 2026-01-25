import React from "react";
import SessionPlayfieldPage from "./SessionPlayfieldPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Session (Virtual) | PeerPlaybook",
};
interface PageProps {
  params: Promise<{ id: string }>;
}
export default function Page({ params }: PageProps) {
  const { id } = React.use(params);

  return <SessionPlayfieldPage id={id} />;
}

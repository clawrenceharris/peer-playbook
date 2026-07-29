import SessionPageClient from "./SessionPageClient";
type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};
export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  return <SessionPageClient id={id} />;
}

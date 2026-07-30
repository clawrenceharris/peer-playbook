import CheckinPageClient from "./CheckinPageClient";

type CheckinPageProps = {
  params: Promise<{
    code: string;
  }>;
};
export default async function CheckinPage({ params }: CheckinPageProps) {
  const { code } = await params;

  return <CheckinPageClient code={code} />;
}

import { getSubject } from "@/lib/data.server";
import { notFound } from "next/navigation";
import SubjectClient from "@/components/SubjectClient";

interface Props {
  params: Promise<{ subjectName: string }>;
}

export default async function SubjectPage({ params }: Props) {
  const { subjectName } = await params;
  const subject = getSubject(subjectName);
  if (!subject) notFound();
  return <SubjectClient subject={subject} />;
}
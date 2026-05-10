import { getSet, getAllSubjects } from "@/lib/data.server";
import { notFound } from "next/navigation";
import QuizClient from "@/components/QuizClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const subjects = getAllSubjects();
  const params: { quizId: string }[] = [];
  for (const subj of subjects) {
    for (const ch of subj.chapters) {
      for (const set of ch.sets) {
        params.push({ quizId: set.id });
      }
    }
  }
  return params;
}

interface Props {
  params: Promise<{ quizId: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { quizId } = await params;
  const mcqSet = getSet(quizId);
  if (!mcqSet) notFound();
  return <QuizClient mcqSet={mcqSet} />;
}

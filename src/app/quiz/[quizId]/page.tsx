import { getSet } from "@/lib/data.server";
import { notFound } from "next/navigation";
import QuizClient from "@/components/QuizClient";

interface Props {
  params: Promise<{ quizId: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { quizId } = await params;
  const mcqSet = getSet(quizId);
  if (!mcqSet) notFound();
  return <QuizClient mcqSet={mcqSet} />;
}
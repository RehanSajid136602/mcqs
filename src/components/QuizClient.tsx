"use client";
import { useRouter, useSearchParams } from "next/navigation";
import type { MCQSet } from "@/types";
import Quiz from "@/components/Quiz";

interface QuizClientProps {
  mcqSet: MCQSet;
}

export default function QuizClient({ mcqSet }: QuizClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId") ?? "unknown";
  const chapterId = searchParams.get("chapterId") ?? "unknown";

  return (
    <Quiz
      set={mcqSet}
      subjectId={subjectId}
      chapterId={chapterId}
      onBack={() => router.back()}
    />
  );
}
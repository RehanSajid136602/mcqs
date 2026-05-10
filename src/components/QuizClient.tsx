"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { MCQSet } from "@/types";
import Quiz from "@/components/Quiz";

interface QuizClientProps {
  mcqSet: MCQSet;
}

function QuizContent({ mcqSet }: QuizClientProps) {
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

export default function QuizClient({ mcqSet }: QuizClientProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-[--text]">Loading quiz...</div></div>}>
      <QuizContent mcqSet={mcqSet} />
    </Suspense>
  );
}

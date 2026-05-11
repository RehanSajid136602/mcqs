export type Question = {
  q: string;
  options: string[];
  correct: number; // zero-based index
  explanation?: string;
};

export type MCQSet = {
  id: string;       // e.g. "chapter-15-gravitation-set-1"
  label: string;    // e.g. "Set 1"
  questions: Question[];
};

export type Chapter = {
  id: string;       // e.g. "chapter-15-gravitation"
  name: string;     // e.g. "Chapter 15: Gravitation"
  sets: MCQSet[];
};

export type Subject = {
  id: string;       // e.g. "physics"
  name: string;     // e.g. "Physics"
  icon: string;     // lucide icon name as string
  chapters: Chapter[];
};

export type DataJSON = {
  subjects: Subject[];
};

export type SetProgress = {
  highScore: number;
  total: number;
  attempts: number;
  lastAttempt: string;
};

export type AttemptSummary = {
  id: string;
  setId: string;
  subjectId: string;
  chapterId: string;
  score: number;
  total: number;
  percentage: number;
  startedAt: string;
  completedAt: string;
  duration: number;
};

export type AttemptDetail = {
  attemptId: string;
  questions: QuestionAttempt[];
};

export type QuestionAttempt = {
  originalIndex: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  chosenOptionIndex: number;
  wasCorrect: boolean;
  explanation?: string;
};

export type SetStats = {
  setId: string;
  totalAttempts: number;
  bestPercentage: number;
  averagePercentage: number;
  totalCorrect: number;
  totalAnswered: number;
  lastAttemptDate: string;
};

export type StudySession = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  activeDuration: number;
  subjectId: string | null;
  chapterId: string | null;
};

export type DailyLog = {
  date: string;
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  activeMinutes: number;
  subjects: string[];
};

export type SubjectAnalytics = {
  subjectId: string;
  subjectName: string;
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  averageScore: number;
  bestScore: number;
  lastAttemptDate: string;
  chaptersCompleted: number;
  totalChapters: number;
  totalStudyMinutes: number;
};

export type GlobalAnalytics = {
  totalAttempts: number;
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  averageScore: number;
  bestScore: number;
  totalStudyMinutes: number;
  weeklyQuizzes: number;
  currentStreak: number;
  bestStreak: number;
  strongestSubjectId: string | null;
  weakestSubjectId: string | null;
  recentScoreDelta: number;
  lastAttemptDate: string;
};
import { readFileSync } from "fs";
import { join } from "path";
import type { Subject, Chapter, MCQSet, DataJSON } from "@/types";

const DATA_PATH = join(process.cwd(), "data", "data.json");

const KA_TEX_DANGEROUS_HREF = /\\href\s*\{([^}]+)\}/g;
const KA_TEX_DANGEROUS_CMD = /\\(?:url|write|input|include|immediate|write18)\s*\{[^}]+\}/g;
const HTML_SCRIPT = /<script[^>]*>[^<]*<\/script>/gi;
const HTML_EVENT_ATTR = /\son\w+\s*=/gi;

function sanitizeContent(text: string): string {
  return text
    .replace(KA_TEX_DANGEROUS_HREF, (_m, url) => {
      const trimmed = url.trim();
      if (/^(javascript|data):/i.test(trimmed)) return "\\href{https://blocked}";
      return `\\href{https://${trimmed.replace(/^https?:\/\//, "")}}`;
    })
    .replace(KA_TEX_DANGEROUS_CMD, " ")
    .replace(HTML_SCRIPT, " ")
    .replace(HTML_EVENT_ATTR, " ");
}

function sanitizeMCQSet(set: MCQSet): MCQSet {
  return {
    ...set,
    questions: set.questions.map((q) => ({
      q: sanitizeContent(q.q),
      options: q.options.map((o) => sanitizeContent(o)),
      correct: q.correct,
      explanation: q.explanation ? sanitizeContent(q.explanation) : q.explanation,
    })),
  };
}

interface Cache {
  subjects: Subject[];
  setIndex: Map<string, MCQSet>;
  chapterIndex: Map<string, Chapter>;
}

let _cache: Cache | null = null;

function loadData(): Cache {
  if (!_cache) {
    const raw: DataJSON = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

    const subjects: Subject[] = raw.subjects.map((subj) => ({
      ...subj,
      chapters: subj.chapters.map((ch) => ({
        ...ch,
        sets: ch.sets.map(sanitizeMCQSet),
      })),
    }));

    const setIndex = new Map<string, MCQSet>();
    const chapterIndex = new Map<string, Chapter>();

    for (const subject of subjects) {
      for (const chapter of subject.chapters) {
        chapterIndex.set(chapter.id, chapter);
        for (const set of chapter.sets) {
          setIndex.set(set.id, set);
        }
      }
    }

    _cache = { subjects, setIndex, chapterIndex };
  }
  return _cache;
}

export function getAllSubjects(): Subject[] {
  return loadData().subjects;
}

export function getSubject(id: string): Subject | undefined {
  return loadData().subjects.find((s) => s.id === id);
}

export function getChapter(subjectId: string, chapterId: string): Chapter | undefined {
  const subject = getSubject(subjectId);
  return subject?.chapters.find((c) => c.id === chapterId);
}

export function getSet(setId: string): MCQSet | undefined {
  return loadData().setIndex.get(setId);
}

export function getAllSetsForChapter(chapterId: string): MCQSet[] {
  return loadData().chapterIndex.get(chapterId)?.sets ?? [];
}

export { type Subject, Chapter, MCQSet, DataJSON };

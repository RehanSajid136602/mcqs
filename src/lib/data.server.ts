import { readFileSync } from "fs";
import { join } from "path";
import type { Subject, Chapter, MCQSet, DataJSON } from "@/types";

const DATA_PATH = join(process.cwd(), "data", "data.json");

let _cache: DataJSON | null = null;

function loadData(): DataJSON {
  if (!_cache) {
    _cache = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  }
  return _cache!;
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
  for (const subject of loadData().subjects) {
    for (const chapter of subject.chapters) {
      const set = chapter.sets.find((s) => s.id === setId);
      if (set) return set;
    }
  }
  return undefined;
}

export function getAllSetsForChapter(chapterId: string): MCQSet[] {
  for (const subject of loadData().subjects) {
    const chapter = subject.chapters.find((c) => c.id === chapterId);
    if (chapter) return chapter.sets;
  }
  return [];
}

export { type Subject, Chapter, MCQSet, DataJSON };
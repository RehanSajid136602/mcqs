import { readFileSync } from "fs";

const DATA_FILE = "data/data.json";

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation?: string;
}

const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));

let total = 0;
let withExp = 0;
let withoutExp = 0;

for (const subject of data.subjects) {
  for (const chapter of subject.chapters) {
    for (const set of chapter.sets) {
      for (const q of set.questions) {
        total++;
        if (q.explanation && q.explanation.trim().length >= 10) {
          withExp++;
        } else {
          withoutExp++;
        }
      }
    }
  }
}

console.log(`Total: ${total} | With explanations: ${withExp} | Without: ${withoutExp}`);
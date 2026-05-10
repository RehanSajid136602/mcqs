import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

const API_KEY = process.env.NVIDIA_API_KEY;

if (!API_KEY) {
  console.error("FATAL: NVIDIA_API_KEY is not set.");
  console.error("Copy .env.local.example to .env.local and add your NVIDIA API key.");
  process.exit(1);
}

const DATA_FILE = "data/data.json";
const CONTENT_BASE = process.env.CONTENT_DIR ?? "/home/rehan/Documents/test";
const RATE_LIMIT_MS = 1500;
const TIMEOUT_MS = 15000;
const RETRY_DELAY_MS = 10000;
const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: API_KEY,
});

const SUBJECT_DIR_MAP = {
  Physics: "Physics",
  Mathematics: "Math",
  English: "English",
  Computer: "Computer",
  "Computer Science": "Computer",
  "Mark Studies": "MarkStudies",
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function timeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("TIMEOUT")), ms);
    promise.then(v => { clearTimeout(timer); resolve(v); }).catch(e => { clearTimeout(timer); reject(e); });
  });
}

function getChapterContent(subjectName, chapterName) {
  const dir = SUBJECT_DIR_MAP[subjectName];
  if (!dir) return null;
  const num = chapterName.match(/Chapter\s*(\d+)/i)?.[1]?.padStart(2, "0");
  if (!num) return null;
  try {
    const allFiles = readdirSync(join(CONTENT_BASE, dir));
    const match = allFiles.find(f => f.startsWith(`Chapter-${num}-`) && f.endsWith(".md"));
    if (!match) return null;
    return readFileSync(join(CONTENT_BASE, dir, match), "utf-8").slice(0, 4000);
  } catch {
    return null;
  }
}

async function generateExplanation(question, chapterName, chapterContent) {
  const systemPrompt = `You are an expert FBISE HSSC-2 teacher explaining MCQs to students.
Write 2-3 short, clear sentences explaining why the correct answer is right.
- Write in simple, easy-to-understand English
- Cover the main reason clearly
- Do NOT repeat the question or answer choices
- Keep it concise — no extra words
- Output ONLY the explanation text, nothing else`;

  const userPrompt = `Chapter: ${chapterName}
Question: ${question.q}
Options: ${question.options.join(", ")}
Correct Answer: ${question.options[question.correct]}${chapterContent ? "\n\nChapter Content:\n" + chapterContent : ""}`;

  try {
    const response = await timeout(
      client.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
      TIMEOUT_MS
    );
    const text = response.choices[0]?.message?.content?.trim() ?? "";
    return text || null;
  } catch (e) {
    const msg = e.message || "";
    if (msg.includes("404") || msg.includes("TIMEOUT") || msg.includes("timeout") || msg.includes("429")) {
      console.log(`    ⚠  Error: ${e.message} — waiting ${RETRY_DELAY_MS / 1000}s...`);
      await sleep(RETRY_DELAY_MS);
      return null;
    }
    return null;
  }
}

async function main() {
  const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  console.log("MCQ Explanation Generator");
  console.log("─────────────────────────────────\n");

  for (const subject of data.subjects) {
    console.log(`\n${subject.name}`);
    console.log("─────────────────────────────────");

    for (const chapter of subject.chapters) {
      const chapterContent = getChapterContent(subject.name, chapter.name);
      const hasContent = chapterContent ? " [content loaded]" : "";
      console.log(`  ${chapter.name}${hasContent}`);

      for (const set of chapter.sets) {
        for (let i = 0; i < set.questions.length; i++) {
          const q = set.questions[i];

          if (q.explanation && q.explanation.trim().length >= 10) {
            skipped++;
            console.log(`    [OK] "${q.q.slice(0, 40)}..."`);
            continue;
          }

          let attempt = 0;
          let explanation = null;

          while (attempt < 3 && !explanation) {
            attempt++;
            if (attempt > 1) console.log(`    [RETRY ${attempt - 1}]...`);

            explanation = await generateExplanation(q, chapter.name, chapterContent);

            if (!explanation) {
              if (attempt < 3) await sleep(RETRY_DELAY_MS);
              else {
                console.log(`    [FAIL] "${q.q.slice(0, 35)}..."`);
                failed++;
              }
            }
          }

          if (explanation) {
            q.explanation = explanation;
            updated++;
            console.log(`    ${explanation}`);
            writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
          }

          await sleep(RATE_LIMIT_MS);
        }
      }
    }
  }

  console.log("\n─────────────────────────────────");
  console.log("DONE!");
  console.log("   Updated: " + updated);
  console.log("   Skipped: " + skipped);
  console.log("   Failed: " + failed);
  console.log("─────────────────────────────────\n");
}

main().catch(e => { console.error("Fatal error:", e.message); process.exit(1); });

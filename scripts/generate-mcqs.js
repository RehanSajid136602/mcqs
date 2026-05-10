// CAVEMAN: read only relevant function.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { glob } from "glob";
import OpenAI from "openai";

const CONTENT_DIR = process.env.CONTENT_DIR ?? "/home/rehan/Documents/test";
const OUTPUT_FILE = "data/data.json";
const SAMPLE_FILE = "data/data.sample.json";

const SUBJECT_MAP: Record<string, { name: string; icon: string; dir: string }> = {
  Physics: { name: "Physics", icon: "Atom", dir: "Physics" },
  Maths: { name: "Maths", icon: "Calculator", dir: "Maths" },
  English: { name: "English", icon: "BookOpen", dir: "English" },
  Computer: { name: "Computer Science", icon: "Cpu", dir: "Computer" },
  "Mark Studies": { name: "Mark Studies", icon: "BarChart3", dir: "MarkStudies" },
};

function countWords(text: string): number {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$[^$]+\$/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_~`]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateSet(
  client: OpenAI,
  chapterName: string,
  content: string,
  setNum: number,
  totalSets: number,
  isPhysMaths: boolean
): Promise<{ questions: any[] } | null> {
  const numQuestions = content.length < 3000 ? 10 : 12;
  const isHard = isPhysMaths ? " (Include some numerical/memory-based MCQs.)" : "";

  const systemPrompt = `You are an expert Pakistani curriculum specialist for FBISE HSSC-2 (Class 12) board exams.
Given the following chapter content, generate MCQ Set ${setNum} of ${totalSets} for this chapter.
Rules:
- Generate exactly ${numQuestions} MCQs (${numQuestions} questions)
- Focus on the most frequently tested FBISE board exam concepts
- 4 options per question (no A/B/C/D labels, just plain strings)
- Vary difficulty: 40% easy, 40% medium, 20% hard${isHard}
- For Math/Physics: include numerical MCQs with LaTeX using $...$ syntax
- Do NOT repeat questions from previous sets in this chapter
- Return ONLY valid JSON, no markdown fences
- For each question, include a concise explanation (1-3 sentences) explaining WHY the correct answer is right
- Use $...$ LaTeX syntax in explanations for any math formulas
- Write explanations like a teacher helping a student understand the concept (teaching tone, not just restating facts)

Output format (strict):
{"questions":[{"q":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."}]}

"correct" is zero-based index of correct option.`;

  const userPrompt = `Chapter: ${chapterName}\n\nContent:\n${content.slice(0, 8000)}`;

  try {
    const response = await client.chat.completions.create({
      model: "qwen/qwen3-235b-a22b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (e) {
    console.error(`    [ERROR] Set ${setNum} failed: ${e.message}`);
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  mkdirSync("data", { recursive: true });

  let existingData: any = { subjects: [] };
  if (existsSync(OUTPUT_FILE)) {
    try {
      existingData = JSON.parse(readFileSync(OUTPUT_FILE, "utf-8"));
      console.log("[LOADED] Existing data — incremental mode enabled");
    } catch {
      existingData = { subjects: [] };
    }
  }

  if (!process.env.NVIDIA_API_KEY) {
    console.error("FATAL: NVIDIA_API_KEY environment variable is not set.");
    console.error("Copy .env.local.example to .env.local and add your NVIDIA API key.");
    process.exit(1);
  }

  const client = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.NVIDIA_API_KEY,
  });

  const subjectDirs = Object.entries(SUBJECT_MAP);

  for (const [dirName, meta] of subjectDirs) {
    const subjectId = slugify(meta.name);
    const subjectDir = join(CONTENT_DIR, meta.dir);
    const files = glob.sync("Chapter-*.md", { cwd: subjectDir, absolute: true });

    let subjectData = existingData.subjects.find((s: any) => s.id === subjectId) ?? {
      id: subjectId,
      name: meta.name,
      icon: meta.icon,
      chapters: [],
    };

    const existingChapterIds = new Set(subjectData.chapters.map((c: any) => c.id));

    for (const filePath of files) {
      const fileName = basename(filePath, ".md");
      const chapterMatch = fileName.match(/Chapter-(\d+)-(.+)/);
      if (!chapterMatch) continue;

      const chapterNum = chapterMatch[1];
      const chapterTitle = chapterMatch[2].replace(/-/g, " ");
      const chapterId = `chapter-${chapterNum}-${slugify(chapterTitle)}`;

      const rawContent = readFileSync(filePath, "utf-8");
      const wordCount = countWords(rawContent);

      let numSets = 3;
      if (wordCount > 6000) numSets = 5;
      else if (wordCount >= 3000) numSets = 4;
      if (meta.name === "Physics" || meta.name === "Maths") numSets += 1;

      const isPhysMaths = meta.name === "Physics" || meta.name === "Maths";

      let chapterData = subjectData.chapters.find((c: any) => c.id === chapterId);
      if (!chapterData) {
        chapterData = { id: chapterId, name: `Chapter ${chapterNum}: ${chapterTitle}`, sets: [] };
        subjectData.chapters.push(chapterData);
      }

      const existingSetIds = new Set(chapterData.sets.map((s: any) => s.id));

      for (let setNum = 1; setNum <= numSets; setNum++) {
        const setId = `${chapterId}-set-${setNum}`;
        if (existingSetIds.has(setId)) {
          console.log(`  [SKIP] ${chapterId} set ${setNum} already exists`);
          continue;
        }

        console.log(`[${meta.name}] ${chapterData.name} — Generating set ${setNum}/${numSets}...`);

        let result = await generateSet(client, chapterData.name, rawContent, setNum, numSets, isPhysMaths);

        if (!result) {
          console.log(`  [RETRY] Retrying set ${setNum}...`);
          await sleep(1500);
          result = await generateSet(client, chapterData.name, rawContent, setNum, numSets, isPhysMaths);
        }

        if (!result || !result.questions || result.questions.length === 0) {
          console.log(`  [SKIP] Set ${setNum} failed after retry — skipping`);
          continue;
        }

        const validatedQuestions = result.questions.map((q: any, idx: number) => {
          if (!q.explanation || q.explanation.trim().length < 10) {
            console.log(`  [WARN] Question ${idx + 1} missing valid explanation — generating fallback`);
            return {
              ...q,
              explanation: `The correct answer is "${q.options[q.correct]}" because it is the most accurate option based on the chapter content. Review the relevant section for detailed reasoning.`
            };
          }
          return q;
        });

        chapterData.sets.push({
          id: setId,
          label: `Set ${setNum}`,
          questions: validatedQuestions,
        });

        await sleep(1500);
      }

      subjectData.chapters.sort(
        (a: any, b: any) =>
          parseInt(a.id.match(/chapter-(\d+)/)?.[1] ?? "0") -
          parseInt(b.id.match(/chapter-(\d+)/)?.[1] ?? "0")
      );
    }

    const idx = existingData.subjects.findIndex((s: any) => s.id === subjectId);
    if (idx >= 0) existingData.subjects[idx] = subjectData;
    else existingData.subjects.push(subjectData);

    writeFileSync(OUTPUT_FILE, JSON.stringify(existingData, null, 2));
    console.log(`[SAVED] ${meta.name} data updated\n`);
  }

  const sample = {
    subjects: existingData.subjects.slice(0, 2).map((s: any) => ({
      ...s,
      chapters: s.chapters.slice(0, 2).map((c: any) => ({
        ...c,
        sets: c.sets.slice(0, 1).map((st: any) => ({
          ...st,
          questions: st.questions.slice(0, 2),
        })),
      })),
    })),
  };
  writeFileSync(SAMPLE_FILE, JSON.stringify(sample, null, 2));
  console.log("[DONE] data/data.json + data/data.sample.json written");
}

main().catch(console.error);
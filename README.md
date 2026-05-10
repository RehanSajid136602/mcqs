# MCQ Master — HSSC-2 Practice Platform

A Next.js 14 app for practicing Pakistan FBISE HSSC-2 (Class 12) MCQ exams with LaTeX math rendering, shuffled questions/options, and local progress tracking.

## Setup

```bash
# 1. Add your NVIDIA API key
cp .env.local.example .env.local
# Edit .env.local → add NVIDIA_NIM_API_KEY

# 2. Install deps
npm install

# 3. Generate MCQs (optional — data/data.json already has sample data)
node scripts/generate-mcqs.js

# 4. Start
npm run dev
```

## Structure

```
mcq-platform/
├── data/
│   ├── data.json      ← Full generated MCQ data
│   └── data.sample.json  ← Minimal sample for dev
├── scripts/
│   └── generate-mcqs.js  ← NIM API MCQ generator
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Home: subject grid
│   │   ├── subject/[subjectName]/page.tsx   ← Chapter list
│   │   ├── quiz/[quizId]/page.tsx            ← Quiz page
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Quiz.tsx        ← Interactive quiz (shuffle, feedback, results)
│   │   └── KatexRenderer.tsx  ← $...$ LaTeX renderer
│   ├── hooks/
│   │   └── useProgress.ts  ← localStorage progress
│   ├── lib/
│   │   └── data.ts         ← getAllSubjects, getSet, etc.
│   └── types/
│       └── index.ts
└── package.json
```

## MCQ Generation (NVIDIA NIM)

`npm run generate` reads chapter Markdown files from `/home/rehan/Documents/test/{Physics,Maths,English,...}/`, calls NVIDIA NIM (`qwen/qwen3-235b-a22b`), and outputs `data/data.json`.

Sets per chapter:
- Word count < 3000 → 3 sets
- Word count 3000–6000 → 4 sets
- Word count > 6000 → 5 sets
- Physics/Maths → +1 extra set

Each set: 12 questions (10 if short), 4 options, 40% easy / 40% medium / 20% hard. Incremental — skips chapters whose sets already exist.
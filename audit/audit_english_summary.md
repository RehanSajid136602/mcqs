# English MCQ Audit Report — FBISE HSSC-2

## Overview
- **Subject**: English
- **Total Questions**: 372
- **Chapters**: 15
- **Sets**: 31
- **Total Flagged**: 17

## Verdict Breakdown
- **WRONG_EXPLANATION**: 17 (100.0%)

## Chapter Analysis
- **Rubayiat of Omar Khayyam**: 6 flags / 24 questions
  - WRONG_EXPLANATION: 6
- **Chapter 01: Lingkuan Gorge**: 5 flags / 36 questions
  - WRONG_EXPLANATION: 5
- **The Income-Tax Man**: 4 flags / 24 questions
  - WRONG_EXPLANATION: 4
- **Population Explosion in Pakistan**: 2 flags / 24 questions
  - WRONG_EXPLANATION: 2

## Pattern Analysis

### 1. Placeholder Explanations (WRONG_EXPLANATION)
Many questions contain placeholder explanations like "Here is the explanation text for the correct answer:" 
followed by truncated content. This suggests questions were generated with incomplete explanation fields.

**Affected chapters**: Chapter 01: Lingkuan Gorge, The Income-Tax Man, Rubayiat of Omar Khayyam

### 2. LaTeX in English (UNEXPECTED_LATEX)
English MCQs should not contain mathematical LaTeX notation. Any equations ($...$) or math symbols 
should be replaced with plain text descriptions.

**Note**: Currency symbols ($2,000, $200,000) are acceptable in English as they represent monetary 
values in prose context.

### 3. Ambiguous Grammar Questions (AMBIGUOUS)
Questions phrased as "which of the following is NOT..." require careful answer-key validation 
to ensure only one option is definitively correct while others are clearly wrong.

### 4. Duplicate Questions (DUPLICATE)
Cross-set duplicate detection identifies questions that appear in multiple sets, which may 
indicate intentional repetition for testing or accidental duplication.

## Recommendations
1. **Replace all placeholder explanations** with accurate, text-based explanations citing 
   specific passages or grammar rules from the source material.
2. **Remove LaTeX math notation** from English questions — use plain text descriptions instead.
3. **Review "NOT/EXCEPT" questions** for genuine single-correct-answer defensibility.
4. **Validate duplicate questions** — confirm intentional repetition or merge/modify duplicates.

# Coding Lab Enrichment Plan

## Overview

The coding lab (`src/lib/coding-data.ts`) has 4 topics with 17 examples and 20 practice questions. Explanations are thin (1-2 sentences). SQL is critically under-explained — zero solution comments, incomplete syntax reference, descriptions with no technical substance. Only 1 file changes; everything is data-only.

---

## Changes (1 file)

`src/lib/coding-data.ts` — descriptions, syntax refs, example explanations, question solutions, 1 expectedOutput bug fix.

---

## Step 1 — Fix Bug

Dict example 4 expectedOutput is wrong:
- Current: `"{0: 0, 1: 1, 4: 4, 9: 9, 16: 16}"`
- Correct: `"{0: 0, 1: 1, 2: 4, 3: 9, 4: 16}"`

---

## Step 2 — Expand Topic Overviews

All 4 `description` + `importance` fields. Target: 3-4 sentences each.

**Lists**: mutability, contrast with tuples, use cases, dynamic array under the hood.
**Tuples**: immutability as feature (thread safety, hashable → dict keys), unpacking is everywhere.
**Dicts**: hash table, O(1), insertion order (3.7+), key must be hashable.
**SQL (biggest rewrite)**: what a relational DB is, CRUD, SQLite, used in every web backend.

---

## Step 3 — Expand Example Explanations

All 17 `explanation` fields. Target: 4-6 sentences each walking through code line by line.

| Topic | Examples | Key points to add |
|-------|----------|-------------------|
| Lists 1 | Creating/Accessing | slice semantics (inclusive/exclusive), step param, slice creates new list |
| Lists 2 | Modifying | append vs extend, insert shifts, pop returns, remove throws ValueError |
| Lists 3 | Operations | sort() returns None vs sorted(), index() throws if missing |
| Lists 4 | Comprehension | full syntax breakdown, why faster, nested comprehension explained |
| Tuples 1 | Creating/Accessing | single-element comma rule `(42,)`, immutability |
| Tuples 2 | Unpacking | `*` for rest, swap trick mechanism, for-loop unpacking |
| Tuples 3 | Nested Tuples | multi-index access, `_` convention, nested unpacking pattern |
| Tuples 4 | Methods | why only 2, index() throws if missing |
| Dicts 1 | Accessing | bracket vs get(), view objects (need list() wrapper), key rules |
| Dicts 2 | Modifying | overwrite vs add, update() merge behavior, pop returns value |
| Dicts 3 | Iterating | keys() vs values() vs items(), insertion order |
| Dicts 4 | Comprehension | full syntax, filtering condition |
| SQL 1 | CREATE TABLE | data types, constraints (PK, NOT NULL, CHECK, DEFAULT) |
| SQL 2 | INSERT | column-list vs no-list, multi-row, auto-increment |
| SQL 3 | SELECT | WHERE operators, AND/OR, ORDER BY ASC/DESC, execution order |
| SQL 4 | UPDATE/DELETE | danger of no WHERE, verify with SELECT first |
| SQL 5 | Aggregates | COUNT/AVG/SUM/MIN/MAX, GROUP BY vs HAVING distinction |

---

## Step 4 — Add Inline Comments to Solutions

11 of 20 question solutions need comments added or expanded. All 5 SQL solutions are bare.

| Topic | Q# | What to add |
|-------|----|-------------|
| Lists | Q3 | Step through comprehension: `for m in marks`, `if m > 75` |
| Lists | Q5 | Explain `len(w) > 4` filtering |
| Tuples | Q2 | Trace unpacking with values |
| Dicts | Q3 | Trace loop iterations (key, value, total) |
| Dicts | Q4 | Explain `{word: len(word)}` syntax |
| Dicts | Q5 | Explain `.items()` + filter + comprehension |
| SQL Q1 | Explain each column's type and constraint |
| SQL Q2 | Explain VALUES, column list, multiple rows |
| SQL Q3 | Explain WHERE > 600, ORDER BY DESC |
| SQL Q4 | Explain SET + WHERE, why WHERE is critical |
| SQL Q5 | Explain GROUP BY, COUNT(*), AS aliasing |

---

## Step 5 — Complete Syntax References

All 4 `syntax` fields. SQL needs full rewrite (currently only CREATE/INSERT).

**Lists**: append, insert, remove, pop, sort/sorted, slicing with step, comprehension template.
**Tuples**: unpacking, `*` rest operator, `tuple()` constructor.
**Dicts**: get(), update(), pop(), items() iteration, comprehension template.
**SQL**: CREATE TABLE, INSERT (single + multi-row), SELECT + WHERE + ORDER BY, UPDATE + WHERE, DELETE + WHERE, GROUP BY + HAVING + aggregates.

---

## Step 6 — Verify

```bash
npx tsc --noEmit && npm run build
```

Data-only changes — no component modifications, build should pass.

---

## Not Changing

- `TopicPage.tsx`, `CodeBlock.tsx`, routing, interfaces, topic count.

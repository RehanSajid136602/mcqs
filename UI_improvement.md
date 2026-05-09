# UI Redesign Plan — MCQ Master Dashboard

> **Version**: 1.0  
> **Target**: Next.js 16 (Turbopack), TypeScript, Tailwind v4, Framer Motion  
> **Constraint**: No backend changes. Touch only `.tsx` components, `globals.css`, Tailwind classes.  
> **Reference**: Dark dashboard aesthetic — deep charcoal background, bold typography, red/coral + gold accents, card-based layout.

---

## Pre-Flight Design Plan

### Python RNG Execution (Deterministic Seed: 142)
```
Seed: 142 (prompt char count mod 7)
random.seed(142)
hero_layout = random.choice(["cinematic_center", "editorial_split", "artistic_asymmetry"])
# -> "cinematic_center"

typography = random.choice(["Satoshi", "Cabinet Grotesk", "Outfit", "Geist"])
# -> "Geist" (closest match: DM Sans for body, Playfair for display — both existing)

components = random.sample(["inline_typography", "horizontal_accordion", "marquee", "testimonial"], 3)
# -> ["horizontal_accordion", "marquee", "inline_typography"]

gsap = random.sample(["scroll_pin", "scale_fade", "scrub_text", "card_stack"], 2)
# -> ["scale_fade", "card_stack"] (adapted for Framer Motion)
```

### AIDA Check
| Phase | Implementation |
|-------|---------------|
| **Attention** | Hero dashboard header on Home with large stat numbers, cinematic center layout |
| **Interest** | Subject bento grid with hover physics, progress rings, and stat cards |
| **Desire** | Scroll-triggered card stacking, staggered reveals on quiz/review pages |
| **Action** | Prominent "Start Quiz" / "Coding Lab" CTAs with gold-accent styling |

### Hero Math Verification
- H1 container: `max-w-5xl` with `text-5xl sm:text-7xl` font size
- "MCQ Master" = 2 words, guaranteed single line on all breakpoints
- Subtitle: "HSSC-2 Board Exam Practice" — 1 line on all breakpoints
- NO stamp icons, pill tags, or stats in hero

### Bento Density Verification
- Home subject grid: 3 columns on lg, 2 on md, 1 on sm
- 4 subjects + 1 Coding Lab card = 5 items
- Row 1: [Physics col=1, Maths col=1, English col=1] → 3 cells
- Row 2: [Computer Science col=2, Coding Lab col=1] → 3 cells
- 3x2 grid = 6 cells total. All 6 filled. `grid-auto-flow: dense` applied. ZERO empty cells.

### Label Sweep & Button Check
- BANNED: "QUESTION 05", "SECTION 01", "ABOUT US" — ZERO instances in new design
- All buttons: dark bg = white/light text, accent bg = dark text. Contrast > 4.5:1

---

## Design System

### Color Tokens

```
/* Replace in globals.css */
--bg:            #0c0c0e;       /* Deep charcoal base */
--bg-surface:    #161618;       /* Slightly elevated surface */
--bg-card:       #1c1c1e;       /* Card background */
--bg-card-hover: #252528;       /* Card hover state */
--text-primary:  #f5f5f7;       /* Primary white text */
--text-secondary:#8e8e93;       /* Dimmed secondary text */
--text-muted:    #636366;       /* Muted tertiary */
--accent-coral:  #ff6b6b;       /* Red/coral accent */
--accent-gold:   #f5c518;       /* Gold accent (preserved) */
--accent-gold-dim: rgba(245, 197, 24, 0.12);
--success:       #30d158;
--error:         #ff453a;
--warning:       #ff9f0a;
--border:        rgba(255, 255, 255, 0.08);
--border-hover:  rgba(255, 255, 255, 0.14);
--glow-coral:    rgba(255, 107, 107, 0.18);
--glow-gold:     rgba(245, 197, 24, 0.15);
```

### Typography Scale

| Token | Use | Tailwind Pattern |
|-------|-----|------------------|
| Display | Page hero titles | `text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight` |
| H1 | Section headers | `text-3xl sm:text-4xl font-display font-bold tracking-tight` |
| H2 | Card titles | `text-xl sm:text-2xl font-display font-semibold` |
| H3 | Subsection labels | `text-lg font-sans font-semibold` |
| Body L | Primary content | `text-base font-sans leading-relaxed` |
| Body S | Secondary / metadata | `text-sm font-sans` |
| Caption | Badges, labels | `text-xs font-sans font-medium tracking-wider uppercase` |
| Mono | Stats, numbers | `font-mono tabular-nums` |

**Font stack**: `var(--font-playfair)` for display/headings, `var(--font-dm-sans)` for body (already in layout.tsx).

### Spacing System

| Token | Value | Use |
|-------|-------|-----|
| Page padding X | `px-4 sm:px-6 lg:px-8` | Consistent horizontal page padding |
| Section gap | `py-16 sm:py-20 lg:py-24` | Between major sections |
| Card padding | `p-5 sm:p-6 lg:p-8` | Standard card interior |
| Grid gap | `gap-4 sm:gap-5 lg:gap-6` | Card grid gutters |
| Content gap | `space-y-4` inside sections, `space-y-3` inside cards | Vertical rhythm |

### Card Styles (Design Tokens)

```
.card-base:    bg-[--bg-card] border border-[--border] rounded-2xl
.card-hover:   hover:border-[--border-hover] hover:bg-[--bg-card-hover] transition-all duration-300
.card-glow:    card-base + shadow-[0_0_30px_var(--glow-coral)] on hover
.card-accent:  card-base + border-l-[3px] border-l-[--accent-coral]
```

### Gradient & Effect Tokens

```
.gradient-hero:   radial-gradient(ellipse at 50% 0%, rgba(255,107,107,0.08) 0%, transparent 70%)
.gradient-card:   linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface) 100%)
.glass:           bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]
```

---

## Page-by-Page Redesign Plan

### 1. HomeClient (`src/components/HomeClient.tsx`)

**Current**: Subject grid (2-3 cols), gold accent cards, chapter chips, Coding Lab CTA below.

**Target Layout**:
```
┌──────────────────────────────────────────────────────┐
│              MCQ MASTER                               │
│        Pakistani HSSC-2 Practice                      │
│                                                       │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│   │   158    │  │   Phys   │  │    3     │          │
│   │   Total  │  │ Active   │  │ Subjects │          │
│   │ Attempts │  │  Streak  │  │ Completed│          │
│   └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ PHYSICS      │ │ MATHS        │ │ ENGLISH      │  │
│  │ 15 Chapters  │ │ 16 Chapters  │ │ 10 Chapters  │  │
│  │ ████████░░  │ │ ████░░░░░░  │ │ ██████████░  │  │
│  │ 78% · 5 att │ │ 62% · 2 att │ │ 91% · 7 att │  │
│  └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │  CODING LAB                              →   │    │
│  │  Python & SQL practice for CS students       │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

**Changes**:
- Hero stats row with 3 StatCards above subject grid
- Subject cards get ProgressBar + percentage + attempt count inline
- Coding Lab becomes full-width horizontal CTA banner
- Card-glow style with coral left-border on cards with progress
- Staggered Framer Motion entrance per card (staggerChildren: 0.08)
- Chapter chips become GlowBadge components (emerald if done, muted if not)

**New components used**: `StatCard`, `ProgressBar`, `GlowBadge`

---

### 2. SubjectClient (`src/components/SubjectClient.tsx`)

**Current**: Chapter list with expandable sets, back button, recent activity chips.

**Target Layout**:
```
┌──────────────────────────────────────────────────────┐
│ ← Back to Subjects                                    │
│                                                       │
│ PHYSICS                                               │
│ ┌────────────────────────────────────────────────┐    │
│ │ {recent activity chips — coral/gold gradient}  │    │
│ └────────────────────────────────────────────────┘    │
│                                                       │
│ ┌────────────────────────────────────────────────┐    │
│ │ 15   Gravitation                     ▾ 4 sets  │    │
│ │      ████████████░░░░  72% Best                │    │
│ │      ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │    │
│ │      │Set 1 │ │Set 2 │ │Set 3 │ │Set 4 │      │    │
│ │      │ ★85%│ │ ☆ 0%│ │ ☆ 0%│ │ ☆ 0%│      │    │
│ │      └──────┘ └──────┘ └──────┘ └──────┘      │    │
│ └────────────────────────────────────────────────┘    │
│                                                       │
│ ┌────────────────────────────────────────────────┐    │
│ │ 16   Waves                           ▸ 3 sets  │    │
│ └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

**Changes**:
- Subject title becomes large display header with icon
- Chapter cards: number badge on left (large, bold mono), chapter name, inline stats
- Recent activity chips become GlowBadge pills with coral/gold gradient based on score
- Set cards get miniature ProgressRing or star icon
- Refined expand/collapse animation timing
- Consistent card-styling from design system

**New components used**: `ProgressRing`, `GlowBadge`, `SectionHeader`

---

### 3. Quiz + Results (`src/components/Quiz.tsx`)

**Current**: Progress bar, question card with shuffled options, explanation toggle, results screen.

**Target (Quiz)**:
```
┌──────────────────────────────────────────────────────┐
│ ← Back     Question 7 of 12            ██████░░ 58%  │
│                                                       │
│ ┌────────────────────────────────────────────────┐    │
│ │  What is the gravitational force between two    │    │
│ │  masses of 5kg and 10kg separated by 2m?        │    │
│ │  (G = 6.67 x 10^-11 N.m^2/kg^2)                 │    │
│ └────────────────────────────────────────────────┘    │
│                                                       │
│  ○  8.34 x 10^-10 N                                   │
│  ●  8.34 x 10^-9 N   (selected - correct!)           │
│  ○  1.67 x 10^-9 N                                    │
│  ○  1.67 x 10^-10 N                                   │
│                                                       │
│  [Explanation toggle - gold accent border-left]       │
│                                                       │
│                                    [Next Question →]  │
└──────────────────────────────────────────────────────┘
```

**Target (Results)**:
```
┌──────────────────────────────────────────────────────┐
│              ┌──────────────┐                         │
│              │              │                         │
│              │    85%       │  ProgressRing            │
│              │              │                         │
│              └──────────────┘                         │
│               10/12  Excellent!                       │
│         [Review Answers]   [Retake]   [Back]          │
└──────────────────────────────────────────────────────┘
```

**Changes**:
- ProgressBar with coral-to-gold gradient + percentage label
- Question card wrapped in GlassCard style
- Option buttons: larger, clearer hover/selected/disabled states
- Correct: emerald glow border + check. Incorrect: coral glow + X, correct subtle highlight
- Results screen: ProgressRing replaces text score, count-up animation
- "Next" and "See Results" buttons get coral accent styling

**New components used**: `ProgressBar`, `ProgressRing`, `GlassCard`, `GlowBadge`

---

### 4. ReviewClient (`src/app/review/[attemptId]/ReviewClient.tsx`)

**Current**: Summary header + list of questions with correct/incorrect indicators.

**Target Layout**:
```
┌──────────────────────────────────────────────────────┐
│ ← Back                                                 │
│                                                       │
│ ┌────────────────────────────────────────────────┐    │
│ │          ╭──────────────╮                       │    │
│ │ REVIEW   │     85%      │  Jan 15, 2026         │    │
│ │          ╰──────────────╯  4m 32s . 10/12       │    │
│ └────────────────────────────────────────────────┘    │
│                                                       │
│ ┌──── ✓ ────────────────────────────────────────┐    │
│ │ #1  What is Newton's second law?              │    │
│ │     [options displayed with correct marked]    │    │
│ │     [Explanation card]                         │    │
│ └────────────────────────────────────────────────┘    │
│                                                       │
│ ┌──── ✗ ────────────────────────────────────────┐    │
│ │ #2  What is the SI unit of pressure?           │    │
│ │     [options with yours/incorrect marked]       │    │
│ │     [Explanation card]                         │    │
│ └────────────────────────────────────────────────┘    │
│                                                       │
│                    [Retake This Set]                  │
└──────────────────────────────────────────────────────┘
```

**Changes**:
- Summary header: ProgressRing integrated, metadata arranged cleanly
- Question cards: emerald left-border for correct, coral for incorrect
- Question # becomes circular badge (emerald fill for correct, coral for incorrect)
- Options get mini card styling, GlowBadge markers ("Correct" / "Your pick")
- Staggered entrance animation per question card
- "Retake This Set" button with coral accent

**New components used**: `ProgressRing`, `GlowBadge`, `GlassCard`

---

### 5. Coding Hub (`src/app/coding/page.tsx`)

**Current**: Topic grid (2 cols), gradient cards, back-to-home link at bottom.

**Target Layout**:
```
┌──────────────────────────────────────────────────────┐
│         [HSSC-II Computer Science]                    │
│              CODING LAB                               │
│    Python & Database practice for board exams         │
│                                                       │
│  ┌───────────────────┐  ┌───────────────────┐        │
│  │ Python Lists      │  │ Python Tuples     │        │
│  │ Ordered, Mutable  │  │ Immutable Seq's   │        │
│  │ 5 Examples·5 Q's  │  │ 4 Examples·5 Q's  │        │
│  │    Start --->     │  │    Start --->     │        │
│  └───────────────────┘  └───────────────────┘        │
│  ┌───────────────────┐  ┌───────────────────┐        │
│  │ Dictionaries      │  │ SQL Queries       │        │
│  │ Key-Value Store   │  │ Database Ops       │        │
│  │ 4 Examples·5 Q's  │  │ 5 Examples·5 Q's  │        │
│  │    Start --->     │  │    Start --->     │        │
│  └───────────────────┘  └───────────────────┘        │
│                                                       │
│                  Back to Home                         │
└──────────────────────────────────────────────────────┘
```

**Changes**:
- SectionHeader hero with pill badge and title
- Topic cards: dark card, coral top accent stripe, GlowBadge for counts, hover scale
- "Back to Home" refined nav styling

**New components used**: `SectionHeader`, `GlowBadge`

---

### 6. Topic Page (`src/components/coding/TopicPage.tsx`)

**Current**: Syntax, examples, practice questions with hint/solution toggles.

**Target Layout**:
```
┌──────────────────────────────────────────────────────┐
│ ← Coding Lab                           ← Home         │
│                                                       │
│ [HSSC-II CS]  PYTHON LISTS                            │
│ Ordered, Mutable Collections                          │
│                                                       │
│ ┌─ Overview ─────────────────────────────────────┐    │
│ │ [description + importance callout]              │    │
│ └─────────────────────────────────────────────────┘    │
│                                                       │
│ SYNTAX REFERENCE                                      │
│ ┌─ [code block — terminal aesthetic] ────────────┐    │
│ └─────────────────────────────────────────────────┘    │
│                                                       │
│ EXAMPLES                                              │
│ ┌─ Example Title ────────────────────────────────┐    │
│ │ [code block]                                    │    │
│ │ [expected output]                               │    │
│ │ [explanation — collapsible]                     │    │
│ └─────────────────────────────────────────────────┘    │
│                                                       │
│ PRACTICE QUESTIONS                                    │
│ ┌─ 1. Question Title ────────────────────────────┐    │
│ │ [question text + code]                          │    │
│ │ [Show Hint]  [Show Solution]                    │    │
│ └─────────────────────────────────────────────────┘    │
│                                                       │
│      Back to all topics    |    Home                  │
└──────────────────────────────────────────────────────┘
```

**Changes**:
- Dual navigation at top (Coding Lab + Home)
- Overview/syntax/example/question cards: consistent design system
- CodeBlock: dark terminal aesthetic (`bg-[#0d1117]`), line numbers, language badge
- Hint/solution toggle buttons with coral/gold accents
- Refined bottom nav section

**New components used**: `SectionHeader`, `GlowBadge`

---

## Shared Components to Create

### 1. ProgressRing (`src/components/ui/ProgressRing.tsx`)
- SVG circle with animated stroke-dashoffset via Framer Motion
- Props: percentage (0-100), size (sm/md/lg), variant (coral/gold/gradient)
- States: loading skeleton, animated complete, static
- Used in: HomeClient, SubjectClient set cards, Quiz results, ReviewClient header

### 2. ProgressBar (`src/components/ui/ProgressBar.tsx`)
- Horizontal bar with gradient fill
- Props: value (0-100), variant (coral/gold/gradient), showLabel, size (sm/lg)
- Width transition on mount/update
- Used in: HomeClient, Quiz tracker, SubjectClient chapter cards

### 3. StatCard (`src/components/ui/StatCard.tsx`)
- Icon top-left, large mono value, caption label, trend arrow
- Props: label, value, icon (LucideIcon), trend (up/down/neutral), accent (coral/gold)
- Number count-up on mount
- Used in: HomeClient dashboard hero

### 4. GlowBadge (`src/components/ui/GlowBadge.tsx`)
- Pill-shaped badge with colored bg tint + matching border + subtle glow shadow
- Props: children, variant (coral/gold/emerald/neutral), size (sm/md)
- Used in: HomeClient chapter chips, SubjectClient recent attempts, Quiz markers, ReviewClient indicators, Coding topic counts

### 5. GlassCard (`src/components/ui/GlassCard.tsx`)
- bg-white/[0.03] backdrop-blur-xl border-white/[0.06] rounded-2xl
- Props: as (button/div/Link), href, onClick, className, children
- Hover: border brightening + subtle scale
- Used in: Quiz question card, ReviewClient cards, Coding topic cards

### 6. SectionHeader (`src/components/ui/SectionHeader.tsx`)
- Large display title + dimmed subtitle
- Props: title, subtitle, alignment (left/center)
- Used on: Every page for consistent section demarcation

---

## Implementation Order

### Wave 0: Foundation
**Blocks: Everything. Completes first.**

- [ ] T0.1 — Update `globals.css`: Replace CSS custom properties with dashboard palette
- [ ] T0.2 — Create `ProgressRing` component
- [ ] T0.3 — Create `ProgressBar` component
- [ ] T0.4 — Create `StatCard` component
- [ ] T0.5 — Create `GlowBadge` component
- [ ] T0.6 — Create `GlassCard` component
- [ ] T0.7 — Create `SectionHeader` component

### Wave 1: Home + Subjects
**Depends on: Wave 0. All tasks parallel within wave.**

- [ ] T1.1 — Redesign `HomeClient.tsx`: Hero stats + subject grid + Coding Lab banner
- [ ] T1.2 — Redesign `SubjectClient.tsx`: Chapter cards + badges + progress rings

### Wave 2: Quiz + Review
**Depends on: Wave 0. Can run parallel to Wave 1.**

- [ ] T2.1 — Redesign `Quiz.tsx`: Progress + glass card + results ring
- [ ] T2.2 — Redesign `ExplanationCard.tsx`: Coral accent styling sync
- [ ] T2.3 — Redesign `ReviewClient.tsx`: Summary header + staggered cards

### Wave 3: Coding Pages
**Depends on: Wave 0. Can run parallel to Waves 1-2.**

- [ ] T3.1 — Redesign `coding/page.tsx` (Coding Hub): Hero + topic cards
- [ ] T3.2 — Redesign `coding/TopicPage.tsx`: Dual nav + refined cards
- [ ] T3.3 — Redesign `CodeBlock.tsx`: Terminal aesthetic + line numbers

### Wave 4: Polish
**Depends on: Waves 1-3 ALL complete.**

- [ ] T4.1 — Cross-page consistency audit (color, spacing, typography)
- [ ] T4.2 — Animation tuning (no jank, smooth staggers)
- [ ] T4.3 — Responsive audit (375/768/1024/1440px)
- [ ] T4.4 — Functionality smoke test (all buttons/routes work)
- [ ] T4.5 — Build verification (`npm run build` passes)

---

## Full Task Checklist

### WAVE 0 — Foundation (7 tasks)
- [ ] T0.1 — Update `globals.css` CSS custom properties (--bg through --glow-gold, all 18 tokens)
- [ ] T0.2 — Create `ProgressRing` (SVG circle, animated stroke-dashoffset, sm/md/lg, coral/gold/gradient)
- [ ] T0.3 — Create `ProgressBar` (horizontal bar, gradient fill, optional label, sm/lg)
- [ ] T0.4 — Create `StatCard` (icon, mono value, label, trend arrow, count-up animation)
- [ ] T0.5 — Create `GlowBadge` (pill shape, colored tint, glow shadow, coral/gold/emerald/neutral)
- [ ] T0.6 — Create `GlassCard` (glass backdrop, hover brighten, as prop polymorphism)
- [ ] T0.7 — Create `SectionHeader` (display title, subtitle, left/center alignment)

### WAVE 1 — Home + Subjects (2 tasks)
- [ ] T1.1a — HomeClient: Add hero dashboard area with 3 StatCards
- [ ] T1.1b — HomeClient: Redesign subject cards (icon, title, ProgressBar, percentage + attempts)
- [ ] T1.1c — HomeClient: Replace Coding Lab button with full-width horizontal CTA banner
- [ ] T1.1d — HomeClient: Staggered Framer Motion entrance (staggerChildren: 0.08)
- [ ] T1.1e — HomeClient: Card-glow with coral left-border on cards with progress
- [ ] T1.2a — SubjectClient: SectionHeader with subject name as display title
- [ ] T1.2b — SubjectClient: Chapter cards with numbered badge + inline stats
- [ ] T1.2c — SubjectClient: Recent activity as GlowBadge pills with score-based color
- [ ] T1.2d — SubjectClient: ProgressRing/star on set cards within expanded chapters
- [ ] T1.2e — SubjectClient: Refine expand/collapse animation timing

### WAVE 2 — Quiz + Review (3 tasks)
- [ ] T2.1a — Quiz: Replace progress bar with ProgressBar (coral-to-gold gradient)
- [ ] T2.1b — Quiz: Wrap question card in GlassCard, increase padding/typography
- [ ] T2.1c — Quiz: Redesign option buttons (larger, clearer hover/selected/disabled states)
- [ ] T2.1d — Quiz: Emerald glow for correct, coral glow for incorrect, subtle correct highlight
- [ ] T2.1e — Quiz: Replace results text with ProgressRing + count-up animation
- [ ] T2.1f — Quiz: Style Next/Results buttons with coral accent
- [ ] T2.2a — ExplanationCard: Update color tokens, coral/gold accent border-left
- [ ] T2.2b — ExplanationCard: Refine toggle animation, match new card styling
- [ ] T2.3a — ReviewClient: Summary header with ProgressRing + clean metadata
- [ ] T2.3b — ReviewClient: Staggered entrance for question review cards
- [ ] T2.3c — ReviewClient: Circular badge for question # (emerald/coral fill)
- [ ] T2.3d — ReviewClient: Options as mini cards, GlowBadge markers
- [ ] T2.3e — ReviewClient: Retake button with coral accent

### WAVE 3 — Coding Pages (3 tasks)
- [ ] T3.1a — Coding Hub: SectionHeader hero with pill badge + title
- [ ] T3.1b — Coding Hub: Topic cards with coral stripe + GlowBadge counts + hover scale
- [ ] T3.1c — Coding Hub: Refine "Back to Home" nav styling
- [ ] T3.2a — TopicPage: Dual nav (Coding Lab + Home) refined links
- [ ] T3.2b — TopicPage: Consistent card styling across overview/syntax/examples/questions
- [ ] T3.2c — TopicPage: Hint/solution toggles with coral/gold accent colors
- [ ] T3.2d — TopicPage: Refined bottom nav section
- [ ] T3.3a — CodeBlock: Dark terminal aesthetic (bg-[#0d1117])
- [ ] T3.3b — CodeBlock: Line numbers, language badge, optional copy button

### WAVE 4 — Polish & QA (5 tasks)
- [ ] T4.1 — Cross-page consistency audit (color, spacing, typography across all 6 pages)
- [ ] T4.2 — Animation tuning (60fps, smooth staggers, no layout shift)
- [ ] T4.3 — Responsive audit (375px, 768px, 1024px, 1440px viewports)
- [ ] T4.4 — Functionality smoke test (all routes, buttons, localStorage persistence)
- [ ] T4.5 — Build verification (`npm run build` passes with zero errors)

---

## File Change Summary

### New Files (7)
```
src/components/ui/ProgressRing.tsx
src/components/ui/ProgressBar.tsx
src/components/ui/StatCard.tsx
src/components/ui/GlowBadge.tsx
src/components/ui/GlassCard.tsx
src/components/ui/SectionHeader.tsx
```

### Modified Files (10)
```
src/app/globals.css                              # Color system overhaul
src/components/HomeClient.tsx                     # Hero stats + grid + banner
src/components/SubjectClient.tsx                  # Chapter cards + badges
src/components/Quiz.tsx                           # Progress + glass + results ring
src/components/ExplanationCard.tsx                # Styling sync
src/components/QuizClient.tsx                     # No logic change (pass-through)
src/app/review/[attemptId]/ReviewClient.tsx       # Summary + staggered cards
src/app/coding/page.tsx                           # Hub hero + topic cards
src/components/coding/TopicPage.tsx               # Nav + card styling
src/components/coding/CodeBlock.tsx               # Terminal aesthetic
```

### Untouched (NO CHANGES)
```
src/lib/data.server.ts
src/lib/coding-data.ts, src/lib/coding-icons.tsx
src/types/index.ts
src/hooks/*.ts
data/data.json, scripts/*
src/app/layout.tsx, page.tsx
src/app/subject/[subjectName]/page.tsx
src/app/quiz/[quizId]/page.tsx
src/app/review/[attemptId]/page.tsx
src/app/coding/[topicId]/page.tsx
```

---

## Success Criteria

1. `npm run build` passes with zero errors
2. All routes navigate correctly: /, /coding, /coding/:id, /subject/:name, /quiz/:id, /review/:id
3. localStorage progress persists across page refreshes
4. Dark dashboard aesthetic consistent across all 6 pages
5. Coral (#ff6b6b) and gold (#f5c518) accents visible on interactive elements
6. Framer Motion animations smooth at 60fps
7. Responsive at 375px, 768px, 1024px, 1440px
8. ZERO changes to data.server.ts, hooks, or data.json
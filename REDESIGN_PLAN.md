# MCQ Master — Dashboard Redesign Plan

## Overview

Transform the current MCQ Master home page from a simple subject grid into a premium **dark education dashboard** inspired by modern ed-tech dashboard concepts. The redesign introduces a sidebar navigation, bento-style subject grid, stats overview cards, recent activity feed, and streak tracking — while preserving all existing functionality.

## Design Direction

**Theme:** Dark Academic Dashboard with Cinematic Accents  
**Mood:** Premium, focused, motivating  
**Reference:** Online education dashboard concepts (Dribbble) — bento grids, progress tracking, glassmorphism

### Color Palette (from existing + extension)
```css
--bg: #0a0f1e;              /* Deep navy-charcoal (existing) */
--bg-surface: #111827;      /* Sidebar / elevated surfaces */
--bg-card: #161b2e;         /* Card backgrounds */
--bg-card-hover: #1e243a;   /* Card hover state */
--text: #f0ede6;            /* Warm off-white (existing) */
--text-secondary: #9ca3af;  /* Secondary text */
--text-muted: #6b7280;      /* Muted labels */
--accent: #f5c518;          /* Gold (existing) */
--accent-glow: rgba(245,197,24,0.15);
--border: rgba(255,255,255,0.06);
--border-hover: rgba(255,255,255,0.12);
--success: #10b981;
--danger: #ef4444;
--blue: #3b82f6;            /* Maths */
--purple: #8b5cf6;          /* CS */
--pink: #ec4899;            /* English */
--teal: #14b8a6;            /* Coding Lab */
```

### Typography
- **Display:** Playfair Display (existing) — headings, section titles
- **Body:** DM Sans (existing) — UI text, labels, stats
- **Scale:** H1 32px / Section 22px / Card title 18px / Body 14px / Caption 12px

---

## Architecture Changes

### New Components to Create

| Component | Location | Description |
|-----------|----------|-------------|
| `Sidebar` | `src/components/Sidebar.tsx` | Fixed left nav with logo, nav sections, user card |
| `DashboardHeader` | `src/components/DashboardHeader.tsx` | Greeting + action icons |
| `StatCard` | `src/components/StatCard.tsx` | Stats overview card with trend badge |
| `SubjectBentoGrid` | `src/components/SubjectBentoGrid.tsx` | Bento layout for subject cards |
| `SubjectCard` | `src/components/SubjectCard.tsx` | Individual subject with progress, stats |
| `RecentActivity` | `src/components/RecentActivity.tsx` | Activity feed list |
| `StreakCard` | `src/components/StreakCard.tsx` | Streak counter with animation |
| `ProgressBar` | `src/components/ProgressBar.tsx` | Animated gradient progress bar |

### Modified Components

| Component | Changes |
|-----------|---------|
| `HomeClient.tsx` | Complete rewrite — becomes dashboard layout composer |
| `globals.css` | Add new CSS variables, backdrop-blur utilities, animation keyframes |
| `layout.tsx` | Add sidebar spacing offset to main content |

### Pages Structure

```
src/app/
├── page.tsx              # Dashboard (Home) — now with sidebar
├── subject/[subjectName]/page.tsx   # Keep existing
├── quiz/[quizId]/page.tsx           # Keep existing
├── review/[attemptId]/page.tsx      # Keep existing
├── coding/page.tsx                  # Keep existing
├── profile/page.tsx                 # Keep existing
└── layout.tsx            # Add sidebar container
```

---

## Implementation Phases

### Phase 1: Design System & Foundation
1. **Update `globals.css`**
   - Add new color tokens (`--bg-surface`, `--bg-card`, `--bg-card-hover`, etc.)
   - Add animation keyframes (`fadeInUp`, `pulse`, `float`)
   - Add scrollbar and selection styles
   - Add `.font-display` utility

2. **Update `layout.tsx`**
   - Wrap content in dashboard layout structure
   - Keep existing font imports

### Phase 2: Core Components
3. **Build `Sidebar.tsx`**
   - Logo with gold gradient icon
   - Navigation sections: Main (Dashboard, Subjects, Coding Lab, Analytics), Personal (Review, Achievements, Profile)
   - Active state with gold border/background
   - User card at bottom with avatar + settings
   - Collapsible on mobile (hamburger menu)

4. **Build `DashboardHeader.tsx`**
   - Dynamic greeting ("Welcome back, [name]")
   - Subtitle with stats summary
   - Search + notification icons

5. **Build `StatCard.tsx`**
   - Icon with colored background
   - Trend badge (up/down with percentage)
   - Large value + label
   - Hover: top gold gradient line reveal + lift

### Phase 3: Subject Grid & Cards
6. **Build `ProgressBar.tsx`**
   - Animated fill on mount
   - Gradient based on subject color
   - Gloss effect on leading edge

7. **Build `SubjectCard.tsx`**
   - Subject icon with gradient background
   - Progress bar + percentage
   - Name + meta (chapters, sets)
   - Bottom stats row (Best, Attempts, Average)
   - Mouse-follow glow effect (CSS custom properties)
   - Hover: lift + shadow + border brighten

8. **Build `SubjectBentoGrid.tsx`**
   - 3-column grid on desktop
   - CS card spans 2 columns (wide)
   - Coding Lab card with special teal gradient
   - Responsive: 2-col tablet, 1-col mobile

### Phase 4: Activity & Streak
9. **Build `RecentActivity.tsx`**
   - Activity list with icon, title, description, score
   - Color-coded icons per subject
   - Score color: green ≥70, red <70

10. **Build `StreakCard.tsx`**
    - Large gradient number
    - Animated fire dots
    - Best streak reference
    - Encouragement message

### Phase 5: Page Assembly & Polish
11. **Rewrite `HomeClient.tsx`**
    - Compose all components into dashboard
    - Staggered entrance animations (Framer Motion)
    - Background mesh gradients (fixed, animated)

12. **Add Framer Motion animations**
    - `fadeInUp` stagger on sections
    - Card hover spring physics
    - Progress bar animate on mount
    - Sidebar slide on mobile

### Phase 6: Responsive & Mobile
13. **Mobile sidebar**
    - Hidden by default, slide-in overlay
    - Hamburger trigger in header
    - Backdrop blur behind sidebar

14. **Responsive grid adjustments**
    - Stats: 4-col → 2-col → 1-col
    - Bento: 3-col → 2-col → 1-col
    - Activity: 2-col → stacked

### Phase 7: Data Integration
15. **Connect real data**
    - Subject stats from `computeSubjectStats` (existing)
    - Recent attempts from localStorage
    - Streak calculation from attempt dates
    - Progress percentages from chapter completion

---

## File-by-File Changes

### New Files (12)
- `src/components/Sidebar.tsx`
- `src/components/DashboardHeader.tsx`
- `src/components/StatCard.tsx`
- `src/components/SubjectBentoGrid.tsx`
- `src/components/SubjectCard.tsx`
- `src/components/RecentActivity.tsx`
- `src/components/StreakCard.tsx`
- `src/components/ProgressBar.tsx`
- `src/hooks/useStreak.ts` (streak calculation logic)
- `src/hooks/useRecentActivity.ts` (activity feed logic)
- `demo-dashboard.html` (reference demo — already created)

### Modified Files (4)
- `src/app/globals.css` — Add tokens, animations, utilities
- `src/app/layout.tsx` — Dashboard layout wrapper
- `src/components/HomeClient.tsx` — Full rewrite
- `src/app/page.tsx` — Keep simple, pass data

### Deleted Files (0)
- No deletions — all existing functionality preserved

---

## Dependencies

**Already installed:**
- `framer-motion` — Animations
- `lucide-react` — Icons
- `tailwindcss` — Styling

**No new dependencies required.**

---

## Demo File

A standalone HTML demo has been created at:
```
/home/rehan/Documents/test/mcq-platform/demo-dashboard.html
```

Open this file in any browser to preview the full dashboard design with:
- All animations (CSS-based)
- Responsive layout
- Hover effects
- Progress bar animations
- Color scheme and typography

---

## Success Criteria

- [ ] Dashboard renders with sidebar on desktop
- [ ] Bento grid displays all 4 subjects + Coding Lab
- [ ] Stats cards show real data from localStorage
- [ ] Progress bars animate on page load
- [ ] Cards have hover lift + glow effects
- [ ] Recent activity shows last 4 attempts
- [ ] Streak card calculates consecutive days
- [ ] Fully responsive (mobile hamburger menu)
- [ ] No existing functionality broken
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] Dark theme only (no light mode)
- [ ] Gold accent consistent throughout

# Creator Studio Learnings

## Task 1: Data Types & Mock Data (creator-studio.ts)

### Patterns
- Data files follow: interfaces at top → `as const` arrays with derived types → exported const arrays
- `courses.ts` pattern: `export type X = ...`, `export interface Y { ... }`, `export const arr: Y[] = [...]`
- `creators.ts` pattern: `as const` array → `typeof ARR[number]` for union types

### Conventions
- KRW prices: 49000, 59000, 69000, 79000, 89000, 120000, 130000, 150000 (realistic ranges)
- Korean names: 김철수, 이영희, 박민수, 최지은, 정하늘
- Date format: "2026-03-17" (ISO style)
- DateTime format: "2026-03-17T08:30:00"

### Environment Notes
- `npx tsc --noEmit` requires `npx -p typescript tsc --noEmit` (tsc package is different from typescript)
- LSP (typescript-language-server) not installed in worktree — rely on tsc for type checking
- Many pre-existing TS errors from missing node_modules (react, next, lucide-react) — filter by filename when checking new file errors

## Task 2: Course Sub-feature Components (2026-03-17)
- Created 4 files in `frontend/src/views/creator-studio/`: CourseCreate (56L), CourseSales (82L), CourseProgress (40L), CourseManagement (89L)
- All under 150 lines, 0 tsc errors from new files
- Design patterns used: Card+Badge from MyCourses, Tabs with controlled state from PurchaseHistory
- Table component exports: Table, TableHeader, TableBody, TableRow, TableHead, TableCell (from @/components/ui/table)
- Progress: single export, takes `value` prop, use `className="h-2"` for compact bars
- Card exports: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Tabs exports: Tabs, TabsList, TabsTrigger, TabsContent
- KRW formatting: `.toLocaleString() + "원"`
- StatusBadge pattern: green bg for published, orange for archived, variant="secondary" for draft
- Pre-existing errors in repo: bun:test module issues in test files, ConsultationScheduler.tsx className issues

## Task 5: Data Validation Tests & Visual QA (2026-03-17)

### Test Patterns
- bun:test supports `describe` blocks: `import { test, expect, describe } from "bun:test"`
- Korean regex for validation: `/[\uAC00-\uD7AF]/` matches Hangul syllables
- Data validation tests (no React rendering) run fast: 40 tests in 122ms
- Test file: `frontend/src/__tests__/creator-studio.test.ts` — 8 mock arrays + SECTION_KEYS validated

### Build
- `bun run build` compiles successfully with creator-studio route as static page (○)
- Build time ~2.7s, creator-studio page size: 1.32kB + 104kB shared JS

### Dev Server
- `package.json` hardcodes `next dev -p 3001 --turbopack` — use `npx next dev -p <port>` to override
- Port 3001 may be occupied by main project dev server
- Server ready in ~2s after start

### Playwright Visual QA
- All 9 sidebar sections render correctly with proper content switching
- test-id pattern: `sidebar-{section-key}` (e.g., `sidebar-course-create`, `sidebar-ai-consultation-history`)
- Playwright `getByTestId` works with data-testid attributes on sidebar buttons
- Content switches correctly: heading updates + main content area replaces
- 6 screenshots captured in `.sisyphus/evidence/`

## Task: Rich Scheduler Calendar Visual QA (2026-03-17)

### Calendar Component
- Custom calendar grid (no react-day-picker / `.rdp` class)
- 7-column CSS grid (`grid grid-cols-7`) with Korean day headers: 일 월 화 수 목 금 토
- Count badges: "N건" pill-shaped indicators on dates with bookings
- Booking previews: colored status dots + time + client name (e.g., "● 10:00 한소희")
- Status dot colors: green=완료/확정, blue=대기(?), red=취소

### Test IDs
- `scheduler-calendar` — main calendar container
- `calendar-prev` / `calendar-next` — month navigation buttons
- `calendar-cell-{YYYY-MM-DD}` — individual date cells
- `clear-date-filter` — "전체 보기" button to reset date filter

### Month Navigation
- Title format: "2026년 N월"
- Prev/next buttons update calendar grid with correct month's bookings
- Overflow dates (from adjacent months) rendered in lighter style

### BUG FOUND: Date Filter Timezone Issue
- **File**: `ConsultationScheduler.tsx` line 33
- **Code**: `selectedDate.toISOString().split("T")[0]`
- **Problem**: `new Date(2026, 2, 18)` in Asia/Seoul (UTC+9) → `.toISOString()` returns `"2026-03-17T15:00:00.000Z"` → `.split("T")[0]` = `"2026-03-17"` (wrong day!)
- **Effect**: Clicking any calendar date shows "예약이 없습니다" (no bookings) because the filter compares UTC date vs local date
- **Fix needed**: Use `format(selectedDate, "yyyy-MM-dd")` from date-fns instead of `.toISOString().split("T")[0]`

### Evidence Screenshots
- `rich-cal-overview.png` — Full calendar with bookings, badges, table (156KB)
- `rich-cal-prev-month.png` — February 2026 view (59KB)
- `rich-cal-next-month.png` — April 2026 view (54KB)
- `rich-cal-date-filter.png` — Date filter active showing bug (71KB)

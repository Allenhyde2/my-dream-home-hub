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

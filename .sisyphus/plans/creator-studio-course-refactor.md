# Creator Studio 강의 메뉴 통합 리팩터링

## TL;DR

> **Quick Summary**: Creator Studio의 강의 카테고리를 3개 메뉴 통합 — 강의 관리에 강의 개설 기능 합치고, 강의 항목 클릭 시 진행 상세 대시보드 화면 추가. 강의 개설/강의 진행 메뉴 삭제.
> 
> **Deliverables**:
> - 강의 관리 페이지에 강의 개설 UI 통합 (새 강의 만들기 버튼 + 초안 목록)
> - 강의 상세 화면 신규 컴포넌트 (`CreatorCourseDetail.tsx`) — 진행 정보 + 챕터별 진행률 + 수강생 활동
> - 사이드바 메뉴 2개로 축소 (강의 관리, 강의 판매)
> - 강의 개설/강의 진행 컴포넌트 파일 삭제
> - mock data 추가 (챕터별 진행률, 수강생 활동)
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: Task 1 → Task 2 + Task 3 (parallel) → Task 4 → Task 5

---

## Context

### Original Request
크리에이터 스튜디오 강의 카테고리 메뉴 재구성:
- 강의 관리를 첫 번째 메뉴로 이동
- 강의 개설 기능을 강의 관리에 통합, 강의 개설 메뉴 삭제
- 강의 관리에서 강의 항목 클릭 → 강의 진행 정보를 더 자세히 보여주는 상세 화면 추가, 강의 진행 메뉴 삭제

### Interview Summary
**Key Discussions**:
- 상세 화면 형태: 콘텐츠 영역 교체 + 뒤로가기 버튼 (사이드바 메뉴 그대로)
- 상세 정보 수준: 기존 진행 정보 + 챕터별 진행률 + 수강생 활동 대시보드 (매출 제외)
- 최종 강의 사이드바: 강의 관리 → 강의 판매 (2개)

### Metis Review
**Identified Gaps** (addressed):
- `CourseDetail.tsx` 이름 충돌: `views/CourseDetail.tsx`(학생용)이 이미 존재 → 새 파일명 `CreatorCourseDetail.tsx` 사용
- 상세 화면은 새 SectionKey 아님 → CourseManagement 내부 state (`selectedCourseId: number | null`)로 처리
- `CourseProgressRecord` + `mockCourseProgress`는 상세 화면에서 사용하므로 data 파일에서 삭제 금지
- 탭 필터 상태 보존: `activeFilter`와 `selectedCourseId`는 별도 useState → 자연 보존됨
- 타입 체인 동기화: SECTION_KEYS → SectionKey → sectionTitles → renderContent → sidebar → tests 모두 원자적 변경

---

## Work Objectives

### Core Objective
강의 관리를 강의 카테고리의 중심 허브로 통합하고, 강의 항목 드릴다운 상세 화면을 추가한다.

### Concrete Deliverables
- `frontend/src/data/creator-studio.ts` — 새 인터페이스 + mock data 추가, SECTION_KEYS 수정
- `frontend/src/views/creator-studio/CreatorCourseDetail.tsx` — 신규 상세 화면 컴포넌트
- `frontend/src/views/creator-studio/CourseManagement.tsx` — 강의 개설 UI 통합 + 드릴다운 상태
- `frontend/src/views/creator-studio/CreatorStudioSidebar.tsx` — 메뉴 2개로 축소
- `frontend/src/views/CreatorStudio.tsx` — import/switch/titles 정리
- `frontend/src/__tests__/creator-studio.test.ts` — 테스트 업데이트
- DELETE: `frontend/src/views/creator-studio/CourseCreate.tsx`
- DELETE: `frontend/src/views/creator-studio/CourseProgress.tsx`

### Definition of Done
- [ ] `cd frontend && npx tsc --noEmit` → 0 errors
- [ ] `cd frontend && bun run build` → exit code 0
- [ ] `cd frontend && bun test` → all pass
- [ ] 사이드바 강의 카테고리에 메뉴 2개만 표시 (강의 관리, 강의 판매)
- [ ] 강의 관리에서 새 강의 만들기 버튼 + 초안 목록 표시
- [ ] 강의 항목 클릭 → 상세 화면 → 뒤로가기 → 목록 복귀 (필터 유지)
- [ ] CourseCreate.tsx, CourseProgress.tsx 파일 삭제됨

### Must Have
- 강의 관리가 사이드바 첫 번째 메뉴
- 강의 개설의 "새 강의 만들기" 버튼(disabled) + 초안 카드 목록이 강의 관리에 통합
- 강의 항목 클릭 시 콘텐츠 영역이 상세 화면으로 교체
- 상세 화면: 기본 통계(수강생, 완료율, 활성 수강생) + 챕터별 진행률 + 수강생 활동 테이블
- 상세 화면 뒤로가기 버튼 → 목록으로 복귀 (탭 필터 상태 유지)
- 신규 파일명: `CreatorCourseDetail.tsx` (기존 `CourseDetail.tsx`와 충돌 방지)
- 모든 interactive 요소에 `data-testid`
- 한국어 UI 텍스트

### Must NOT Have (Guardrails)
- ❌ 새 SectionKey 추가 금지 — 상세 화면은 CourseManagement 내부 state
- ❌ `CourseProgressRecord`/`mockCourseProgress` 삭제 금지 — 상세 화면에서 사용
- ❌ `CourseSales.tsx` 수정 금지
- ❌ 상담예약 관련 코드 수정 금지
- ❌ `views/CourseDetail.tsx` (학생용) 수정 금지
- ❌ 상세 화면에 매출/수익 데이터 포함 금지 — CourseSales 영역
- ❌ 새 npm 의존성 추가 금지
- ❌ React Router/URL 라우팅 사용 금지 — 기존 state 기반 패턴 유지
- ❌ AI slop: 과도한 주석, 불필요한 추상화, console.log

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (bun:test)
- **Automated tests**: YES (Tests-after)
- **Framework**: bun:test
- **React 렌더 테스트**: 불가 (testing-library 미설치)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill)
- **Build**: Use Bash — `bun run build`, `npx tsc --noEmit`
- **Data**: Use Bash (bun test)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — data layer):
└── Task 1: Add new mock data interfaces + data + update tests [quick]

Wave 2 (After Wave 1 — components, MAX PARALLEL):
├── Task 2: Create CreatorCourseDetail component [visual-engineering]
└── Task 3: Integrate CourseCreate UI + drill-down into CourseManagement [visual-engineering]

Wave 3 (After Wave 2 — atomic cleanup):
└── Task 4: Remove section keys, update sidebar/router, delete files [quick]

Wave 4 (After Wave 3 — verification):
└── Task 5: Build verification + Visual QA [unspecified-high]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 3 → Task 4 → Task 5 → F1-F4
Parallel Speedup: ~30% faster than sequential
Max Concurrent: 2 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3 | 1 |
| 2 | 1 | 3 | 2 |
| 3 | 1, 2 | 4 | 2 |
| 4 | 3 | 5 | 3 |
| 5 | 4 | F1-F4 | 4 |
| F1-F4 | 5 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **1 task** — T1 → `quick`
- **Wave 2**: **2 tasks** — T2 → `visual-engineering`, T3 → `visual-engineering`
- **Wave 3**: **1 task** — T4 → `quick`
- **Wave 4**: **1 task** — T5 → `unspecified-high`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Add New Mock Data Interfaces + Data + Update Tests

  **What to do**:
  - In `frontend/src/data/creator-studio.ts`:
    - Add `CourseChapterProgress` interface: `chapterId: number`, `chapterTitle: string`, `completionRate: number`, `totalLessons: number`, `completedLessons: number`
    - Add `StudentActivityRecord` interface: `id: number`, `studentName: string`, `lastActive: string`, `progress: number`, `completedLessons: number`, `totalLessons: number`
    - Add `mockChapterProgress: Record<number, CourseChapterProgress[]>` — keyed by courseId (1, 2, 5 only — published/archived courses with students). Each course has 4-5 chapters with Korean titles.
    - Add `mockStudentActivity: Record<number, StudentActivityRecord[]>` — keyed by courseId (1, 2, 5 only). 3-4 students per course with Korean names.
    - Update `SECTION_KEYS`: remove `"course-create"` and `"course-progress"` — final array has 7 items
    - Keep `CourseProgressRecord` interface and `mockCourseProgress` array intact — used by detail view
  - In `frontend/src/__tests__/creator-studio.test.ts`:
    - Update SECTION_KEYS count assertion: 9 → 7
    - Remove `toContain("course-create")` and `toContain("course-progress")` assertions
    - Add tests for `mockChapterProgress`: non-empty, has entries for courseIds 1/2/5, each entry has valid fields
    - Add tests for `mockStudentActivity`: non-empty, has entries for courseIds 1/2/5, Korean names
    - Keep existing `mockCourseProgress` test — data still exists

  **Must NOT do**:
  - Do NOT remove `CourseProgressRecord` or `mockCourseProgress`
  - Do NOT touch consultation-related data
  - Do NOT create mock data for draft courses (ids 3, 4) — 0 students

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single data file + test file update, straightforward TypeScript
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation task)
  - **Parallel Group**: Wave 1 (sole task)
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `frontend/src/data/creator-studio.ts:1-92` — Existing interface + mock data pattern. Follow identical structure for new interfaces.
  - `frontend/src/data/creator-studio.ts:80-92` — SECTION_KEYS const and SectionKey type. Remove 2 entries.
  - `frontend/src/data/creator-studio.ts:186-211` — `mockCourseProgress` array. Keep this. Reference courseIds 1, 2, 5 for new Record keys.

  **Test References**:
  - `frontend/src/__tests__/creator-studio.test.ts` — Existing test file. Update count assertions and add new tests following same pattern.

  **WHY Each Reference Matters**:
  - `creator-studio.ts:1-92` — Must follow exact interface naming and export pattern for consistency
  - `creator-studio.ts:80-92` — Removing entries from SECTION_KEYS changes the SectionKey union type, which propagates to all switch/Record usages
  - `creator-studio.ts:186-211` — Shows the courseIds (1, 2, 5) that have students — use these same IDs as Record keys

  **Acceptance Criteria**:
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] `cd frontend && bun test` → all pass
  - [ ] SECTION_KEYS has exactly 7 items
  - [ ] `mockChapterProgress` has entries for courseIds 1, 2, 5
  - [ ] `mockStudentActivity` has entries for courseIds 1, 2, 5

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: TypeScript compilation passes after SECTION_KEYS change
    Tool: Bash
    Preconditions: Data file updated
    Steps:
      1. Run `cd frontend && npx tsc --noEmit`
      2. Check exit code is 0
    Expected Result: Zero type errors despite SECTION_KEYS reduction
    Failure Indicators: TS errors about missing switch cases or Record keys
    Evidence: .sisyphus/evidence/task-1-tsc-check.txt

  Scenario: All tests pass with updated assertions
    Tool: Bash
    Preconditions: Test file updated
    Steps:
      1. Run `cd frontend && bun test`
      2. Check all pass
    Expected Result: All tests pass including new mock data tests
    Failure Indicators: Failed assertions on SECTION_KEYS count or missing mock data
    Evidence: .sisyphus/evidence/task-1-test-results.txt
  ```

  **Commit**: YES (groups with all tasks — single atomic commit at end)

- [x] 2. Create CreatorCourseDetail Component

  **What to do**:
  - Create `frontend/src/views/creator-studio/CreatorCourseDetail.tsx`
  - `"use client"` at top, default export
  - Props: `{ courseId: number; onBack: () => void }`
  - Look up data:
    - `mockCreatorCourses.find(c => c.id === courseId)` for basic course info
    - `mockCourseProgress.find(p => p.courseId === courseId)` for progress summary
    - `mockChapterProgress[courseId]` for chapter-level progress
    - `mockStudentActivity[courseId]` for student activity
  - Layout (콘텐츠 영역 교체 형태):
    - **Header row**: ArrowLeft back button (`data-testid="course-detail-back"`, `onClick={onBack}`) + course title + StatusBadge
    - **Stats cards row** (3-4 cards horizontal): 총 수강생, 완료율, 평균 진행률, 활성 수강생 — use Card components
    - **챕터별 진행률 section**: heading + list of chapters, each with title + Progress bar + "N/M 강의 완료" text
    - **수강생 활동 section**: heading + Table with columns: 수강생명, 마지막 활동, 진행률 (Progress bar), 완료 강의
  - Handle edge case: courseId not found → show "강의를 찾을 수 없습니다" fallback
  - Reuse `StatusBadge` pattern from CourseManagement (copy inline or extract — keep simple)
  - `data-testid` on all key elements: `course-detail-back`, `course-detail-stats`, `course-detail-chapters`, `course-detail-students`
  - File under 150 lines

  **Must NOT do**:
  - Do NOT include revenue/sales data — that's CourseSales territory
  - Do NOT create new SectionKey
  - Do NOT install dependencies

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component with stats cards, progress bars, tables — layout-heavy
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `frontend/src/views/creator-studio/CourseProgress.tsx:1-40` — Shows existing progress card pattern with Progress bars. Expand this into more detailed view.
  - `frontend/src/views/creator-studio/CourseManagement.tsx:16-30` — StatusBadge helper component. Reuse same pattern.
  - `frontend/src/views/creator-studio/ConsultationScheduler.tsx` — Shows Table + Badge composition in creator-studio context

  **API/Type References**:
  - `frontend/src/data/creator-studio.ts:CreatorCourse` — Course info shape
  - `frontend/src/data/creator-studio.ts:CourseProgressRecord` — Progress summary shape
  - `frontend/src/data/creator-studio.ts:CourseChapterProgress` — New chapter progress shape (from Task 1)
  - `frontend/src/data/creator-studio.ts:StudentActivityRecord` — New student activity shape (from Task 1)
  - `frontend/src/components/ui/progress.tsx` — Progress bar component
  - `frontend/src/components/ui/table.tsx` — Table components
  - `frontend/src/components/ui/card.tsx` — Card components for stats

  **WHY Each Reference Matters**:
  - `CourseProgress.tsx` — Shows the exact Progress bar + stats pattern to expand upon
  - `CourseManagement.tsx:16-30` — StatusBadge to copy for consistent status display
  - `ConsultationScheduler.tsx` — Table composition pattern within creator-studio

  **Acceptance Criteria**:
  - [ ] File created at `frontend/src/views/creator-studio/CreatorCourseDetail.tsx`
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] File under 150 lines
  - [ ] Has `data-testid="course-detail-back"` button
  - [ ] Displays stats cards, chapter progress, student activity

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Component file compiles
    Tool: Bash
    Preconditions: Task 1 complete, file created
    Steps:
      1. Run `cd frontend && npx tsc --noEmit`
      2. Check exit code 0
    Expected Result: No type errors
    Failure Indicators: Import errors, missing type references
    Evidence: .sisyphus/evidence/task-2-tsc-check.txt

  Scenario: File is under 150 lines
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run `wc -l frontend/src/views/creator-studio/CreatorCourseDetail.tsx`
      2. Assert under 150
    Expected Result: Under 150 lines
    Failure Indicators: Over 150 lines
    Evidence: .sisyphus/evidence/task-2-linecount.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 3. Integrate CourseCreate UI + Drill-Down into CourseManagement

  **What to do**:
  - Modify `frontend/src/views/creator-studio/CourseManagement.tsx`:
    - Add import: `CreatorCourseDetail` from `./CreatorCourseDetail`
    - Add import: `PlusCircle, FileEdit` from `lucide-react`, `Button` from `@/components/ui/button`
    - Add state: `const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)`
    - Add computed: `const draftCourses = mockCreatorCourses.filter(c => c.status === "draft")`
    - **If `selectedCourseId !== null`**: render `<CreatorCourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />`
    - **If `selectedCourseId === null`**: render the management list view:
      - **TOP section** (from CourseCreate): "새 강의 만들기" Button (disabled, `data-testid="btn-create-course"`) + draft courses card list
      - **BOTTOM section** (existing): Tabs filter + Table
      - Table rows: add `onClick={() => setSelectedCourseId(course.id)}` + `className="cursor-pointer hover:bg-muted/50"`
  - File should stay under 150 lines (the detail view is in separate CreatorCourseDetail)

  **Must NOT do**:
  - Do NOT create new SectionKey — drill-down is internal state
  - Do NOT modify CourseSales.tsx
  - Do NOT remove imports that are still needed

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI integration, layout composition, state management
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 2)
  - **Parallel Group**: Wave 2 (after Task 2)
  - **Blocks**: Task 4
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `frontend/src/views/creator-studio/CourseManagement.tsx:1-89` — Current file to modify. Understand existing structure.
  - `frontend/src/views/creator-studio/CourseCreate.tsx:1-56` — Source of UI to merge: "새 강의 만들기" button + draft card list. Copy relevant JSX.

  **API/Type References**:
  - `frontend/src/views/creator-studio/CreatorCourseDetail.tsx` (Task 2 output) — Props: `courseId: number`, `onBack: () => void`
  - `frontend/src/data/creator-studio.ts:mockCreatorCourses` — Course data array

  **WHY Each Reference Matters**:
  - `CourseManagement.tsx` — The file being modified. Must understand existing Tab/Table structure to integrate without breaking.
  - `CourseCreate.tsx` — UI source to extract. Copy the Button + draft card list JSX pattern.
  - `CreatorCourseDetail.tsx` — Component to render when a course is selected.

  **Acceptance Criteria**:
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] "새 강의 만들기" button visible in CourseManagement
  - [ ] Draft course cards visible in CourseManagement
  - [ ] Table rows are clickable → switches to detail view
  - [ ] Detail view back button → returns to list with filter preserved
  - [ ] File under 150 lines

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: CourseCreate UI merged into CourseManagement
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `http://localhost:3000/creator-studio`
      2. Assert `[data-testid="btn-create-course"]` is visible and disabled
      3. Assert `[data-testid="draft-course-3"]` card is visible (draft course)
      4. Take screenshot
    Expected Result: "새 강의 만들기" button and draft cards visible in 강의 관리
    Failure Indicators: Button missing, draft cards missing
    Evidence: .sisyphus/evidence/task-3-create-merged.png

  Scenario: Drill-down to course detail
    Tool: Playwright (playwright skill)
    Preconditions: On CourseManagement view
    Steps:
      1. Click `[data-testid="mgmt-row-1"]` (재건축 투자 완전정복)
      2. Assert `[data-testid="course-detail-back"]` is visible
      3. Assert text "재건축 투자 완전정복" is visible
      4. Assert `[data-testid="course-detail-chapters"]` section is visible
      5. Assert `[data-testid="course-detail-students"]` section is visible
      6. Take screenshot
    Expected Result: Detail view shows course info, chapter progress, student activity
    Failure Indicators: Detail view not rendering, missing sections
    Evidence: .sisyphus/evidence/task-3-drill-down.png

  Scenario: Back button preserves tab filter
    Tool: Playwright (playwright skill)
    Preconditions: On CourseManagement view
    Steps:
      1. Click `[data-testid="tab-published"]` tab
      2. Assert only published courses shown in table
      3. Click `[data-testid="mgmt-row-1"]` to drill into detail
      4. Click `[data-testid="course-detail-back"]` to return
      5. Assert `[data-testid="tab-published"]` is still active
      6. Assert table still shows only published courses
    Expected Result: Tab filter state preserved after drill-down round-trip
    Failure Indicators: Filter reset to "전체", wrong courses shown
    Evidence: .sisyphus/evidence/task-3-filter-preserved.png

  Scenario: Draft course (0 students) drill-down shows empty state
    Tool: Playwright (playwright skill)
    Preconditions: On CourseManagement view, tab set to "전체" or "초안"
    Steps:
      1. Click `[data-testid="mgmt-row-3"]` (부동산 절세 가이드 — draft)
      2. Assert detail view renders without errors
      3. Assert no chapter progress or student activity data shown (empty/fallback)
    Expected Result: Graceful handling of course with no progress data
    Failure Indicators: JS error, crash, undefined data
    Evidence: .sisyphus/evidence/task-3-draft-detail.png
  ```

  **Commit**: YES (groups with all tasks)

- [x] 4. Atomic Cleanup — Update Sidebar, Router, Delete Files

  **What to do**:
  - Modify `frontend/src/views/creator-studio/CreatorStudioSidebar.tsx`:
    - Update `courseItems` array: remove `course-create` and `course-progress` entries
    - Reorder: `course-management` first, then `course-sales`
    - Final array: `[{ key: "course-management", label: "강의 관리" }, { key: "course-sales", label: "강의 판매" }]`
  - Modify `frontend/src/views/CreatorStudio.tsx`:
    - Remove imports: `CourseCreate`, `CourseProgress`
    - Remove from `sectionTitles` Record: `"course-create"` and `"course-progress"` entries
    - Remove from `renderContent` switch: `case "course-create"` and `case "course-progress"`
  - Delete files:
    - `frontend/src/views/creator-studio/CourseCreate.tsx`
    - `frontend/src/views/creator-studio/CourseProgress.tsx`
  - Verify all changes compile together: `npx tsc --noEmit`

  **Must NOT do**:
  - Do NOT modify consultation items in sidebar
  - Do NOT change default section (remains "course-management")
  - Do NOT modify CourseSales or any other component

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mechanical cleanup — remove entries, delete files, verify compilation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sole task)
  - **Blocks**: Task 5
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `frontend/src/views/creator-studio/CreatorStudioSidebar.tsx:28-33` — `courseItems` array to modify
  - `frontend/src/views/CreatorStudio.tsx:11-13` — Imports to remove (CourseCreate, CourseProgress)
  - `frontend/src/views/CreatorStudio.tsx:22-32` — `sectionTitles` Record to update
  - `frontend/src/views/CreatorStudio.tsx:34-55` — `renderContent` switch to update

  **WHY Each Reference Matters**:
  - `CreatorStudioSidebar.tsx:28-33` — Must update this array atomically with the type changes from Task 1
  - `CreatorStudio.tsx:11-13, 22-32, 34-55` — Three locations that reference the removed section keys. All must be updated together.

  **Acceptance Criteria**:
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] `cd frontend && bun run build` → exit code 0
  - [ ] `cd frontend && bun test` → all pass
  - [ ] `CourseCreate.tsx` deleted
  - [ ] `CourseProgress.tsx` deleted
  - [ ] No dead imports referencing deleted files
  - [ ] Sidebar `courseItems` has exactly 2 entries

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Build passes after cleanup
    Tool: Bash
    Preconditions: All cleanup changes applied
    Steps:
      1. Run `cd frontend && npx tsc --noEmit && bun run build && bun test`
      2. Check all exit codes are 0
    Expected Result: TypeScript, build, and tests all pass
    Failure Indicators: TS errors about missing cases, import errors for deleted files
    Evidence: .sisyphus/evidence/task-4-build-pipeline.txt

  Scenario: Deleted files no longer exist
    Tool: Bash
    Preconditions: Files deleted
    Steps:
      1. Run `ls frontend/src/views/creator-studio/CourseCreate.tsx 2>&1`
      2. Run `ls frontend/src/views/creator-studio/CourseProgress.tsx 2>&1`
      3. Assert both return "No such file"
    Expected Result: Both files deleted
    Failure Indicators: Files still exist
    Evidence: .sisyphus/evidence/task-4-files-deleted.txt

  Scenario: No dead references to deleted files
    Tool: Bash
    Preconditions: Cleanup complete
    Steps:
      1. Run `grep -r "CourseCreate\|CourseProgress" frontend/src/ --include="*.tsx" --include="*.ts" | grep -v "creator-studio.ts" | grep -v "creator-studio.test.ts" | grep -v "mockCourseProgress" | grep -v "CourseProgressRecord" | grep -v "CourseChapterProgress"`
      2. Assert 0 matches
    Expected Result: No remaining imports or references to deleted components
    Failure Indicators: Stale imports found
    Evidence: .sisyphus/evidence/task-4-no-dead-refs.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 5. Build Verification + Visual QA

  **What to do**:
  - Run full build pipeline: `cd frontend && npx tsc --noEmit && bun run build && bun test`
  - Run Playwright visual QA:
    - Navigate to `/creator-studio`
    - Verify sidebar shows only 2 course items (강의 관리, 강의 판매)
    - Verify 강의 관리 is first menu item
    - Verify "새 강의 만들기" button present
    - Verify draft course cards present
    - Click course row → verify detail view loads
    - Verify detail: stats cards, chapter progress, student activity
    - Click back → verify list returns with filter intact
    - Click draft course → verify graceful empty state
    - Test all 5 consultation menus still work
    - Mobile viewport test (375px) — sidebar Sheet behavior

  **Must NOT do**:
  - Do NOT modify any code
  - Do NOT skip consultation menu verification

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-domain verification — build, tests, Playwright QA
  - **Skills**: [`playwright`]
    - `playwright`: Browser-based visual QA, screenshot capture

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sole task)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `.sisyphus/plans/creator-studio-course-refactor.md` — This plan, for verification against all Must Have/Must NOT Have

  **Acceptance Criteria**:
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] `cd frontend && bun run build` → exit code 0
  - [ ] `cd frontend && bun test` → all pass
  - [ ] All Playwright screenshots captured

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Sidebar shows exactly 2 course menu items
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `http://localhost:3000/creator-studio`
      2. Assert `[data-testid="sidebar-course-management"]` is visible
      3. Assert `[data-testid="sidebar-course-sales"]` is visible
      4. Assert `[data-testid="sidebar-course-create"]` is NOT in DOM
      5. Assert `[data-testid="sidebar-course-progress"]` is NOT in DOM
      6. Take screenshot
    Expected Result: Only 강의 관리 and 강의 판매 in sidebar
    Failure Indicators: Old menu items still visible
    Evidence: .sisyphus/evidence/task-5-sidebar-items.png

  Scenario: Full drill-down round-trip
    Tool: Playwright (playwright skill)
    Preconditions: Page loaded at /creator-studio
    Steps:
      1. Assert default view is 강의 관리
      2. Assert `[data-testid="btn-create-course"]` visible (새 강의 만들기)
      3. Click `[data-testid="tab-published"]`
      4. Click `[data-testid="mgmt-row-1"]`
      5. Assert `[data-testid="course-detail-back"]` visible
      6. Assert `[data-testid="course-detail-chapters"]` visible
      7. Assert `[data-testid="course-detail-students"]` visible
      8. Click `[data-testid="course-detail-back"]`
      9. Assert `[data-testid="tab-published"]` is active
      10. Take screenshot
    Expected Result: Complete drill-down + back with filter preserved
    Failure Indicators: Navigation broken, filter lost
    Evidence: .sisyphus/evidence/task-5-full-roundtrip.png

  Scenario: Consultation menus unaffected
    Tool: Playwright (playwright skill)
    Preconditions: Page loaded at /creator-studio
    Steps:
      1. Click `[data-testid="sidebar-consultation-scheduler"]` → assert heading visible
      2. Click `[data-testid="sidebar-consultation-notifications"]` → assert heading visible
      3. Click `[data-testid="sidebar-available-time-settings"]` → assert heading visible
      4. Click `[data-testid="sidebar-consultation-room"]` → assert heading visible
      5. Click `[data-testid="sidebar-ai-consultation-history"]` → assert heading visible
    Expected Result: All 5 consultation sections still work
    Failure Indicators: Any section broken or missing
    Evidence: .sisyphus/evidence/task-5-consultation-check.png

  Scenario: Mobile sidebar behavior
    Tool: Playwright (playwright skill)
    Preconditions: Page at /creator-studio with viewport 375x812
    Steps:
      1. Assert sidebar hidden
      2. Click SidebarTrigger
      3. Assert sidebar appears as Sheet
      4. Click 강의 관리
      5. Assert content loads
    Expected Result: Mobile sidebar works correctly
    Failure Indicators: Sidebar always visible, Sheet broken
    Evidence: .sisyphus/evidence/task-5-mobile.png
  ```

  **Commit**: YES (single atomic commit for all tasks)
  - Message: `refactor(creator-studio): consolidate course menus — merge create/progress into management with detail view`
  - Files: All modified + new + deleted files
  - Pre-commit: `cd frontend && npx tsc --noEmit && bun run build && bun test`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `bun run build`. Review all changed/new files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | TypeCheck [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Navigate to `/creator-studio`. Verify: 사이드바 강의 메뉴 2개만, 강의 관리에 새 강의 만들기 버튼 + 초안 목록, 강의 항목 클릭 → 상세 화면, 뒤로가기, 탭 필터 보존. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  Verify only specified files were changed/created/deleted. Check that CourseCreate.tsx and CourseProgress.tsx are deleted. Verify no modifications to CourseSales.tsx, consultation components, or student-facing CourseDetail.tsx. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Single atomic commit** after all tasks pass:
  - Message: `refactor(creator-studio): consolidate course menus — merge create/progress into management with detail view`
  - Files: all modified + new + deleted files
  - Pre-commit: `cd frontend && npx tsc --noEmit && bun run build && bun test`

---

## Success Criteria

### Verification Commands
```bash
cd frontend && npx tsc --noEmit  # Expected: 0 errors
cd frontend && bun run build     # Expected: exit code 0
cd frontend && bun test          # Expected: all tests pass
```

### Final Checklist
- [ ] 사이드바 강의 메뉴 2개만 (강의 관리, 강의 판매)
- [ ] 강의 관리 = 첫 번째 메뉴
- [ ] 강의 관리에 새 강의 만들기 버튼 + 초안 카드 표시
- [ ] 강의 항목 클릭 → 상세 화면 (통계 + 챕터 진행 + 수강생 활동)
- [ ] 뒤로가기 → 목록 (필터 유지)
- [ ] CourseCreate.tsx 삭제됨
- [ ] CourseProgress.tsx 삭제됨
- [ ] 0 new npm dependencies
- [ ] Build passes with zero errors

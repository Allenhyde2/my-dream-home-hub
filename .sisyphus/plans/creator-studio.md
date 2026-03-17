# Creator Studio (크리에이터 도구) — 아웃라인 + 목업 데이터

## TL;DR

> **Quick Summary**: 크리에이터 전용 관리자 페이지(Creator Studio)를 사이드바 레이아웃으로 신규 구축. 강의 4개 + 상담예약 5개 = 총 9개 하위 기능의 아웃라인을 목업 데이터와 함께 개발.
> 
> **Deliverables**:
> - `/creator-studio` 라우트 페이지
> - 사이드바 네비게이션 (강의/상담예약 2그룹, 9개 서브메뉴)
> - 9개 하위 기능 컴포넌트 (목업 데이터 포함)
> - 타입 정의 + 목업 데이터 파일
> - 데이터 검증 테스트
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 → Tasks 2+3 (parallel) → Task 4 → Task 5

---

## Context

### Original Request
크리에이터 도구 화면을 새 파일에서 생성. 크리에이터 전용 관리자 페이지로 강의와 상담 예약을 관리.
- 강의 메뉴: 강의 개설, 강의 판매, 강의 진행, 강의 관리
- 상담예약 메뉴: 상담 예약 스케줄러, 알림, 예약 가능 시간 설정, 상담 전용 화면, AI 상담 이력 관리
- 1차: 아웃라인 + 목업 데이터 수준

### Interview Summary
**Key Discussions**:
- 레이아웃: 사이드바 + 콘텐츠 (사용자 선택)
- 아웃라인 수준: 목업 데이터 포함 (사용자 선택)

**Research Findings**:
- shadcn sidebar 컴포넌트가 `components/ui/sidebar.tsx`에 존재하지만 미사용 상태
- 기존 뷰는 Tabs 패턴이지만, 사용자가 사이드바 레이아웃을 명시적으로 선택
- 라우트 패턴: `app/*/page.tsx` → `nextDynamic(() => import('@/views/*'), { ssr: false })`
- `navigate("/creator-studio")` 링크가 `Index.tsx:171`에 이미 존재
- Course, Creator, ConsultingOption 등 기존 타입 재사용 가능
- Collapsible 컴포넌트로 사이드바 메뉴 그룹 확장/축소 가능

### Metis Review
**Identified Gaps** (addressed):
- SidebarProvider 스코핑: CreatorStudio.tsx 내부로 한정 (root layout 건드리지 않음)
- 파일 크기 폭발 방지: 14개 파일로 분리 (모놀리식 방지)
- 스코프 크립 방지: 각 하위 기능별 "무엇을 만들고/만들지 않을지" 명시
- Collapsible 패턴: Collapsible + SidebarMenuSub 조합 패턴 명시
- 테스트 한계: React 렌더 테스트 불가 (testing-library 미설치), 데이터 검증 + Playwright QA로 대체

---

## Work Objectives

### Core Objective
크리에이터가 강의와 상담 예약을 관리할 수 있는 Creator Studio 페이지의 아웃라인 구조를 사이드바 레이아웃으로 구축한다.

### Concrete Deliverables
- `frontend/src/app/creator-studio/page.tsx` — 라우트 페이지
- `frontend/src/data/creator-studio.ts` — 타입 정의 + 목업 데이터
- `frontend/src/views/CreatorStudio.tsx` — 메인 뷰 (SidebarProvider 포함)
- `frontend/src/views/creator-studio/CreatorStudioSidebar.tsx` — 사이드바 컴포넌트
- `frontend/src/views/creator-studio/CourseCreate.tsx` — 강의 개설
- `frontend/src/views/creator-studio/CourseSales.tsx` — 강의 판매
- `frontend/src/views/creator-studio/CourseProgress.tsx` — 강의 진행
- `frontend/src/views/creator-studio/CourseManagement.tsx` — 강의 관리
- `frontend/src/views/creator-studio/ConsultationScheduler.tsx` — 상담 예약 스케줄러
- `frontend/src/views/creator-studio/ConsultationNotifications.tsx` — 알림
- `frontend/src/views/creator-studio/AvailableTimeSettings.tsx` — 예약 가능 시간 설정
- `frontend/src/views/creator-studio/ConsultationRoom.tsx` — 상담 전용 화면
- `frontend/src/views/creator-studio/AIConsultationHistory.tsx` — AI 상담 이력 관리
- `frontend/src/__tests__/creator-studio.test.ts` — 데이터 검증 테스트

### Definition of Done
- [ ] `cd frontend && npx tsc --noEmit` — 0 errors
- [ ] `cd frontend && bun run build` — exit code 0
- [ ] 브라우저에서 `/creator-studio` 접속 시 사이드바 + 콘텐츠 정상 렌더
- [ ] 사이드바의 9개 메뉴 클릭 시 각 섹션 콘텐츠로 전환
- [ ] 모든 하위 기능에 목업 데이터가 표시됨

### Must Have
- SidebarProvider는 CreatorStudio.tsx 내부에만 존재 (root layout 미수정)
- 사이드바 2개 그룹: 강의(4개 서브메뉴) + 상담예약(5개 서브메뉴)
- Collapsible로 그룹 확장/축소
- 모든 interactive 요소에 `data-testid` 속성
- 한국어 UI 텍스트 (기존 앱과 일관성)
- Back navigation to `/` in sidebar header
- 각 하위 기능 컴포넌트 150줄 이하

### Must NOT Have (Guardrails)
- ❌ 기존 파일 수정 금지 (Index.tsx, CreatorProfile.tsx, layout.tsx, providers.tsx 등)
- ❌ 새 npm 의존성 추가 금지 (모든 필요 컴포넌트 이미 설치됨)
- ❌ 작동하는 기능 구현 금지 (폼 제출, API 호출, 상태 변이 = 사이드바 네비게이션 제외)
- ❌ URL 서브라우트 생성 금지 (모두 클라이언트 사이드 state로)
- ❌ 인터랙티브 캘린더, 타임피커, 작동하는 폼 금지
- ❌ React 컴포넌트 렌더 테스트 금지 (testing-library 미설치)
- ❌ AI slop: 과도한 주석, 불필요한 추상화, 빈 catch 블록, console.log

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (bun:test)
- **Automated tests**: YES (Tests-after) — 데이터 구조 검증만
- **Framework**: bun:test
- **React 렌더 테스트**: 불가 (testing-library 미설치)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Build**: Use Bash — `bun run build`, `npx tsc --noEmit`
- **Data**: Use Bash (bun test) — mock data structure validation

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation):
└── Task 1: Create types + mock data file [quick]

Wave 2 (After Wave 1 — sub-feature components, MAX PARALLEL):
├── Task 2: Create 강의 4개 sub-feature components [visual-engineering]
└── Task 3: Create 상담예약 5개 sub-feature components [visual-engineering]

Wave 3 (After Wave 2 — assembly + routing):
└── Task 4: Create Sidebar + Main View + Route page [visual-engineering]

Wave 4 (After Wave 3 — verification):
└── Task 5: Tests + Build + Visual QA [unspecified-high]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 2/3 → Task 4 → Task 5 → F1-F4
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 2 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3 | 1 |
| 2 | 1 | 4 | 2 |
| 3 | 1 | 4 | 2 |
| 4 | 2, 3 | 5 | 3 |
| 5 | 4 | F1-F4 | 4 |
| F1-F4 | 5 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **1 task** — T1 → `quick`
- **Wave 2**: **2 tasks** — T2 → `visual-engineering`, T3 → `visual-engineering`
- **Wave 3**: **1 task** — T4 → `visual-engineering`
- **Wave 4**: **1 task** — T5 → `unspecified-high`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Create Types + Mock Data File (데이터 파일)

  **What to do**:
  - Create `frontend/src/data/creator-studio.ts`
  - Define 8 TypeScript interfaces:
    - `CreatorCourse` — id, title, status ("draft"|"published"|"archived"), price, studentCount, rating, totalRevenue, lastEdited, description, thumbnail
    - `CourseSaleRecord` — courseId, courseTitle, totalRevenue, monthlySales, refundCount, refundRate
    - `CourseProgressRecord` — courseId, courseTitle, totalStudents, completionRate, avgProgress, activeStudents
    - `ConsultationBookingRecord` — id, clientName, date, time, type (productName), status ("confirmed"|"pending"|"completed"|"cancelled"), price
    - `ConsultationNotificationItem` — id, type ("new_booking"|"cancellation"|"reminder"|"review"), message, createdAt, isRead
    - `WeeklyTimeSlot` — day (string, 월~일), startTime, endTime, isActive (boolean)
    - `ConsultationSessionItem` — id, clientName, date, time, status ("waiting"|"in_progress"|"completed"), productName
    - `AIConsultationRecord` — id, clientName, date, summary, sentiment ("positive"|"neutral"|"negative"), keyTopics (string[]), followUpNeeded (boolean)
  - Create mock data arrays (3-5 items each) with realistic Korean data:
    - `mockCreatorCourses`: 5 courses (2 published, 2 draft, 1 archived) with KRW prices
    - `mockCourseSales`: 3 records with revenue data
    - `mockCourseProgress`: 3 records with student progress
    - `mockConsultationBookings`: 5 bookings with mixed statuses
    - `mockNotifications`: 5 notifications with mixed types/read states
    - `mockWeeklySchedule`: 7 items (월~일), 주말은 isActive=false
    - `mockTodaySessions`: 3 sessions for today
    - `mockAIRecords`: 4 records with Korean summaries and key topics
  - Export all types and mock data arrays
  - Export `SECTION_KEYS` constant: array of all 9 section key strings for validation
  - Export type `SectionKey` as union type of all section keys

  **Must NOT do**:
  - Do NOT import from existing data files (courses.ts, creators.ts) — keep self-contained
  - Do NOT create getter functions (unnecessary for mock-only phase)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file creation with straightforward TypeScript types and mock data
  - **Skills**: []
    - No special skills needed for data file creation

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation task)
  - **Parallel Group**: Wave 1 (sole task)
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `frontend/src/data/courses.ts:1-27` — Follow this exact pattern: exported interfaces at top, then exported const arrays with typed mock data, then optional helper functions
  - `frontend/src/data/creators.ts:1-41` — Same pattern: Creator interface + CreatorTag type + exported array

  **API/Type References**:
  - `frontend/src/views/CreatorProfile.tsx:37-53` — ConsultingOption and Reservation interfaces for consultation domain understanding (DO NOT import, just reference for field naming convention)
  - `frontend/src/views/Profile.tsx:47-82` — ConsultationBooking and PurchaseItem interfaces for consumer-side booking model reference

  **WHY Each Reference Matters**:
  - `courses.ts` — Shows the canonical pattern for data files: interfaces → const arrays → helpers. Follow this exact structure.
  - `creators.ts` — Shows how to define union types (CreatorTag) and use them in interfaces. Use same approach for status types.
  - `CreatorProfile.tsx:37-53` — Shows existing consultation-related field names (durationMinutes, slotInterval) to maintain naming consistency
  - `Profile.tsx:47-82` — Shows existing booking status values and purchase types to avoid conflicting naming

  **Acceptance Criteria**:
  - [ ] File created at `frontend/src/data/creator-studio.ts`
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] All 8 interfaces exported
  - [ ] All 8 mock data arrays exported with 3-5 items each
  - [ ] `SECTION_KEYS` and `SectionKey` type exported

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Preconditions: File created at frontend/src/data/creator-studio.ts
    Steps:
      1. Run `cd frontend && npx tsc --noEmit`
      2. Check exit code is 0
    Expected Result: Zero type errors
    Failure Indicators: Non-zero exit code, any "error TS" in output
    Evidence: .sisyphus/evidence/task-1-tsc-check.txt

  Scenario: All exports exist and are non-empty
    Tool: Bash (bun)
    Preconditions: File created
    Steps:
      1. Run `cd frontend && bun -e "const d = require('./src/data/creator-studio'); console.log(JSON.stringify({courses: d.mockCreatorCourses?.length, sales: d.mockCourseSales?.length, progress: d.mockCourseProgress?.length, bookings: d.mockConsultationBookings?.length, notifications: d.mockNotifications?.length, schedule: d.mockWeeklySchedule?.length, sessions: d.mockTodaySessions?.length, aiRecords: d.mockAIRecords?.length, sectionKeys: d.SECTION_KEYS?.length}))"`
      2. Assert all counts are >= 3
    Expected Result: {"courses":5,"sales":3,"progress":3,"bookings":5,"notifications":5,"schedule":7,"sessions":3,"aiRecords":4,"sectionKeys":9}
    Failure Indicators: Any count is 0, undefined, or missing
    Evidence: .sisyphus/evidence/task-1-exports-check.txt
  ```

  **Commit**: YES (groups with all tasks — single atomic commit at end)
  - Message: `feat(creator-studio): add Creator Studio page with sidebar nav and mock data`
  - Files: `frontend/src/data/creator-studio.ts`

- [x] 2. Create 강의 Sub-Feature Components (4 files)

  **What to do**:
  - Create `frontend/src/views/creator-studio/` directory
  - Create 4 component files, each following the pattern below:

  **CourseCreate.tsx (강의 개설)**:
  - Import mock data from `@/data/creator-studio`
  - Header: "강의 개설" title with PlusCircle icon
  - Card with disabled "새 강의 만들기" Button (disabled + placeholder)
  - Table/card list of 2-3 draft courses from `mockCreatorCourses` (filtered to status="draft")
  - Each row shows: title, status Badge (초안), lastEdited date
  - NO course creation form, NO file upload, NO rich text editor, NO step wizard

  **CourseSales.tsx (강의 판매)**:
  - Import mock data from `@/data/creator-studio`
  - 3 summary stat cards at top: 총 매출 (formatted KRW), 이번 달 매출, 환불률 (percentage)
  - Below: table of `mockCourseSales` records with columns: 강의명, 총 매출, 월 매출, 환불 건수
  - Use Card component for stat cards, Table for data
  - NO revenue charts, NO date range picker, NO export, NO recharts

  **CourseProgress.tsx (강의 진행)**:
  - Import mock data from `@/data/creator-studio`
  - Cards/table showing `mockCourseProgress` records: 강의명, 수강생 수, 완료율 (Progress bar), 평균 진행률, 활성 수강생
  - Use shadcn Progress component for completion rate bars
  - NO individual student drill-down, NO progress updates

  **CourseManagement.tsx (강의 관리)**:
  - Import mock data from `@/data/creator-studio`
  - useState for activeFilter (default: "all")
  - Tabs to filter by status: 전체, 초안, 게시됨, 보관
  - Table of `mockCreatorCourses` with: title, status Badge (draft=gray, published=green, archived=orange), price, studentCount, rating
  - Filter courses by activeFilter state
  - NO edit/delete buttons, NO drag-and-drop, NO bulk actions, NO search

  **Common patterns for all 4 files**:
  - `"use client"` at top
  - Default export: `export default function ComponentName()`
  - Each receives no props (data imported directly from mock)
  - Use Card, CardContent, CardHeader, CardTitle from `@/components/ui/card`
  - Use Badge from `@/components/ui/badge`
  - Use Table components where appropriate
  - `data-testid` on all interactive elements and key display elements
  - Korean text for all labels
  - Each file under 150 lines

  **Must NOT do**:
  - Do NOT create working forms, buttons that perform actions, or modals
  - Do NOT import from `@/data/courses.ts` — only from `@/data/creator-studio`
  - Do NOT add any API calls or state mutations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component creation with layout, styling, data display
  - **Skills**: []
    - No special skills needed — shadcn components are straightforward

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 4
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `frontend/src/views/MyCourses.tsx:80-200` — View structure pattern: header + main content with cards/badges. Follow the Card + Badge composition for course display.
  - `frontend/src/views/PurchaseHistory.tsx:1-100` — Shows Tab-based filtering pattern (전체/강의/상담/콘텐츠) — use similar approach for CourseManagement status filter tabs
  - `frontend/src/views/Profile.tsx:240-349` — Shows Card list rendering pattern with icons, badges, and action buttons

  **API/Type References**:
  - `frontend/src/data/creator-studio.ts` (Task 1 output) — All types and mock data arrays
  - `frontend/src/components/ui/card.tsx` — Card, CardContent, CardHeader, CardTitle
  - `frontend/src/components/ui/badge.tsx` — Badge with variant prop
  - `frontend/src/components/ui/tabs.tsx` — Tabs, TabsList, TabsTrigger, TabsContent
  - `frontend/src/components/ui/progress.tsx` — Progress component for CourseProgress
  - `frontend/src/components/ui/table.tsx` — Table, TableBody, TableCell, TableHead, TableHeader, TableRow
  - `frontend/src/components/ui/button.tsx` — Button with disabled state

  **WHY Each Reference Matters**:
  - `MyCourses.tsx` — Shows the exact Card + Badge composition used elsewhere in the app. Copy this pattern for consistent look.
  - `PurchaseHistory.tsx` — Shows how to implement tab-based filtering (Tabs with controlled state, filtering arrays). Apply to CourseManagement's status filter.
  - `Profile.tsx:240-349` — Shows how to render a list of items with icons, badges, descriptions in Cards. Use for all 4 components.
  - `table.tsx` — shadcn Table components. Use for CourseSales and CourseProgress data display.
  - `progress.tsx` — shadcn Progress bar. Use for CourseProgress completion rate visualization.

  **Acceptance Criteria**:
  - [ ] 4 files created in `frontend/src/views/creator-studio/`
  - [ ] Each file has `"use client"` and default export
  - [ ] Each file imports from `@/data/creator-studio`
  - [ ] Each file under 150 lines
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] CourseManagement has working tab filter (client-side state only)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: All 4 files created with correct exports
    Tool: Bash
    Preconditions: Task 1 completed
    Steps:
      1. Run `ls -la frontend/src/views/creator-studio/Course*.tsx`
      2. Verify 4 files: CourseCreate.tsx, CourseSales.tsx, CourseProgress.tsx, CourseManagement.tsx
      3. Run `cd frontend && npx tsc --noEmit`
    Expected Result: 4 files present, zero TypeScript errors
    Failure Indicators: Missing files, type errors
    Evidence: .sisyphus/evidence/task-2-files-check.txt

  Scenario: File size under 150 lines each
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run `wc -l frontend/src/views/creator-studio/Course*.tsx`
      2. Assert each file is under 150 lines
    Expected Result: All 4 files under 150 lines
    Failure Indicators: Any file over 150 lines
    Evidence: .sisyphus/evidence/task-2-linecount.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 3. Create 상담예약 Sub-Feature Components (5 files)

  **What to do**:
  - Create 5 component files in `frontend/src/views/creator-studio/`:

  **ConsultationScheduler.tsx (상담 예약 스케줄러)**:
  - Import `mockConsultationBookings` from `@/data/creator-studio`
  - Header: "상담 예약 스케줄러" title with CalendarDays icon
  - Table of 5 upcoming bookings: 고객명, 날짜, 시간, 상담 유형, 상태
  - Status badges: confirmed=green, pending=yellow, completed=gray, cancelled=red
  - NO interactive calendar, NO drag-to-reschedule, NO booking confirmation actions

  **ConsultationNotifications.tsx (알림)**:
  - Import `mockNotifications` from `@/data/creator-studio`
  - Header: "알림" title with Bell icon
  - List of 5 notification items with type-specific icons:
    - new_booking → Calendar icon, blue
    - cancellation → XCircle icon, red
    - reminder → Bell icon, yellow
    - review → Star icon, purple
  - Unread items with left border highlight (border-l-4 border-primary) or subtle background
  - Show relative time (date-fns format 가능)
  - NO mark-as-read functionality, NO real-time updates

  **AvailableTimeSettings.tsx (예약 가능 시간 설정)**:
  - Import `mockWeeklySchedule` from `@/data/creator-studio`
  - Header: "예약 가능 시간 설정" title with Clock icon
  - Grid/table showing weekly schedule (월~일 rows)
  - Each row: 요일 label, 시작 시간, 종료 시간, 활성/비활성 Badge
  - Active days: green badge "운영", inactive days: gray badge "휴무"
  - NO working time picker, NO Switch toggles, NO save button

  **ConsultationRoom.tsx (상담 전용 화면)**:
  - Import `mockTodaySessions` from `@/data/creator-studio`
  - Header: "상담 전용 화면" title with Video icon
  - Large placeholder card with Video icon + "화상 상담을 진행합니다" description text
  - Below: card list of 3 today's sessions: 고객명, 시간, 상태 Badge
  - Disabled "입장" buttons (Button disabled prop)
  - NO video call, NO WebRTC, NO chat interface

  **AIConsultationHistory.tsx (AI 상담 이력 관리)**:
  - Import `mockAIRecords` from `@/data/creator-studio`
  - Header: "AI 상담 이력 관리" title with Brain/Sparkles icon
  - Table/card list of 4 past records: 고객명, 날짜, AI 요약 (truncated), 감정 Badge, 주요 토픽 (Badge tags), 후속 조치 필요 여부
  - Sentiment badges: positive=green, neutral=gray, negative=red
  - Key topics as small Badge components
  - NO AI interface, NO summary generation, NO filtering

  **Common patterns** (same as Task 2):
  - `"use client"`, default export, Korean text, data-testid, under 150 lines each

  **Must NOT do**:
  - Do NOT implement working functionality (no real-time, no AI, no video)
  - Do NOT add interactive calendars or working forms
  - Do NOT import from existing data files

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component creation with cards, tables, badges, icons
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 2)
  - **Blocks**: Task 4
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `frontend/src/views/MyCourses.tsx:80-200` — Card + Badge composition pattern for list displays
  - `frontend/src/views/MyReservations.tsx:1-100` — Reservation display pattern with status badges and action buttons
  - `frontend/src/views/Profile.tsx:296-339` — Consultation booking card pattern with Avatar, Badge, Calendar icon, time display
  - `frontend/src/views/Notifications.tsx` — If it exists, check for notification display patterns

  **API/Type References**:
  - `frontend/src/data/creator-studio.ts` (Task 1 output) — ConsultationBookingRecord, ConsultationNotificationItem, WeeklyTimeSlot, ConsultationSessionItem, AIConsultationRecord
  - `frontend/src/components/ui/table.tsx` — Table components for scheduler and AI history
  - `frontend/src/components/ui/badge.tsx` — Status badges with various colors
  - `frontend/src/components/ui/button.tsx` — Disabled buttons for ConsultationRoom

  **External References**:
  - `date-fns` (already installed v3.6.0) — Use `formatDistanceToNow` for relative time in notifications

  **WHY Each Reference Matters**:
  - `MyReservations.tsx` — Shows reservation display with status badges — directly applicable to ConsultationScheduler
  - `Profile.tsx:296-339` — Shows consultation card with creator avatar, badge, time, action buttons — similar structure for ConsultationRoom sessions
  - `date-fns` — Already installed, use for formatting relative time in notifications ("3시간 전" etc.)

  **Acceptance Criteria**:
  - [ ] 5 files created in `frontend/src/views/creator-studio/`
  - [ ] Each file has `"use client"` and default export
  - [ ] Each file imports from `@/data/creator-studio`
  - [ ] Each file under 150 lines
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: All 5 files created with correct exports
    Tool: Bash
    Preconditions: Task 1 completed
    Steps:
      1. Run `ls -la frontend/src/views/creator-studio/Consultation*.tsx frontend/src/views/creator-studio/Available*.tsx frontend/src/views/creator-studio/AI*.tsx`
      2. Verify 5 files exist
      3. Run `cd frontend && npx tsc --noEmit`
    Expected Result: 5 files present, zero TypeScript errors
    Failure Indicators: Missing files, type errors
    Evidence: .sisyphus/evidence/task-3-files-check.txt

  Scenario: File size under 150 lines each
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run `wc -l frontend/src/views/creator-studio/Consultation*.tsx frontend/src/views/creator-studio/Available*.tsx frontend/src/views/creator-studio/AI*.tsx`
      2. Assert each file under 150 lines
    Expected Result: All 5 files under 150 lines
    Failure Indicators: Any file over 150 lines
    Evidence: .sisyphus/evidence/task-3-linecount.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 4. Create Sidebar + Main View + Route Page (3 files)

  **What to do**:

  **A) CreatorStudioSidebar.tsx (사이드바 컴포넌트)**:
  - Create `frontend/src/views/creator-studio/CreatorStudioSidebar.tsx`
  - Import sidebar components from `@/components/ui/sidebar`: Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarHeader, SidebarFooter, SidebarRail
  - Import Collapsible, CollapsibleTrigger, CollapsibleContent from `@/components/ui/collapsible`
  - Import lucide-react icons: BookOpen (강의), CalendarDays (상담예약), ChevronDown, ArrowLeft, Home, Palette
  - Import `SectionKey` type from `@/data/creator-studio`
  - Props: `{ activeSection: SectionKey; onSectionChange: (section: SectionKey) => void }`
  - SidebarHeader: app logo/title "크리에이터 스튜디오" + back button to navigate("/")
  - SidebarContent with 2 Collapsible groups:
    - **강의 그룹** (defaultOpen): Collapsible wrapping SidebarMenuItem
      - CollapsibleTrigger with SidebarMenuButton: BookOpen icon + "강의" + ChevronDown
      - CollapsibleContent with SidebarMenuSub containing 4 SidebarMenuSubItem:
        - 강의 개설 (key: "course-create")
        - 강의 판매 (key: "course-sales")
        - 강의 진행 (key: "course-progress")
        - 강의 관리 (key: "course-management")
    - **상담예약 그룹** (defaultOpen): Same Collapsible pattern
      - CalendarDays icon + "상담예약" + ChevronDown
      - 5 sub-items:
        - 상담 예약 스케줄러 (key: "consultation-scheduler")
        - 알림 (key: "consultation-notifications")
        - 예약 가능 시간 설정 (key: "available-time-settings")
        - 상담 전용 화면 (key: "consultation-room")
        - AI 상담 이력 관리 (key: "ai-consultation-history")
  - Each SidebarMenuSubButton: `isActive={activeSection === key}`, `onClick={() => onSectionChange(key)}`
  - data-testid on each sub-button: `data-testid="sidebar-{key}"`
  - SidebarRail at the end (enables keyboard collapse Ctrl+B)
  - SidebarFooter: "홈으로 돌아가기" link or small "v1.0" label

  **B) CreatorStudio.tsx (메인 뷰)**:
  - Create `frontend/src/views/CreatorStudio.tsx`
  - `"use client"` at top
  - Import SidebarProvider, SidebarInset, SidebarTrigger from `@/components/ui/sidebar`
  - Import CreatorStudioSidebar from `./creator-studio/CreatorStudioSidebar`
  - Import all 9 sub-feature components from `./creator-studio/*`
  - Import `SectionKey` type from `@/data/creator-studio`
  - useState: `activeSection: SectionKey` with default `"course-management"`
  - Render structure:
    ```
    <SidebarProvider>
      <CreatorStudioSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <SidebarInset>
        <header> (sticky, with SidebarTrigger + current section title) </header>
        <main> {renderContent()} </main>
      </SidebarInset>
    </SidebarProvider>
    ```
  - `renderContent()` switch on activeSection → renders corresponding sub-feature component
  - Header inside SidebarInset: SidebarTrigger (hamburger menu) + Separator + breadcrumb showing current section name
  - Follow shadcn sidebar layout pattern: `flex min-h-svh w-full`

  **C) Route page**:
  - Create `frontend/src/app/creator-studio/page.tsx`
  - Follow exact pattern from `app/my-courses/page.tsx`:
    ```tsx
    'use client';
    import nextDynamic from 'next/dynamic';
    const CreatorStudioPage = nextDynamic(() => import('@/views/CreatorStudio'), { ssr: false });
    export default function Page() {
      return <CreatorStudioPage />;
    }
    ```

  **Must NOT do**:
  - Do NOT add SidebarProvider to root layout or providers.tsx
  - Do NOT create URL sub-routes
  - Do NOT modify any existing files
  - Do NOT add complex animations or transitions between sections

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex layout composition with sidebar, responsive design, component orchestration
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sole task)
  - **Blocks**: Task 5
  - **Blocked By**: Tasks 2, 3

  **References**:

  **Pattern References**:
  - `frontend/src/components/ui/sidebar.tsx:612-637` — All available sidebar exports: SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarInset, SidebarHeader, SidebarFooter, SidebarTrigger, SidebarRail, useSidebar
  - `frontend/src/components/ui/collapsible.tsx:1-9` — Collapsible, CollapsibleTrigger, CollapsibleContent from @radix-ui/react-collapsible
  - `frontend/src/app/my-courses/page.tsx:1-10` — Route page pattern: "use client" + nextDynamic + ssr:false + default export function Page()
  - `frontend/src/views/MyCourses.tsx:80-92` — Header pattern: sticky top-0 z-50 bg-background/95 backdrop-blur border-b

  **API/Type References**:
  - `frontend/src/data/creator-studio.ts:SectionKey` — Union type for activeSection state
  - `frontend/src/hooks/use-navigate.ts` — useNavigate for back navigation
  - `frontend/src/hooks/use-mobile.tsx` — Already used internally by sidebar (auto mobile Sheet behavior)

  **External References**:
  - shadcn sidebar docs: The Collapsible + SidebarMenu composition pattern:
    ```tsx
    <Collapsible defaultOpen>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Icon /> <span>Group Label</span> <ChevronDown />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton isActive={...} onClick={...}>
                Sub Item
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
    ```

  **WHY Each Reference Matters**:
  - `sidebar.tsx:612-637` — CRITICAL: lists all available exports. Must use exact names, no guessing.
  - `collapsible.tsx` — Required for expandable menu groups. Without this, sidebar items won't collapse/expand.
  - `my-courses/page.tsx` — MUST follow this exact route page pattern (double "use client" quirk, nextDynamic with ssr:false)
  - shadcn Collapsible pattern — The EXACT composition of Collapsible + SidebarMenu components. If wrong, sidebar won't work.

  **Acceptance Criteria**:
  - [ ] 3 files created: `CreatorStudioSidebar.tsx`, `CreatorStudio.tsx`, `app/creator-studio/page.tsx`
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] `cd frontend && bun run build` → exit code 0
  - [ ] SidebarProvider is ONLY inside CreatorStudio.tsx (not in root layout)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Build passes with all 14 files
    Tool: Bash
    Preconditions: All tasks 1-4 files created
    Steps:
      1. Run `cd frontend && bun run build`
      2. Check exit code is 0
    Expected Result: Build completes with exit code 0
    Failure Indicators: Non-zero exit code, build errors
    Evidence: .sisyphus/evidence/task-4-build.txt

  Scenario: Page loads and sidebar renders
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running (`cd frontend && bun run dev`)
    Steps:
      1. Navigate to `http://localhost:3000/creator-studio`
      2. Wait for page to fully load (timeout: 10s)
      3. Assert sidebar is visible: `[data-testid="sidebar-course-management"]` exists
      4. Assert "크리에이터 스튜디오" text is visible in sidebar
      5. Assert default content section "강의 관리" is displayed
      6. Take screenshot
    Expected Result: Page renders with sidebar on left, content on right, "강의 관리" section active
    Failure Indicators: 404 error, blank page, sidebar not rendering, wrong default section
    Evidence: .sisyphus/evidence/task-4-page-load.png

  Scenario: Sidebar navigation works for all 9 sections
    Tool: Playwright (playwright skill)
    Preconditions: Page loaded at /creator-studio
    Steps:
      1. Click `[data-testid="sidebar-course-create"]` → assert "강의 개설" heading visible
      2. Click `[data-testid="sidebar-course-sales"]` → assert "강의 판매" heading visible
      3. Click `[data-testid="sidebar-course-progress"]` → assert "강의 진행" heading visible
      4. Click `[data-testid="sidebar-course-management"]` → assert "강의 관리" heading visible
      5. Click `[data-testid="sidebar-consultation-scheduler"]` → assert "상담 예약 스케줄러" heading visible
      6. Click `[data-testid="sidebar-consultation-notifications"]` → assert "알림" heading visible
      7. Click `[data-testid="sidebar-available-time-settings"]` → assert "예약 가능 시간 설정" heading visible
      8. Click `[data-testid="sidebar-consultation-room"]` → assert "상담 전용 화면" heading visible
      9. Click `[data-testid="sidebar-ai-consultation-history"]` → assert "AI 상담 이력 관리" heading visible
      10. Take final screenshot
    Expected Result: All 9 sections switch correctly when sidebar items are clicked
    Failure Indicators: Click not working, wrong content displayed, missing heading text
    Evidence: .sisyphus/evidence/task-4-nav-test.png

  Scenario: SidebarProvider not in root layout
    Tool: Bash
    Preconditions: All files created
    Steps:
      1. Run `grep -r "SidebarProvider" frontend/src/app/layout.tsx frontend/src/app/providers.tsx`
      2. Assert no matches found
      3. Run `grep "SidebarProvider" frontend/src/views/CreatorStudio.tsx`
      4. Assert match found
    Expected Result: SidebarProvider only in CreatorStudio.tsx, not in root layout
    Failure Indicators: SidebarProvider found in layout.tsx or providers.tsx
    Evidence: .sisyphus/evidence/task-4-sidebar-scope.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 5. Tests + Build Verification + Visual QA

  **What to do**:
  - Create `frontend/src/__tests__/creator-studio.test.ts`
  - Write bun:test tests for data validation:
    - Test all mock arrays are non-empty (length > 0)
    - Test all SECTION_KEYS are valid strings
    - Test mock data has required fields (spot check: first item of each array)
    - Test status values are valid for each type
    - Test price/count fields are positive numbers
    - Test Korean text exists in relevant fields
  - Run full build verification: `npx tsc --noEmit && bun run build && bun test`
  - Run Playwright visual QA:
    - Navigate to `/creator-studio`
    - Verify sidebar renders
    - Click through all 9 sections
    - Verify mock data is visible in each section
    - Test mobile viewport (resize to 375px width) — sidebar should become Sheet
    - Take screenshots of each section

  **Must NOT do**:
  - Do NOT write React component render tests (no testing-library)
  - Do NOT test implementation details
  - Do NOT create integration tests that require API

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Testing, build verification, and Playwright QA — requires tool orchestration across multiple domains
  - **Skills**: [`playwright`]
    - `playwright`: Required for browser-based visual QA, screenshot capture, mobile viewport testing

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sole task)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `frontend/src/__tests__/example.test.ts:1-6` — Existing test pattern: `import { test, expect } from "bun:test"` + `test("name", () => { ... })`

  **API/Type References**:
  - `frontend/src/data/creator-studio.ts` — All exports to validate

  **WHY Each Reference Matters**:
  - `example.test.ts` — Shows the exact bun:test import and assertion pattern. Must match.

  **Acceptance Criteria**:
  - [ ] Test file created at `frontend/src/__tests__/creator-studio.test.ts`
  - [ ] `cd frontend && bun test` → all tests pass
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] `cd frontend && bun run build` → exit code 0
  - [ ] Playwright screenshots captured for all 9 sections + mobile viewport

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: All tests pass
    Tool: Bash
    Preconditions: Test file and all source files created
    Steps:
      1. Run `cd frontend && bun test`
      2. Check all tests pass
    Expected Result: All tests pass, exit code 0
    Failure Indicators: Test failures, non-zero exit code
    Evidence: .sisyphus/evidence/task-5-test-results.txt

  Scenario: Full build pipeline passes
    Tool: Bash
    Preconditions: All files created
    Steps:
      1. Run `cd frontend && npx tsc --noEmit && bun run build`
      2. Check exit code is 0
    Expected Result: TypeScript + Build both pass
    Failure Indicators: Type errors, build errors
    Evidence: .sisyphus/evidence/task-5-build-pipeline.txt

  Scenario: Mobile viewport — sidebar becomes Sheet
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to `http://localhost:3000/creator-studio` with viewport 375x812
      2. Assert sidebar is NOT visible as a fixed panel
      3. Find and click the SidebarTrigger button (hamburger menu)
      4. Assert sidebar appears as a slide-out Sheet/drawer
      5. Click a menu item in the sheet
      6. Assert content changes and sheet closes
      7. Take screenshot
    Expected Result: On mobile, sidebar is hidden by default, appears as Sheet when triggered
    Failure Indicators: Sidebar always visible on mobile, Sheet doesn't open, navigation broken
    Evidence: .sisyphus/evidence/task-5-mobile-sidebar.png

  Scenario: All sections show mock data
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at desktop viewport
    Steps:
      1. Navigate to `/creator-studio`
      2. For each of 9 sections, click sidebar item and verify non-empty content:
         - course-create: assert text "초안" badge visible (draft courses)
         - course-sales: assert text "총 매출" visible
         - course-progress: assert progress bar element visible
         - course-management: assert text "전체" tab visible
         - consultation-scheduler: assert table row with client name visible
         - consultation-notifications: assert notification item visible
         - available-time-settings: assert "월" (Monday) text visible
         - consultation-room: assert "화상 상담" text visible
         - ai-consultation-history: assert "AI" or "감정" text visible
      3. Take screenshot per section
    Expected Result: All 9 sections display mock data, no empty states
    Failure Indicators: Empty content, missing mock data, broken rendering
    Evidence: .sisyphus/evidence/task-5-section-{name}.png (9 screenshots)
  ```

  **Commit**: YES (groups with all tasks — single atomic commit)
  - Message: `feat(creator-studio): add Creator Studio page with sidebar nav and mock data`
  - Files: All 14 new files
  - Pre-commit: `cd frontend && npx tsc --noEmit && bun run build && bun test`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `bun run build`. Review all 14 new files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Each sub-feature component must be under 150 lines.
  Output: `Build [PASS/FAIL] | TypeCheck [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Navigate to `/creator-studio`. Verify: sidebar renders with 2 groups (강의/상담예약), all 9 sub-menus are clickable, each switches content area, all mock data visible, back button works. Test mobile viewport (sidebar becomes Sheet). Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each of the 14 new files: verify it was created. For each "Must NOT Have": search for violations (no existing file modifications, no npm deps added, no working forms, no API calls). Check that no files outside the specified list were created or modified. Verify git diff shows only new files.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Single atomic commit** after all tasks pass:
  - Message: `feat(creator-studio): add Creator Studio page with sidebar nav and mock data`
  - Files: 14 new files (see Concrete Deliverables)
  - Pre-commit: `cd frontend && npx tsc --noEmit && bun run build`

---

## Success Criteria

### Verification Commands
```bash
cd frontend && npx tsc --noEmit  # Expected: 0 errors
cd frontend && bun run build     # Expected: exit code 0
cd frontend && bun test          # Expected: all tests pass
```

### Final Checklist
- [ ] All 14 files created
- [ ] SidebarProvider scoped inside CreatorStudio.tsx only
- [ ] 0 existing files modified
- [ ] 0 new npm dependencies
- [ ] All 9 sub-features render with mock data
- [ ] Sidebar navigation works (group collapse/expand + section switching)
- [ ] Back button navigates to /
- [ ] All interactive elements have data-testid
- [ ] Build passes with zero errors

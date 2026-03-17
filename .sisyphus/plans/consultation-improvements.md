# Creator Studio 상담예약 메뉴 대폭 개선

## TL;DR

> **Quick Summary**: Creator Studio 상담예약 4개 메뉴를 대폭 개선 — 캘린더 스케줄러, 알림→메인 페이지 이동, 스케줄러↔상담실 연동, AI 이력 검색/필터/상세 화면.
> 
> **Deliverables**:
> - 월간 캘린더 UI + 검색/필터 예약 목록 스케줄러
> - 메인 페이지 알림 모달에 "상담" 탭 추가 (사이드바에서 알림 메뉴 삭제)
> - 스케줄러에서 예약 클릭 → 상담 전용 화면으로 전환
> - AI 상담 이력 12개+ 목록 + 검색/필터 + 상세 화면 (리포트 스타일)
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 5 waves
> **Critical Path**: T1 → T2/T3/T4 → T5/T7 → T6 → T8

---

## Context

### Original Request
크리에이터 스튜디오 상담예약 메뉴 개선:
- 스케줄러: 상단 캘린더 + 하단 검색/필터 예약 목록
- 알림: 메인 페이지 알림 모달에 "상담" 탭 추가, 사이드바에서 삭제
- 상담 전용 화면: 스케줄러와 연동 (항목 클릭→상담 화면)
- AI 이력: 리스트 확장 + 검색/필터 + ConsultationReport 참고 상세 화면

### Interview Summary
- 캘린더: 시각적 월간 캘린더 UI (작동하는 달력 + 목업 데이터)
- 알림: 크리에이터 스튜디오 사이드바에서 삭제
- AI 상세: 콘텐츠 영역 교체 (강의 상세와 동일 패턴)

### Metis Review
**Critical Findings**:
- `react-day-picker` v8 + `date-fns` v3 + shadcn `Calendar` 이미 설치됨. 한국어 locale(`ko`) 사용 가능.
- 크로스 섹션 상태 전달 필요: `CreatorStudio.tsx`에 `selectedSession` state 추가, `onNavigateToRoom` 콜백 전달
- NotificationModal과 creator-studio는 **별도 데이터 시스템** — "상담" 탭은 자체 렌더링 로직으로 구현
- `ConsultationBookingRecord`와 `ConsultationSessionItem`은 별도 ID 체계 — booking 데이터를 직접 전달
- 캘린더 의미 있는 표시를 위해 예약 데이터를 Feb/Mar/Apr 2026 3개월에 분산

---

## Work Objectives

### Core Objective
상담예약 메뉴를 실용적 관리 도구 수준으로 개선하고, 알림을 메인 페이지로 통합한다.

### Concrete Deliverables
- `frontend/src/data/creator-studio.ts` — mock data 확장 (예약 15개+, AI 12개+), 새 인터페이스, SECTION_KEYS 업데이트
- `frontend/src/views/creator-studio/ConsultationScheduler.tsx` — 캘린더 + 필터 목록으로 전면 개편
- `frontend/src/views/creator-studio/ConsultationRoom.tsx` — 선택된 세션 표시 기능 추가
- `frontend/src/views/creator-studio/AIConsultationHistory.tsx` — 검색/필터 + 상세 드릴다운
- `frontend/src/views/creator-studio/AIConsultationDetail.tsx` — 신규: AI 상담 상세 화면
- `frontend/src/components/NotificationModal.tsx` — 탭 구조 ("알림" + "상담")
- `frontend/src/views/creator-studio/CreatorStudioSidebar.tsx` — 알림 메뉴 제거
- `frontend/src/views/CreatorStudio.tsx` — selectedSession state, 콜백, import 정리
- `frontend/src/__tests__/creator-studio.test.ts` — 테스트 업데이트
- DELETE: `frontend/src/views/creator-studio/ConsultationNotifications.tsx`

### Definition of Done
- [ ] `cd frontend && npx tsc --noEmit` → 0 errors (bun:test 제외)
- [ ] `cd frontend && bun run build` → exit code 0
- [ ] `cd frontend && bun test` → all pass
- [ ] 사이드바 상담예약에 4개 메뉴 (스케줄러, 시간설정, 상담화면, AI이력)
- [ ] 스케줄러: 캘린더 + 검색 + 필터 목록 정상 렌더
- [ ] 메인 페이지 알림 모달에 "상담" 탭 존재
- [ ] 스케줄러→상담 전용 화면 전환 동작
- [ ] AI 이력: 검색/필터 + 상세 화면 동작

### Must Have
- 월간 캘린더: shadcn Calendar 컴포넌트 사용, 예약 있는 날짜에 dot 표시, 클릭→필터
- 예약 목록: 검색(클라이언트명) + 상태 필터(전체/확정/대기/완료/취소)
- NotificationModal 탭: "알림"(기본) + "상담" — 상담 탭에 ConsultationNotificationItem 표시
- 스케줄러→상담실: `onNavigateToRoom` 콜백으로 섹션 전환 + 선택된 세션 데이터 전달
- AI 이력 12개+ 목록, 검색(클라이언트명/키워드), 감정 필터, 후속조치 필터
- AI 상세: ConsultationReport 스타일 Card 섹션 레이아웃 (요약, 핵심 포인트, 추천, 실행 항목)
- 모든 interactive 요소에 data-testid
- 한국어 UI

### Must NOT Have (Guardrails)
- ❌ 새 npm 의존성 금지 — Calendar, date-fns 이미 설치됨
- ❌ 실제 기능 구현 금지 (API, WebRTC, booking CRUD, 알림 읽음 토글)
- ❌ URL 라우팅 금지 — 모든 전환은 state 기반
- ❌ AvailableTimeSettings, CourseSales, CourseManagement 수정 금지
- ❌ `@/data/notifications.ts`의 Notification 타입 수정 금지
- ❌ debounce/복잡한 검색 로직 금지 — 단순 includes() 필터
- ❌ 50개 이상 mock 데이터 금지 — 합리적 범위 유지
- ❌ AI slop: 과도한 주석, 불필요한 추상화, console.log

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (bun:test)
- **Automated tests**: YES (Tests-after)
- **Framework**: bun:test

### QA Policy
- **Frontend/UI**: Playwright
- **Build**: Bash — `bun run build`, `npx tsc --noEmit`
- **Data**: Bash (bun test)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — data layer):
└── Task 1: Expand mock data + SECTION_KEYS + tests [quick]

Wave 2 (Cleanup + independent components, 3 PARALLEL):
├── Task 2: Remove notification section + sidebar cleanup [quick]
├── Task 3: Create AIConsultationDetail component [visual-engineering]
└── Task 4: NotificationModal consultation tab [visual-engineering]

Wave 3 (Feature rewrites, 2 PARALLEL):
├── Task 5: ConsultationScheduler calendar + filters [visual-engineering]
└── Task 7: AI History search/filter + detail integration [visual-engineering]

Wave 4 (Integration):
└── Task 6: Scheduler→Room cross-section integration [deep]

Wave 5 (Verification):
└── Task 8: Build + Visual QA [unspecified-high]

Wave FINAL (4 parallel):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high)
└── F4: Scope fidelity check (deep)

Critical Path: T1 → T5 → T6 → T8 → F1-F4
Max Concurrent: 3 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2,3,4,5,6,7 | 1 |
| 2 | 1 | 6 | 2 |
| 3 | 1 | 7 | 2 |
| 4 | 1 | 8 | 2 |
| 5 | 1 | 6 | 3 |
| 7 | 1,3 | 8 | 3 |
| 6 | 2,5 | 8 | 4 |
| 8 | 4,6,7 | F1-F4 | 5 |

### Agent Dispatch Summary

- **Wave 1**: T1 → `quick`
- **Wave 2**: T2 → `quick`, T3 → `visual-engineering`, T4 → `visual-engineering`
- **Wave 3**: T5 → `visual-engineering`, T7 → `visual-engineering`
- **Wave 4**: T6 → `deep`
- **Wave 5**: T8 → `unspecified-high` + `playwright`

---

## TODOs

- [x] 1. Expand Mock Data + Update SECTION_KEYS + Tests

  **What to do**:
  - In `frontend/src/data/creator-studio.ts`:
    - Remove `"consultation-notifications"` from SECTION_KEYS (7→6 items)
    - Expand `mockConsultationBookings` from 5→15 entries, spread across Feb/Mar/Apr 2026 for meaningful calendar display
    - Expand `mockAIRecords` from 4→12 entries with diverse Korean client names, varied sentiments, varied topics
    - Add `AIConsultationDetailRecord` interface: `id: number, clientName: string, date: string, duration: string, summary: string, keyPoints: string[], recommendations: string[], actionItems: string[], marketAnalysis?: string, riskFactors?: string[], sentiment: "positive"|"neutral"|"negative", keyTopics: string[]`
    - Add `mockAIConsultationDetails: Record<number, AIConsultationDetailRecord>` — keyed by AI record id, 4-5 detailed entries
    - Keep existing interfaces intact
  - In `frontend/src/__tests__/creator-studio.test.ts`:
    - Update SECTION_KEYS count: 7→6
    - Remove `toContain("consultation-notifications")` assertion
    - Add tests for expanded `mockConsultationBookings` (length >= 10, dates across 3 months)
    - Add tests for expanded `mockAIRecords` (length >= 12)
    - Add tests for `mockAIConsultationDetails` (non-empty, valid fields)

  **Must NOT do**:
  - Do NOT remove `ConsultationNotificationItem` interface or `mockNotifications` (creator-studio one) — needed by NotificationModal
  - Do NOT touch course-related or weekly schedule data

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation)
  - **Wave**: 1
  - **Blocks**: Tasks 2,3,4,5,6,7
  - **Blocked By**: None

  **References**:
  - `frontend/src/data/creator-studio.ts:34-58` — existing ConsultationBookingRecord, ConsultationNotificationItem interfaces
  - `frontend/src/data/creator-studio.ts:68-93` — AIConsultationRecord interface
  - `frontend/src/data/creator-studio.ts:97-105` — current SECTION_KEYS
  - `frontend/src/views/ConsultationReport.tsx:24-38` — ConsultationReport interface (reference for AI detail structure)

  **Acceptance Criteria**:
  - [ ] `cd frontend && bun test` → all pass
  - [ ] SECTION_KEYS has exactly 6 items
  - [ ] `mockConsultationBookings.length >= 10`
  - [ ] `mockAIRecords.length >= 12`
  - [ ] `mockAIConsultationDetails` has 4-5 entries

  **QA Scenarios**:
  ```
  Scenario: Tests pass with updated data
    Tool: Bash
    Steps: cd frontend && bun test
    Expected: All pass
    Evidence: .sisyphus/evidence/task-1-tests.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 2. Remove Notification Section + Sidebar Cleanup

  **What to do**:
  - Delete `frontend/src/views/creator-studio/ConsultationNotifications.tsx`
  - In `CreatorStudio.tsx`: remove import, remove sectionTitles entry, remove switch case for `"consultation-notifications"`
  - In `CreatorStudioSidebar.tsx`: remove `{ key: "consultation-notifications", label: "알림" }` from consultationItems array

  **Must NOT do**:
  - Do NOT remove `ConsultationNotificationItem` or `mockNotifications` from `creator-studio.ts`
  - Do NOT modify other sidebar items

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 2 (parallel with T3, T4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  - `frontend/src/views/CreatorStudio.tsx` — imports, sectionTitles, renderContent to clean
  - `frontend/src/views/creator-studio/CreatorStudioSidebar.tsx:35-41` — consultationItems array

  **Acceptance Criteria**:
  - [ ] `ConsultationNotifications.tsx` deleted
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors (excluding bun:test)
  - [ ] `cd frontend && bun run build` → exit 0
  - [ ] Sidebar consultationItems has 4 entries

  **QA Scenarios**:
  ```
  Scenario: Build passes after deletion
    Tool: Bash
    Steps: cd frontend && npx tsc --noEmit 2>&1 | grep -v "bun:test" | grep error || echo "OK"
    Expected: No errors
    Evidence: .sisyphus/evidence/task-2-build.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 3. Create AIConsultationDetail Component

  **What to do**:
  - Create `frontend/src/views/creator-studio/AIConsultationDetail.tsx`
  - Props: `{ recordId: number; onBack: () => void }`
  - Look up data from `mockAIRecords.find(r => r.id === recordId)` and `mockAIConsultationDetails[recordId]`
  - Layout following ConsultationReport.tsx pattern:
    - Header: back button + client name + date + sentiment badge
    - Card: 상담 요약 (summary)
    - Card: 핵심 포인트 (keyPoints list with numbered circles)
    - Card: 추천 사항 (recommendations with icons)
    - Card: 실행 항목 (actionItems with checkbox-style)
    - Card: 시장 분석 (if available)
    - Card: 리스크 요인 (if available)
    - Card: 주요 토픽 (keyTopics as Badge tags)
  - Edge case: recordId not found → fallback message
  - Under 150 lines
  - data-testid: `ai-detail-back`, `ai-detail-summary`, `ai-detail-keypoints`, `ai-detail-recommendations`, `ai-detail-actions`

  **Must NOT do**:
  - Do NOT add new SectionKey
  - Do NOT exceed 150 lines

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 2 (parallel with T2, T4)
  - **Blocks**: Task 7
  - **Blocked By**: Task 1

  **References**:
  - `frontend/src/views/ConsultationReport.tsx:141-310` — Card section layout pattern (summary, keyPoints, recommendations, actionItems with icons)
  - `frontend/src/views/creator-studio/CreatorCourseDetail.tsx` — Props pattern and drill-down structure

  **Acceptance Criteria**:
  - [ ] File created, under 150 lines
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors (excluding bun:test)
  - [ ] data-testid attributes on all key sections

  **QA Scenarios**:
  ```
  Scenario: Component compiles
    Tool: Bash
    Steps: cd frontend && npx tsc --noEmit 2>&1 | grep "AIConsultationDetail" || echo "OK"
    Expected: No errors in this file
    Evidence: .sisyphus/evidence/task-3-tsc.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 4. NotificationModal Consultation Tab

  **What to do**:
  - Modify `frontend/src/components/NotificationModal.tsx`:
    - Add imports: Tabs/TabsList/TabsTrigger/TabsContent from `@/components/ui/tabs`, `mockNotifications as mockConsultationNotifs` and `ConsultationNotificationItem` from `@/data/creator-studio`
    - Add icon imports: Calendar, XCircle, Star from lucide-react (for consultation notification types)
    - Wrap the ScrollArea content in a Tabs structure:
      - `<Tabs defaultValue="notifications">` at the top of ScrollArea
      - `<TabsList>` with 2 triggers: "알림" (value="notifications") + "상담" (value="consultation")
      - `<TabsContent value="notifications">` wraps existing notification list
      - `<TabsContent value="consultation">` renders consultation notifications
    - Consultation tab renders `mockConsultationNotifs` (from creator-studio.ts) with type-specific icons and unread styling (matching existing ConsultationNotifications pattern)
  - Keep existing notification behavior completely intact

  **Must NOT do**:
  - Do NOT modify `@/data/notifications.ts` Notification type
  - Do NOT add read/unread toggle for consultation notifications
  - Do NOT break existing notification display

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 2 (parallel with T2, T3)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1

  **References**:
  - `frontend/src/components/NotificationModal.tsx:1-190` — Current file to modify
  - `frontend/src/views/creator-studio/ConsultationNotifications.tsx:7-12` — typeIconConfig pattern for consultation notification rendering
  - `frontend/src/data/creator-studio.ts:ConsultationNotificationItem` — Data type for consultation notifications

  **Acceptance Criteria**:
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors (excluding bun:test)
  - [ ] `cd frontend && bun run build` → exit 0
  - [ ] NotificationModal renders 2 tabs
  - [ ] "상담" tab shows consultation notifications

  **QA Scenarios**:
  ```
  Scenario: NotificationModal tab structure works
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Click [data-testid="button-notifications"]
      3. Assert "알림" and "상담" tabs visible
      4. Click "상담" tab
      5. Assert consultation notification items visible
    Expected: Both tabs render correctly
    Evidence: .sisyphus/evidence/task-4-notif-tabs.png
  ```

  **Commit**: YES (groups with all tasks)

- [x] 5. ConsultationScheduler Calendar + Filters

  **What to do**:
  - Rewrite `frontend/src/views/creator-studio/ConsultationScheduler.tsx`:
    - Import Calendar from `@/components/ui/calendar`, ko locale from `date-fns/locale`
    - Import Input from `@/components/ui/input`, Search icon from lucide-react
    - Import Tabs/TabsList/TabsTrigger from `@/components/ui/tabs`
    - States: `selectedDate: Date | undefined`, `searchQuery: string`, `statusFilter: string`
    - Props: `{ onNavigateToRoom?: (booking: ConsultationBookingRecord) => void }`
    - **Top section**: Calendar component with:
      - `locale={ko}`, month navigation
      - `modifiers={{ booked: datesWithBookings }}` + dot styling via `modifiersStyles`
      - `onDayClick` → sets selectedDate filter
    - **Middle section**: Search input + Status filter tabs (전체/확정/대기/완료/취소)
    - **Bottom section**: Filtered booking table (same columns as current + price)
      - Filter by: selectedDate (exact match), searchQuery (clientName includes), statusFilter
      - Each row clickable → calls `onNavigateToRoom(booking)` if provided
    - "전체 보기" button to clear date filter
    - Preserve `data-testid="content-consultation-scheduler"`

  **Must NOT do**:
  - Do NOT install new calendar library — use existing shadcn Calendar
  - Do NOT add booking CRUD actions
  - Do NOT exceed 200 lines (this is a bigger component)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 3 (parallel with T7)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  - `frontend/src/components/ui/calendar.tsx` — Calendar component (shadcn/react-day-picker wrapper)
  - `frontend/src/views/CreatorProfile.tsx` — Korean locale Calendar usage pattern (search for `ko` locale import)
  - `frontend/src/views/creator-studio/CourseManagement.tsx:77-119` — Tabs filter pattern with data-testid
  - `frontend/src/data/creator-studio.ts:mockConsultationBookings` — Booking data (expanded in Task 1)

  **Acceptance Criteria**:
  - [ ] Calendar renders with current month
  - [ ] Dates with bookings show visual indicator
  - [ ] Date click filters the list
  - [ ] Search filters by client name
  - [ ] Status tabs filter by booking status
  - [ ] Row click calls onNavigateToRoom

  **QA Scenarios**:
  ```
  Scenario: Calendar renders and date filtering works
    Tool: Playwright
    Steps:
      1. Navigate to /creator-studio
      2. Click sidebar-consultation-scheduler
      3. Assert calendar visible
      4. Click a date that has bookings
      5. Assert table shows only that date's bookings
      6. Take screenshot
    Expected: Calendar renders, filtering works
    Evidence: .sisyphus/evidence/task-5-calendar.png
  ```

  **Commit**: YES (groups with all tasks)

- [x] 6. Scheduler → Room Cross-Section Integration

  **What to do**:
  - In `frontend/src/views/CreatorStudio.tsx`:
    - Add import for `ConsultationBookingRecord` type from `@/data/creator-studio`
    - Add state: `const [selectedSession, setSelectedSession] = useState<ConsultationBookingRecord | null>(null)`
    - Create callback: `const handleNavigateToRoom = (booking: ConsultationBookingRecord) => { setSelectedSession(booking); setActiveSection("consultation-room"); }`
    - Pass `onNavigateToRoom={handleNavigateToRoom}` to ConsultationScheduler in renderContent
    - Pass `selectedSession={selectedSession}` to ConsultationRoom in renderContent
    - When activeSection changes away from "consultation-room", clear selectedSession: use useEffect
  - In `frontend/src/views/creator-studio/ConsultationRoom.tsx`:
    - Add optional prop: `selectedSession?: ConsultationBookingRecord | null`
    - When `selectedSession` is provided, show a highlighted info Card at the top:
      - Client name, date, time, type, status Badge
      - "상담 시작" button (disabled)
    - Existing "오늘의 상담 일정" list remains below unchanged

  **Must NOT do**:
  - Do NOT pass raw `setActiveSection` to child components
  - Do NOT redesign ConsultationRoom beyond adding the selected-session card
  - Do NOT create URL-based navigation

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 4
  - **Blocks**: Task 8
  - **Blocked By**: Tasks 2, 5

  **References**:
  - `frontend/src/views/CreatorStudio.tsx` — Current state management, renderContent switch
  - `frontend/src/views/creator-studio/ConsultationScheduler.tsx` (Task 5 output) — onNavigateToRoom prop
  - `frontend/src/views/creator-studio/ConsultationRoom.tsx:1-70` — Current ConsultationRoom

  **Acceptance Criteria**:
  - [ ] Clicking booking in scheduler switches to consultation-room section
  - [ ] ConsultationRoom shows selected session card at top
  - [ ] Existing session list remains intact
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: Scheduler to room navigation
    Tool: Playwright
    Steps:
      1. Navigate to /creator-studio
      2. Click sidebar-consultation-scheduler
      3. Click a booking row in the table
      4. Assert content switches to consultation-room
      5. Assert selected session info card visible
      6. Assert "오늘의 상담 일정" section still visible
    Expected: Cross-section navigation works
    Evidence: .sisyphus/evidence/task-6-scheduler-room.png
  ```

  **Commit**: YES (groups with all tasks)

- [x] 7. AI History Search/Filter + Detail Integration

  **What to do**:
  - Modify `frontend/src/views/creator-studio/AIConsultationHistory.tsx`:
    - Add imports: Input, Search, Tabs/TabsList/TabsTrigger, Select/SelectContent/SelectItem/SelectTrigger/SelectValue
    - Add state: `searchQuery: string`, `sentimentFilter: string` (all/positive/neutral/negative), `followUpFilter: string` (all/needed/not-needed), `selectedRecordId: number | null`
    - If `selectedRecordId !== null`: render `<AIConsultationDetail recordId={selectedRecordId} onBack={() => setSelectedRecordId(null)} />`
    - Otherwise: render list with filters:
      - Search input for clientName/summary filtering
      - Sentiment filter tabs: 전체/긍정/중립/부정
      - Follow-up filter: Select (전체/필요/불필요)
      - Filtered list of AI record cards (clickable → setSelectedRecordId)
    - Each card clickable → drills into detail
    - Preserve existing card layout (sentiment badge, followUp badge, keyTopics)

  **Must NOT do**:
  - Do NOT create new SectionKey
  - Do NOT add debounce — simple includes() filter
  - Do NOT exceed 150 lines

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 3 (parallel with T5)
  - **Blocks**: Task 8
  - **Blocked By**: Tasks 1, 3

  **References**:
  - `frontend/src/views/creator-studio/AIConsultationHistory.tsx:1-64` — Current file
  - `frontend/src/views/creator-studio/CourseManagement.tsx:30-42` — selectedId drill-down pattern
  - `frontend/src/views/creator-studio/AIConsultationDetail.tsx` (Task 3 output) — Props

  **Acceptance Criteria**:
  - [ ] Search filters records by clientName/summary
  - [ ] Sentiment tabs filter by sentiment value
  - [ ] Follow-up filter works
  - [ ] Clicking record → detail view
  - [ ] Back → returns to filtered list (filter state preserved)

  **QA Scenarios**:
  ```
  Scenario: AI history search and drill-down
    Tool: Playwright
    Steps:
      1. Navigate to /creator-studio
      2. Click sidebar-ai-consultation-history
      3. Type "김" in search → assert filtered results
      4. Click a record → assert detail view
      5. Click back → assert list with search preserved
    Expected: Search, filter, drill-down all work
    Evidence: .sisyphus/evidence/task-7-ai-history.png
  ```

  **Commit**: YES (groups with all tasks)

- [x] 8. Build Verification + Visual QA

  **What to do**:
  - Run full build pipeline
  - Playwright visual QA for all changes:
    - Sidebar: 4 consultation items (no "알림")
    - Scheduler: calendar + search + filter + table
    - NotificationModal: 2 tabs (알림 + 상담)
    - Scheduler → Room navigation
    - AI History: search + filter + detail + back
    - All other sections still work (강의 관리, 강의 판매, 시간 설정)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Wave**: 5
  - **Blocked By**: Tasks 4,6,7

  **Acceptance Criteria**:
  - [ ] Build + tsc + tests all pass
  - [ ] All Playwright scenarios pass with screenshots

  **QA Scenarios**:
  ```
  Scenario: Sidebar shows 4 consultation items
    Tool: Playwright
    Steps:
      1. Navigate to /creator-studio
      2. Assert sidebar-consultation-scheduler visible
      3. Assert sidebar-available-time-settings visible
      4. Assert sidebar-consultation-room visible
      5. Assert sidebar-ai-consultation-history visible
      6. Assert sidebar-consultation-notifications NOT in DOM
    Expected: 4 items, no "알림"
    Evidence: .sisyphus/evidence/task-8-sidebar.png

  Scenario: Full consultation workflow
    Tool: Playwright
    Steps:
      1. Click scheduler → assert calendar
      2. Click a booking → assert room with session card
      3. Click sidebar back to AI history → search "김" → click record → detail → back
      4. Navigate to / (main page) → click notifications → assert "상담" tab
    Expected: All flows work
    Evidence: .sisyphus/evidence/task-8-full-workflow.png
  ```

  **Commit**: YES (single atomic commit)
  - Message: `feat(creator-studio): improve consultation menus — calendar scheduler, notification tab, AI detail, scheduler↔room link`
  - Pre-commit: `cd frontend && npx tsc --noEmit && bun run build && bun test`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE.

- [x] F1. **Plan Compliance Audit** — `oracle`
- [x] F2. **Code Quality Review** — `unspecified-high`
- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright`)
- [x] F4. **Scope Fidelity Check** — `deep`

---

## Commit Strategy

- **Single atomic commit** after all tasks pass:
  - Message: `feat(creator-studio): improve consultation menus — calendar scheduler, notification tab, AI detail, scheduler↔room link`
  - Pre-commit: `cd frontend && npx tsc --noEmit && bun run build && bun test`

---

## Success Criteria

### Verification Commands
```bash
cd frontend && npx tsc --noEmit  # Expected: 0 errors (excluding bun:test)
cd frontend && bun run build     # Expected: exit code 0
cd frontend && bun test          # Expected: all tests pass
```

### Final Checklist
- [ ] 사이드바 상담예약 4개 메뉴 (알림 삭제됨)
- [ ] 캘린더 스케줄러 정상 렌더 (월 전환, 날짜 클릭 필터, 검색)
- [ ] 메인 알림 모달에 "상담" 탭
- [ ] 스케줄러→상담 전용 화면 전환
- [ ] AI 이력 12개+ 목록, 검색/필터, 상세 화면
- [ ] ConsultationNotifications.tsx 삭제됨
- [ ] 0 new npm dependencies
- [ ] Build passes with zero errors

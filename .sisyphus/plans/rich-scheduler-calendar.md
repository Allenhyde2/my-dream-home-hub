# 상담 스케줄러 고기능 캘린더 적용

## TL;DR

> **Quick Summary**: 기본 shadcn Calendar(react-day-picker)를 버리고, 각 날짜 셀에 예약 건수 + 고객명/시간 축약 정보를 보여주는 커스텀 월간 캘린더 그리드로 교체.
> 
> **Deliverables**:
> - `SchedulerCalendar.tsx` — 커스텀 고기능 월간 캘린더 컴포넌트
> - `ConsultationScheduler.tsx` — 기존 Calendar 대신 새 컴포넌트 사용
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO — 2 sequential tasks

---

## Context

### Original Request
현재 스케줄러의 캘린더가 단순 `react-day-picker`로 날짜만 보여줌. 각 날짜 셀 안에 예약 건수, 고객명, 시간 등 축약 정보가 표시되는 고기능 캘린더를 원함.

### 문제점
- `react-day-picker`의 셀 크기: `h-9 w-9` (36px) — 텍스트 표시 불가
- `modifiers`/`modifiersStyles`로는 dot이나 bold 정도만 가능
- 예약 정보를 각 셀에 표시하려면 커스텀 그리드가 필요

---

## Work Objectives

### Core Objective
각 날짜 셀에 예약 건수와 축약 예약 정보(고객명 + 시간 + 상태 dot)를 표시하는 커스텀 월간 캘린더 컴포넌트를 만들어 스케줄러에 적용한다.

### Concrete Deliverables
- `frontend/src/views/creator-studio/SchedulerCalendar.tsx` — 신규 커스텀 캘린더 컴포넌트
- `frontend/src/views/creator-studio/ConsultationScheduler.tsx` — 기존 Calendar 교체

### Must Have
- 7열 CSS Grid 기반 월간 캘린더 (일~토 헤더)
- 월 이동: ◀ 이전달 / ▶ 다음달 버튼 + "2026년 3월" 형식 제목
- 각 날짜 셀 크기: 최소 `h-24`(96px) — 예약 정보 2-3건 표시 가능
- 셀 내용:
  - 날짜 숫자 (오늘이면 primary 원형 배경)
  - 예약 건수 Badge (예: "3건")
  - 예약 최대 2건까지 축약 표시: `"10:00 김철수"` + 상태 색상 dot (확정=green, 대기=amber, 완료=gray, 취소=red)
  - 3건 이상이면 `"+N건 더"` 텍스트
- 날짜 셀 클릭 → `onSelectDate(date)` 콜백 → 하단 목록 필터링
- 선택된 날짜 셀 하이라이트 (ring 스타일)
- 이번 달이 아닌 날짜(전월/차월 오버플로)는 `opacity-40`
- 예약 없는 날은 빈 셀 (날짜 숫자만)
- data-testid: `scheduler-calendar`, `calendar-cell-{YYYY-MM-DD}`, `calendar-prev`, `calendar-next`
- 한국어 요일 헤더 (일, 월, 화, 수, 목, 금, 토)

### Must NOT Have (Guardrails)
- ❌ react-day-picker 사용 금지 — 셀이 너무 작음
- ❌ 새 npm 의존성 금지 — date-fns만 사용 (이미 설치됨)
- ❌ SchedulerCalendar 내부에서 booking 데이터 직접 import 금지 — props로 받을 것
- ❌ 기존 하단 테이블/검색/필터 수정 금지
- ❌ ConsultationRoom/CreatorStudio 수정 금지

---

## Verification Strategy

- **Build**: `cd frontend && npx tsc --noEmit && bun run build`
- **Tests**: `cd frontend && bun test`
- **Visual QA**: Playwright

---

## Execution Strategy

```
Wave 1: Task 1 — Create SchedulerCalendar component [visual-engineering]
Wave 2: Task 2 — Integrate into ConsultationScheduler [quick]
Wave 3: Task 3 — Visual QA [unspecified-high + playwright]

Critical Path: T1 → T2 → T3
```

---

## TODOs

- [x] 1. Create SchedulerCalendar Component

  **What to do**:
  - Create `frontend/src/views/creator-studio/SchedulerCalendar.tsx`
  - Props:
    ```typescript
    interface SchedulerCalendarProps {
      bookings: ConsultationBookingRecord[];
      selectedDate?: Date;
      onSelectDate: (date: Date | undefined) => void;
    }
    ```
  - Internal state: `currentMonth: Date` (default: `new Date()`)
  - Use `date-fns` functions: `startOfMonth`, `endOfMonth`, `startOfWeek`, `endOfWeek`, `eachDayOfInterval`, `format`, `isSameMonth`, `isSameDay`, `isToday`, `addMonths`, `subMonths`
  - Import `ko` locale from `date-fns/locale`
  - Layout:
    - **Header**: `<` prev button + `format(currentMonth, "yyyy년 M월", { locale: ko })` + `>` next button
    - **Day headers**: 7-column grid — 일, 월, 화, 수, 목, 금, 토
    - **Day cells**: 7-column grid, each cell `min-h-24 p-1 border rounded-lg`
      - Day number (top-left, `text-xs`)
      - If today: day number has `bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center`
      - If bookings exist for this day:
        - Booking count Badge (top-right): `<Badge variant="secondary" className="text-[10px] px-1 py-0">{count}건</Badge>`
        - Up to 2 booking items: `<div className="text-[10px] truncate flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full shrink-0 {statusColor}" />{time} {clientName}</div>`
        - If more than 2: `<span className="text-[10px] text-muted-foreground">+{remaining}건 더</span>`
      - Status colors: confirmed=`bg-green-500`, pending=`bg-amber-500`, completed=`bg-gray-400`, cancelled=`bg-red-500`
      - Clickable: `onClick={() => onSelectDate(isSameDay(day, selectedDate) ? undefined : day)}`
      - Selected state: `ring-2 ring-primary`
      - Outside current month: `opacity-40`
  - Under 120 lines
  - data-testid: `scheduler-calendar` (wrapper), `calendar-cell-{format(day, "yyyy-MM-dd")}` (each cell), `calendar-prev`, `calendar-next`

  **Must NOT do**:
  - Do NOT use react-day-picker or shadcn Calendar
  - Do NOT import booking data directly — receive via props
  - Do NOT exceed 120 lines

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 1
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `frontend/src/data/creator-studio.ts:51-58` — ConsultationBookingRecord interface (date is "YYYY-MM-DD" string format)
  - `frontend/src/views/creator-studio/ConsultationScheduler.tsx:16-21` — statusConfig for color mapping reference

  **Acceptance Criteria**:
  - [ ] File created, under 120 lines
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] Props-only interface (no direct data import)

  **QA Scenarios**:
  ```
  Scenario: Component compiles
    Tool: Bash
    Steps: cd frontend && npx tsc --noEmit
    Expected: No errors
    Evidence: .sisyphus/evidence/rich-cal-1-tsc.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 2. Integrate SchedulerCalendar into ConsultationScheduler

  **What to do**:
  - Modify `frontend/src/views/creator-studio/ConsultationScheduler.tsx`:
    - Remove import: `import { Calendar } from "@/components/ui/calendar"`
    - Remove import: `import { ko } from "date-fns/locale"`
    - Remove: `bookedDates` useMemo
    - Remove: `handleDateSelect` function
    - Add import: `import SchedulerCalendar from "./SchedulerCalendar"`
    - Replace the `<Card>` containing `<Calendar>` (lines 63-75) with:
      ```tsx
      <SchedulerCalendar
        bookings={mockConsultationBookings}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      ```
  - Keep everything else intact: search, status tabs, table, onNavigateToRoom

  **Must NOT do**:
  - Do NOT modify the table/search/filter section
  - Do NOT modify ConsultationRoom or CreatorStudio

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Wave**: 2
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `frontend/src/views/creator-studio/ConsultationScheduler.tsx:1-156` — Current file to modify
  - `frontend/src/views/creator-studio/SchedulerCalendar.tsx` (Task 1 output) — Component to import

  **Acceptance Criteria**:
  - [ ] `cd frontend && npx tsc --noEmit` → 0 errors
  - [ ] `cd frontend && bun run build` → exit 0
  - [ ] `cd frontend && bun test` → all pass
  - [ ] No `react-day-picker` Calendar import in ConsultationScheduler
  - [ ] SchedulerCalendar receives bookings via props

  **QA Scenarios**:
  ```
  Scenario: Build passes
    Tool: Bash
    Steps: cd frontend && npx tsc --noEmit && bun run build && bun test
    Expected: All pass
    Evidence: .sisyphus/evidence/rich-cal-2-build.txt
  ```

  **Commit**: YES (groups with all tasks)

- [x] 3. Visual QA — Rich Calendar Verification

  **What to do**:
  - Run Playwright scenarios:
    1. Navigate to `/creator-studio`, click scheduler
    2. Assert custom calendar grid visible (not react-day-picker `.rdp`)
    3. Assert date cells show booking count badges
    4. Assert at least one cell shows `"10:00 김..."` style booking preview
    5. Click a date with bookings → assert table below filters to that date
    6. Click prev/next month → assert calendar updates
    7. Take screenshots

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Acceptance Criteria**:
  - [ ] All Playwright scenarios pass
  - [ ] Screenshots captured

  **Commit**: YES (single atomic commit)
  - Message: `feat(creator-studio): replace basic calendar with rich scheduler showing booking details per cell`
  - Pre-commit: `cd frontend && npx tsc --noEmit && bun run build && bun test`

---

## Final Verification Wave

- [x] Skipped — small focused change, covered by Task 3 QA

---

## Success Criteria

### Verification Commands
```bash
cd frontend && npx tsc --noEmit   # Expected: 0 errors
cd frontend && bun run build      # Expected: exit 0
cd frontend && bun test           # Expected: all pass
```

### Final Checklist
- [ ] 각 날짜 셀에 예약 건수 Badge 표시
- [ ] 셀에 최대 2건 예약 축약 표시 (시간 + 고객명 + 상태 dot)
- [ ] 3건 이상 시 "+N건 더" 표시
- [ ] 월 이동 버튼 동작
- [ ] 날짜 클릭 → 하단 테이블 필터링
- [ ] react-day-picker 미사용
- [ ] Build 통과

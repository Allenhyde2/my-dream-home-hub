# Creator Studio Problems

## BUG: Date filter timezone mismatch in ConsultationScheduler (2026-03-17)

**Severity**: High — date filtering is completely broken in Asia/Seoul timezone
**File**: `frontend/src/views/creator-studio/ConsultationScheduler.tsx:33`
**Code**: `const selected = selectedDate.toISOString().split("T")[0];`

**Root Cause**: `Date.toISOString()` converts to UTC. In UTC+9 (Asia/Seoul), midnight local time = previous day 15:00 UTC. So `split("T")[0]` returns the previous day's date string, which never matches the mock data dates.

**Reproduction**:
1. Navigate to Creator Studio → 상담 예약 스케줄러
2. Click any calendar cell with a booking (e.g., March 18 showing "10:00 송지호")
3. Table shows "예약이 없습니다" instead of the booking

**Fix**: Replace `selectedDate.toISOString().split("T")[0]` with `format(selectedDate, "yyyy-MM-dd")` from date-fns (already imported in SchedulerCalendar.tsx).

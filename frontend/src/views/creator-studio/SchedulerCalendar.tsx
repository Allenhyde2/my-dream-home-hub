"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, isToday,
  addMonths, subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { ConsultationBookingRecord } from "@/data/creator-studio";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-500",
  pending: "bg-amber-500",
  completed: "bg-gray-400",
  cancelled: "bg-red-500",
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface SchedulerCalendarProps {
  bookings: ConsultationBookingRecord[];
  selectedDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
}

export default function SchedulerCalendar({ bookings, selectedDate, onSelectDate }: SchedulerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const bookingsByDate = useMemo(() => {
    const map: Record<string, ConsultationBookingRecord[]> = {};
    bookings.forEach((b) => {
      (map[b.date] ??= []).push(b);
    });
    return map;
  }, [bookings]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
    });
  }, [currentMonth]);

  return (
    <div data-testid="scheduler-calendar" className="rounded-lg border bg-card">
      {/* Month navigation header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth((m) => subMonths(m, 1))} data-testid="calendar-prev">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h4 className="font-semibold text-sm">{format(currentMonth, "yyyy년 M월", { locale: ko })}</h4>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth((m) => addMonths(m, 1))} data-testid="calendar-next">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
      </div>

      {/* Day cells grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayBookings = bookingsByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const today = isToday(day);

          return (
            <div
              key={dateKey}
              data-testid={`calendar-cell-${dateKey}`}
              className={`min-h-24 p-1.5 border-r border-b cursor-pointer transition-colors hover:bg-muted/50
                ${!isCurrentMonth ? "opacity-40 bg-muted/20" : ""}
                ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
              onClick={() => onSelectDate(isSelected ? undefined : day)}
            >
              {/* Day number + count badge */}
              <div className="flex items-start justify-between mb-1">
                <span className={`text-xs font-medium inline-flex items-center justify-center
                  ${today ? "bg-primary text-primary-foreground rounded-full w-6 h-6" : ""}`}>
                  {format(day, "d")}
                </span>
                {dayBookings.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 leading-none">
                    {dayBookings.length}건
                  </Badge>
                )}
              </div>

              {/* Booking previews (max 2) */}
              <div className="space-y-0.5">
                {dayBookings.slice(0, 2).map((b) => (
                  <div key={b.id} className="text-[10px] leading-tight truncate flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_COLORS[b.status]}`} />
                    <span className="truncate">{b.time} {b.clientName}</span>
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">+{dayBookings.length - 2}건 더</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

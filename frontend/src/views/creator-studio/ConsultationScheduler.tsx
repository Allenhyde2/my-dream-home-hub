"use client"
import { useState, useMemo } from "react";
import { CalendarDays, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { ko } from "date-fns/locale";
import { mockConsultationBookings, type ConsultationBookingRecord } from "@/data/creator-studio";

const statusConfig: Record<string, { label: string; className?: string; variant?: "secondary" | "destructive" }> = {
  confirmed: { label: "확정", className: "bg-green-600 text-white border-transparent" },
  pending: { label: "대기", className: "bg-amber-500 text-white border-transparent" },
  completed: { label: "완료", variant: "secondary" },
  cancelled: { label: "취소", variant: "destructive" },
};

interface Props {
  onNavigateToRoom?: (booking: ConsultationBookingRecord) => void;
}

export default function ConsultationScheduler({ onNavigateToRoom }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const bookedDates = useMemo(() => {
    return mockConsultationBookings.map((b) => new Date(b.date + "T00:00:00"));
  }, []);

  const filteredBookings = useMemo(() => {
    return mockConsultationBookings.filter((b) => {
      if (selectedDate) {
        const selected = selectedDate.toISOString().split("T")[0];
        if (b.date !== selected) return false;
      }
      if (searchQuery && !b.clientName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      return true;
    });
  }, [selectedDate, searchQuery, statusFilter]);

  const handleDateSelect = (date: Date | undefined) => {
    if (selectedDate && date && selectedDate.toDateString() === date.toDateString()) {
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
    }
  };

  return (
    <div data-testid="content-consultation-scheduler" className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">상담 예약 스케줄러</h3>
      </div>

      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={ko}
            modifiers={{ booked: bookedDates }}
            modifiersStyles={{ booked: { fontWeight: "bold", textDecoration: "underline" } }}
            data-testid="scheduler-calendar"
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedDate.toLocaleDateString("ko-KR")} 예약</Badge>
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)} data-testid="clear-date-filter">
            전체 보기
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="고객명 검색..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="scheduler-search"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="grid w-full grid-cols-5" data-testid="scheduler-status-tabs">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="confirmed">확정</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="completed">완료</TabsTrigger>
            <TabsTrigger value="cancelled">취소</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>고객명</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>시간</TableHead>
              <TableHead>상담 유형</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  예약이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => {
                const config = statusConfig[booking.status];
                return (
                  <TableRow
                    key={booking.id}
                    data-testid={`booking-row-${booking.id}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onNavigateToRoom?.(booking)}
                  >
                    <TableCell className="font-medium">{booking.clientName}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.type}</TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className={config.variant ? undefined : config.className}>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{booking.price.toLocaleString()}원</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

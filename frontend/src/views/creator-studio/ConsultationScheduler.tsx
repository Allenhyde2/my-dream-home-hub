"use client"
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockConsultationBookings } from "@/data/creator-studio";

const statusConfig: Record<string, { label: string; className?: string; variant?: "secondary" | "destructive" }> = {
  confirmed: { label: "확정", className: "bg-green-600 text-white border-transparent" },
  pending: { label: "대기", className: "bg-amber-500 text-white border-transparent" },
  completed: { label: "완료", variant: "secondary" },
  cancelled: { label: "취소", variant: "destructive" },
};

export default function ConsultationScheduler() {
  return (
    <div data-testid="content-consultation-scheduler" className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">상담 예약 스케줄러</h3>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockConsultationBookings.map((booking) => {
              const config = statusConfig[booking.status];
              return (
                <TableRow key={booking.id} data-testid={`booking-row-${booking.id}`}>
                  <TableCell className="font-medium">{booking.clientName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={config.variant}
                      className={config.variant ? undefined : config.className}
                    >
                      {config.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

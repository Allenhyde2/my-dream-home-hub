"use client"
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockWeeklySchedule } from "@/data/creator-studio";

export default function AvailableTimeSettings() {
  return (
    <div data-testid="content-available-time-settings" className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">예약 가능 시간 설정</h3>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>요일</TableHead>
              <TableHead>시작 시간</TableHead>
              <TableHead>종료 시간</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWeeklySchedule.map((slot) => (
              <TableRow key={slot.day} data-testid={`schedule-row-${slot.day}`}>
                <TableCell className="font-medium">{slot.day}요일</TableCell>
                <TableCell>{slot.isActive ? slot.startTime : "—"}</TableCell>
                <TableCell>{slot.isActive ? slot.endTime : "—"}</TableCell>
                <TableCell>
                  {slot.isActive ? (
                    <Badge className="bg-green-600 text-white border-transparent">
                      운영
                    </Badge>
                  ) : (
                    <Badge variant="secondary">휴무</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

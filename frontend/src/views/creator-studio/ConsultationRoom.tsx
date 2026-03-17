"use client"
import { Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTodaySessions, type ConsultationBookingRecord } from "@/data/creator-studio";

const sessionStatusConfig: Record<string, { label: string; className?: string; variant?: "secondary" }> = {
  waiting: { label: "대기 중", className: "bg-amber-500 text-white border-transparent" },
  in_progress: { label: "진행 중", className: "bg-green-600 text-white border-transparent" },
  completed: { label: "완료", variant: "secondary" },
};

const bookingStatusConfig: Record<string, { label: string; className?: string; variant?: "secondary" | "destructive" }> = {
  confirmed: { label: "확정", className: "bg-green-600 text-white border-transparent" },
  pending: { label: "대기", className: "bg-amber-500 text-white border-transparent" },
  completed: { label: "완료", variant: "secondary" },
  cancelled: { label: "취소", variant: "destructive" },
};

interface Props {
  selectedSession?: ConsultationBookingRecord | null;
}

export default function ConsultationRoom({ selectedSession }: Props) {
  return (
    <div data-testid="content-consultation-room" className="space-y-6">
      <div className="flex items-center gap-2">
        <Video className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">상담 전용 화면</h3>
      </div>

      {selectedSession && (
        <Card className="border-primary/30 bg-primary/5" data-testid="selected-session-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">{selectedSession.clientName}</span>
                  <Badge
                    variant={bookingStatusConfig[selectedSession.status]?.variant}
                    className={bookingStatusConfig[selectedSession.status]?.variant ? undefined : bookingStatusConfig[selectedSession.status]?.className}
                  >
                    {bookingStatusConfig[selectedSession.status]?.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedSession.date} {selectedSession.time} · {selectedSession.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedSession.price.toLocaleString()}원
                </p>
              </div>
              <Button disabled data-testid="btn-start-consultation">
                <Video className="w-4 h-4 mr-1" />
                상담 시작
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedSession && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
            <Video className="w-16 h-16 text-muted-foreground" />
            <p className="font-medium text-lg">화상 상담을 진행합니다</p>
            <p className="text-sm text-muted-foreground">
              상담 시간이 되면 입장 버튼이 활성화됩니다
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">오늘의 상담 일정</h4>
        {mockTodaySessions.map((session) => {
          const config = sessionStatusConfig[session.status];
          return (
            <Card key={session.id} data-testid={`session-${session.id}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{session.clientName}</span>
                      <Badge
                        variant={config.variant}
                        className={config.variant ? undefined : config.className}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.time} · {session.productName}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled
                    data-testid={`btn-join-${session.id}`}
                  >
                    <Video className="w-4 h-4 mr-1" />
                    입장
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

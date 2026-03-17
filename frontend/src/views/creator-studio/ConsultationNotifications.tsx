"use client"
import { Bell, Calendar, XCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockNotifications } from "@/data/creator-studio";
import type { ConsultationNotificationItem } from "@/data/creator-studio";

const typeIconConfig: Record<ConsultationNotificationItem["type"], { icon: typeof Bell; className: string }> = {
  new_booking: { icon: Calendar, className: "text-blue-500" },
  cancellation: { icon: XCircle, className: "text-red-500" },
  reminder: { icon: Bell, className: "text-amber-500" },
  review: { icon: Star, className: "text-purple-500" },
};

export default function ConsultationNotifications() {
  return (
    <div data-testid="content-consultation-notifications" className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">알림</h3>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((notification) => {
          const config = typeIconConfig[notification.type];
          const Icon = config.icon;
          return (
            <Card
              key={notification.id}
              data-testid={`notification-${notification.id}`}
              className={
                !notification.isRead
                  ? "border-l-4 border-l-primary bg-primary/5"
                  : undefined
              }
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <Icon className={`w-5 h-5 ${config.className}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.createdAt.replace("T", " ").slice(0, 16)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

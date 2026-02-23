"use client";

import { useState } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Settings,
  Bell,
  ChevronRight,
  Check,
  Trash2,
} from "lucide-react";
import {
  mockNotifications,
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  formatNotificationTime,
  groupNotificationsByDate,
  type Notification,
  type NotificationType,
} from "@/data/notifications";
import { cn } from "@/lib/utils";

const FILTER_TABS: { key: NotificationType | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "property", label: "매물" },
  { key: "message", label: "메시지" },
  { key: "schedule", label: "일정" },
  { key: "news", label: "소식" },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationType | "all">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">알림</h1>
              {unreadCount > 0 && (
                <Badge className="bg-[#FF3B30] text-white text-[10px] px-1.5 py-0.5">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs text-muted-foreground"
            >
              <Check className="w-4 h-4 mr-1" />
              전체 읽음
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings/notifications")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeFilter === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-2xl">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              알림이 없어요
            </h2>
            <p className="text-muted-foreground mb-6">
              관심 매물을 저장하거나 중개사에게 문의하면
              <br />
              여기서 알림을 받을 수 있어요
            </p>
            <Button onClick={() => navigate("/")}>매물 찾아보기</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedNotifications.map((group) => (
              <div key={group.label}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {group.label}
                  </h3>
                </div>
                <Card className="overflow-hidden divide-y">
                  {group.notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "w-full px-4 py-4 flex gap-4 text-left transition-colors hover:bg-muted/50",
                        !notification.isRead && "bg-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-xl",
                          NOTIFICATION_COLORS[notification.type]
                        )}
                      >
                        {notification.imageUrl ? (
                          <img
                            src={notification.imageUrl}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          NOTIFICATION_ICONS[notification.type]
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm",
                              !notification.isRead && "font-semibold"
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#126BFF] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatNotificationTime(notification.timestamp)}
                          </span>
                          {notification.actionLabel && (
                            <span className="text-xs text-[#126BFF] font-medium flex items-center gap-0.5">
                              {notification.actionLabel}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </Card>
              </div>
            ))}

            <div className="pt-4 pb-8">
              <Button
                variant="outline"
                className="w-full text-muted-foreground"
                onClick={handleClearAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                알림 전체 삭제
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

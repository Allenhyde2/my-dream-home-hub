"use client";

import { useState } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Settings, ChevronRight, X } from "lucide-react";
import {
  mockNotifications,
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  formatNotificationTime,
  type Notification,
} from "@/data/notifications";
import { cn } from "@/lib/utils";

interface NotificationModalProps {
  onViewAll?: () => void;
}

export default function NotificationModal({ onViewAll }: NotificationModalProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setOpen(false);
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/notifications");
    }
  };

  const handleSettings = () => {
    setOpen(false);
    navigate("/settings/notifications");
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#FF3B30] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[360px] p-0 rounded-xl shadow-xl border-border/50"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">알림</h3>
            {unreadCount > 0 && (
              <Badge className="bg-[#FF3B30] text-white text-[10px] px-1.5 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleSettings}
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground mb-1">알림이 없어요</p>
              <p className="text-sm text-muted-foreground">
                새로운 소식이 있으면 알려드릴게요
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "w-full px-4 py-3 flex gap-3 text-left transition-colors hover:bg-muted/50",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg",
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
                          "text-sm line-clamp-1",
                          !notification.isRead && "font-semibold"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#126BFF] shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        {formatNotificationTime(notification.timestamp)}
                      </span>
                      {notification.actionLabel && (
                        <span className="text-[11px] text-[#126BFF] font-medium flex items-center gap-0.5">
                          {notification.actionLabel}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 5 && (
          <>
            <Separator />
            <button
              onClick={handleViewAll}
              className="w-full py-3 text-center text-sm font-medium text-[#126BFF] hover:bg-muted/50 transition-colors rounded-b-xl"
            >
              전체 보기
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

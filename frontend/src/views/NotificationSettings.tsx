"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Bell,
  Mail,
  Moon,
  Home,
  TrendingDown,
  MessageCircle,
  Calendar,
  Newspaper,
  Megaphone,
  BarChart3,
  FileText,
} from "lucide-react";
import {
  defaultNotificationSettings,
  type NotificationSettings,
} from "@/data/notifications";
import { cn } from "@/lib/utils";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  highlighted?: boolean;
}

function SettingItem({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  highlighted,
}: SettingItemProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-4 transition-all duration-500 rounded-lg px-3 -mx-3",
        highlighted && "animate-highlight-pulse"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
          highlighted ? "bg-[#126BFF] text-white" : "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function NotificationSettings() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const marketingRef = useRef<HTMLDivElement>(null);
  const [highlightMarketing, setHighlightMarketing] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(
    defaultNotificationSettings
  );

  useEffect(() => {
    const highlight = searchParams?.get("highlight");
    if (highlight === "marketing") {
      setTimeout(() => {
        marketingRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setHighlightMarketing(true);
        setTimeout(() => setHighlightMarketing(false), 3000);
      }, 300);
    }
  }, [searchParams]);

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <style jsx global>{`
        @keyframes highlight-pulse {
          0%, 100% {
            background: transparent;
          }
          25% {
            background: linear-gradient(135deg, rgba(18, 107, 255, 0.15) 0%, rgba(18, 107, 255, 0.05) 100%);
          }
          50% {
            background: linear-gradient(135deg, rgba(18, 107, 255, 0.25) 0%, rgba(18, 107, 255, 0.1) 100%);
          }
          75% {
            background: linear-gradient(135deg, rgba(18, 107, 255, 0.15) 0%, rgba(18, 107, 255, 0.05) 100%);
          }
        }
        .animate-highlight-pulse {
          animation: highlight-pulse 2s ease-in-out 2;
        }
      `}</style>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">알림 설정</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">푸시 알림</CardTitle>
            </div>
            <CardDescription>
              앱으로 실시간 알림을 받아보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y px-0">
            <div className="px-6">
              <SettingItem
                icon={<Home className="w-5 h-5" />}
                title="새 매물 알림"
                description="저장한 조건에 맞는 매물이 등록되면 알려드려요"
                checked={settings.pushNewProperty}
                onCheckedChange={(v) => updateSetting("pushNewProperty", v)}
              />
            </div>
            <div className="px-6">
              <SettingItem
                icon={<TrendingDown className="w-5 h-5" />}
                title="가격 변동 알림"
                description="관심 매물 가격이 변동되면 바로 알려드려요"
                checked={settings.pushPriceChange}
                onCheckedChange={(v) => updateSetting("pushPriceChange", v)}
              />
            </div>
            <div className="px-6">
              <SettingItem
                icon={<MessageCircle className="w-5 h-5" />}
                title="중개사 메시지"
                description="중개사님이 보낸 메시지를 실시간으로 받아요"
                checked={settings.pushMessage}
                onCheckedChange={(v) => updateSetting("pushMessage", v)}
              />
            </div>
            <div className="px-6">
              <SettingItem
                icon={<Calendar className="w-5 h-5" />}
                title="일정 알림"
                description="상담 예약, 청약 일정 등을 미리 알려드려요"
                checked={settings.pushSchedule}
                onCheckedChange={(v) => updateSetting("pushSchedule", v)}
              />
            </div>
            <div className="px-6">
              <SettingItem
                icon={<Newspaper className="w-5 h-5" />}
                title="부동산 소식"
                description="청약, 정책 변화 등 중요한 소식을 전해드려요"
                checked={settings.pushNews}
                onCheckedChange={(v) => updateSetting("pushNews", v)}
              />
            </div>
            <div className="px-6" ref={marketingRef} id="marketing-setting">
              <SettingItem
                icon={<Megaphone className="w-5 h-5" />}
                title="마케팅 알림"
                description="이벤트, 프로모션 정보를 받아보세요"
                checked={settings.pushMarketing}
                onCheckedChange={(v) => updateSetting("pushMarketing", v)}
                highlighted={highlightMarketing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">이메일 알림</CardTitle>
            </div>
            <CardDescription>
              정기 리포트와 소식을 이메일로 받아보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y px-0">
            <div className="px-6">
              <SettingItem
                icon={<BarChart3 className="w-5 h-5" />}
                title="주간 리포트"
                description="매주 관심 지역 시세 동향을 정리해 드려요"
                checked={settings.emailWeeklyReport}
                onCheckedChange={(v) => updateSetting("emailWeeklyReport", v)}
              />
            </div>
            <div className="px-6">
              <SettingItem
                icon={<FileText className="w-5 h-5" />}
                title="월간 리포트"
                description="한 달간의 부동산 시장 분석을 보내드려요"
                checked={settings.emailMonthlyReport}
                onCheckedChange={(v) => updateSetting("emailMonthlyReport", v)}
              />
            </div>
            <div className="px-6">
              <SettingItem
                icon={<Newspaper className="w-5 h-5" />}
                title="부동산 뉴스레터"
                description="주요 부동산 뉴스를 모아서 보내드려요"
                checked={settings.emailNews}
                onCheckedChange={(v) => updateSetting("emailNews", v)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">방해 금지 시간</CardTitle>
            </div>
            <CardDescription>
              설정한 시간 동안은 알림을 받지 않아요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">방해 금지 모드</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.quietHoursEnabled
                      ? `${settings.quietHoursStart} ~ ${settings.quietHoursEnd}`
                      : "꺼짐"}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.quietHoursEnabled}
                onCheckedChange={(v) => updateSetting("quietHoursEnabled", v)}
              />
            </div>

            {settings.quietHoursEnabled && (
              <div className="mt-4 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      시작 시간
                    </Label>
                    <select
                      value={settings.quietHoursStart}
                      onChange={(e) =>
                        updateSetting("quietHoursStart", e.target.value)
                      }
                      className="mt-1 w-full bg-background border rounded-lg px-3 py-2 text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <option key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <span className="text-muted-foreground pt-5">~</span>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      종료 시간
                    </Label>
                    <select
                      value={settings.quietHoursEnd}
                      onChange={(e) =>
                        updateSetting("quietHoursEnd", e.target.value)
                      }
                      className="mt-1 w-full bg-background border rounded-lg px-3 py-2 text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <option key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="pb-8">
          <p className="text-xs text-muted-foreground text-center">
            알림 설정은 기기의 알림 권한 설정에 따라 달라질 수 있어요.
            <br />
            기기 설정에서 알림 권한을 확인해주세요.
          </p>
        </div>
      </main>
    </div>
  );
}

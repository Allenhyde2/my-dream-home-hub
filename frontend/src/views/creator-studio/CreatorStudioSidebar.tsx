"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BookOpen, CalendarDays, ChevronDown, ArrowLeft, Palette } from "lucide-react";
import { useNavigate } from "@/hooks/use-navigate";
import type { SectionKey } from "@/data/creator-studio";

interface CreatorStudioSidebarProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}

const courseItems: { key: SectionKey; label: string }[] = [
  { key: "course-management", label: "강의 관리" },
  { key: "course-sales", label: "강의 판매" },
];

const consultationItems: { key: SectionKey; label: string }[] = [
  { key: "consultation-scheduler", label: "상담 예약 스케줄러" },
  { key: "consultation-notifications", label: "알림" },
  { key: "available-time-settings", label: "예약 가능 시간 설정" },
  { key: "consultation-room", label: "상담 전용 화면" },
  { key: "ai-consultation-history", label: "AI 상담 이력 관리" },
];

export default function CreatorStudioSidebar({
  activeSection,
  onSectionChange,
}: CreatorStudioSidebarProps) {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            data-testid="sidebar-back"
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-sidebar-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span className="font-semibold">크리에이터 스튜디오</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                강의
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu>
                {courseItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={activeSection === item.key}
                      onClick={() => onSectionChange(item.key)}
                      data-testid={`sidebar-${item.key}`}
                    >
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                상담예약
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu>
                {consultationItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={activeSection === item.key}
                      onClick={() => onSectionChange(item.key)}
                      data-testid={`sidebar-${item.key}`}
                    >
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

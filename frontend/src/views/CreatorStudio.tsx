"use client";

import { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import CreatorStudioSidebar from "./creator-studio/CreatorStudioSidebar";
import CourseSales from "./creator-studio/CourseSales";
import CourseManagement from "./creator-studio/CourseManagement";
import ConsultationScheduler from "./creator-studio/ConsultationScheduler";
import ConsultationNotifications from "./creator-studio/ConsultationNotifications";
import AvailableTimeSettings from "./creator-studio/AvailableTimeSettings";
import ConsultationRoom from "./creator-studio/ConsultationRoom";
import AIConsultationHistory from "./creator-studio/AIConsultationHistory";
import type { SectionKey } from "@/data/creator-studio";

const sectionTitles: Record<SectionKey, string> = {
  "course-sales": "강의 판매",
  "course-management": "강의 관리",
  "consultation-scheduler": "상담 예약 스케줄러",
  "consultation-notifications": "알림",
  "available-time-settings": "예약 가능 시간 설정",
  "consultation-room": "상담 전용 화면",
  "ai-consultation-history": "AI 상담 이력 관리",
};

function renderContent(activeSection: SectionKey) {
  switch (activeSection) {
    case "course-sales":
      return <CourseSales />;
    case "course-management":
      return <CourseManagement />;
    case "consultation-scheduler":
      return <ConsultationScheduler />;
    case "consultation-notifications":
      return <ConsultationNotifications />;
    case "available-time-settings":
      return <AvailableTimeSettings />;
    case "consultation-room":
      return <ConsultationRoom />;
    case "ai-consultation-history":
      return <AIConsultationHistory />;
  }
}

export default function CreatorStudio() {
  const [activeSection, setActiveSection] =
    useState<SectionKey>("course-management");

  return (
    <SidebarProvider>
      <CreatorStudioSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="font-semibold">{sectionTitles[activeSection]}</h1>
        </header>
        <main className="flex-1 p-6">{renderContent(activeSection)}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

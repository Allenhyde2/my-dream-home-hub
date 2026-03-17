// ─── Interfaces ───────────────────────────────────────────────

export interface CreatorCourse {
  id: number;
  title: string;
  status: "draft" | "published" | "archived";
  price: number;
  studentCount: number;
  rating: number;
  totalRevenue: number;
  lastEdited: string;
  description: string;
  thumbnail: string;
}

export interface CourseSaleRecord {
  courseId: number;
  courseTitle: string;
  totalRevenue: number;
  monthlySales: number;
  refundCount: number;
  refundRate: number;
}

export interface CourseProgressRecord {
  courseId: number;
  courseTitle: string;
  totalStudents: number;
  completionRate: number;
  avgProgress: number;
  activeStudents: number;
}

export interface ConsultationBookingRecord {
  id: number;
  clientName: string;
  date: string;
  time: string;
  type: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  price: number;
}

export interface ConsultationNotificationItem {
  id: number;
  type: "new_booking" | "cancellation" | "reminder" | "review";
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface WeeklyTimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface ConsultationSessionItem {
  id: number;
  clientName: string;
  date: string;
  time: string;
  status: "waiting" | "in_progress" | "completed";
  productName: string;
}

export interface AIConsultationRecord {
  id: number;
  clientName: string;
  date: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  keyTopics: string[];
  followUpNeeded: boolean;
}

// ─── Section Keys ─────────────────────────────────────────────

export const SECTION_KEYS = [
  "course-create",
  "course-sales",
  "course-progress",
  "course-management",
  "consultation-scheduler",
  "consultation-notifications",
  "available-time-settings",
  "consultation-room",
  "ai-consultation-history",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

// ─── Mock Data ────────────────────────────────────────────────

export const mockCreatorCourses: CreatorCourse[] = [
  {
    id: 1,
    title: "재건축 투자 완전정복",
    status: "published",
    price: 89000,
    studentCount: 342,
    rating: 4.8,
    totalRevenue: 30438000,
    lastEdited: "2026-03-10",
    description: "재건축 투자의 A부터 Z까지, 실전 사례와 함께 배우는 강의입니다.",
    thumbnail: "/images/courses/course-rebuild.jpg",
  },
  {
    id: 2,
    title: "청약 당첨 전략 마스터",
    status: "published",
    price: 69000,
    studentCount: 215,
    rating: 4.6,
    totalRevenue: 14835000,
    lastEdited: "2026-03-08",
    description: "청약 가점 계산부터 당첨 확률 높이는 전략까지 총정리합니다.",
    thumbnail: "/images/courses/course-subscription.jpg",
  },
  {
    id: 3,
    title: "부동산 절세 가이드 2026",
    status: "draft",
    price: 49000,
    studentCount: 0,
    rating: 0,
    totalRevenue: 0,
    lastEdited: "2026-03-15",
    description: "양도세, 취득세, 종부세 절세 방법을 실전 사례로 알려드립니다.",
    thumbnail: "/images/courses/course-tax.jpg",
  },
  {
    id: 4,
    title: "경매 입문: 첫 낙찰까지",
    status: "draft",
    price: 59000,
    studentCount: 0,
    rating: 0,
    totalRevenue: 0,
    lastEdited: "2026-03-12",
    description: "경매 초보자를 위한 입찰부터 낙찰, 명도까지 전 과정 안내.",
    thumbnail: "/images/courses/course-auction.jpg",
  },
  {
    id: 5,
    title: "신도시 분양권 분석법",
    status: "archived",
    price: 79000,
    studentCount: 128,
    rating: 4.3,
    totalRevenue: 10112000,
    lastEdited: "2025-11-20",
    description: "3기 신도시 분양권 투자 분석 방법론을 다룹니다.",
    thumbnail: "/images/courses/course-newtown.jpg",
  },
];

export const mockCourseSales: CourseSaleRecord[] = [
  {
    courseId: 1,
    courseTitle: "재건축 투자 완전정복",
    totalRevenue: 30438000,
    monthlySales: 4272000,
    refundCount: 3,
    refundRate: 0.9,
  },
  {
    courseId: 2,
    courseTitle: "청약 당첨 전략 마스터",
    totalRevenue: 14835000,
    monthlySales: 2070000,
    refundCount: 1,
    refundRate: 0.5,
  },
  {
    courseId: 5,
    courseTitle: "신도시 분양권 분석법",
    totalRevenue: 10112000,
    monthlySales: 0,
    refundCount: 5,
    refundRate: 3.9,
  },
];

export const mockCourseProgress: CourseProgressRecord[] = [
  {
    courseId: 1,
    courseTitle: "재건축 투자 완전정복",
    totalStudents: 342,
    completionRate: 68.4,
    avgProgress: 72.1,
    activeStudents: 189,
  },
  {
    courseId: 2,
    courseTitle: "청약 당첨 전략 마스터",
    totalStudents: 215,
    completionRate: 54.2,
    avgProgress: 61.8,
    activeStudents: 97,
  },
  {
    courseId: 5,
    courseTitle: "신도시 분양권 분석법",
    totalStudents: 128,
    completionRate: 82.0,
    avgProgress: 88.5,
    activeStudents: 12,
  },
];

export const mockConsultationBookings: ConsultationBookingRecord[] = [
  {
    id: 1,
    clientName: "김철수",
    date: "2026-03-18",
    time: "10:00",
    type: "재건축 상담",
    status: "confirmed",
    price: 150000,
  },
  {
    id: 2,
    clientName: "이영희",
    date: "2026-03-18",
    time: "14:00",
    type: "청약 전략 상담",
    status: "pending",
    price: 120000,
  },
  {
    id: 3,
    clientName: "박민수",
    date: "2026-03-19",
    time: "11:00",
    type: "절세 상담",
    status: "confirmed",
    price: 150000,
  },
  {
    id: 4,
    clientName: "최지은",
    date: "2026-03-15",
    time: "15:00",
    type: "경매 상담",
    status: "completed",
    price: 130000,
  },
  {
    id: 5,
    clientName: "정하늘",
    date: "2026-03-16",
    time: "09:00",
    type: "분양권 상담",
    status: "cancelled",
    price: 120000,
  },
];

export const mockNotifications: ConsultationNotificationItem[] = [
  {
    id: 1,
    type: "new_booking",
    message: "김철수님이 3월 18일 재건축 상담을 예약했습니다.",
    createdAt: "2026-03-17T08:30:00",
    isRead: false,
  },
  {
    id: 2,
    type: "reminder",
    message: "내일 10:00 김철수님 상담이 예정되어 있습니다.",
    createdAt: "2026-03-17T09:00:00",
    isRead: false,
  },
  {
    id: 3,
    type: "cancellation",
    message: "정하늘님이 3월 16일 분양권 상담을 취소했습니다.",
    createdAt: "2026-03-15T14:20:00",
    isRead: true,
  },
  {
    id: 4,
    type: "review",
    message: "최지은님이 경매 상담에 별점 5점 리뷰를 남겼습니다.",
    createdAt: "2026-03-15T18:45:00",
    isRead: true,
  },
  {
    id: 5,
    type: "new_booking",
    message: "이영희님이 3월 18일 청약 전략 상담을 예약했습니다.",
    createdAt: "2026-03-16T11:10:00",
    isRead: false,
  },
];

export const mockWeeklySchedule: WeeklyTimeSlot[] = [
  { day: "월", startTime: "09:00", endTime: "18:00", isActive: true },
  { day: "화", startTime: "09:00", endTime: "18:00", isActive: true },
  { day: "수", startTime: "10:00", endTime: "17:00", isActive: true },
  { day: "목", startTime: "09:00", endTime: "18:00", isActive: true },
  { day: "금", startTime: "09:00", endTime: "16:00", isActive: true },
  { day: "토", startTime: "00:00", endTime: "00:00", isActive: false },
  { day: "일", startTime: "00:00", endTime: "00:00", isActive: false },
];

export const mockTodaySessions: ConsultationSessionItem[] = [
  {
    id: 1,
    clientName: "김철수",
    date: "2026-03-17",
    time: "10:00",
    status: "completed",
    productName: "재건축 투자 1:1 상담",
  },
  {
    id: 2,
    clientName: "이영희",
    date: "2026-03-17",
    time: "14:00",
    status: "in_progress",
    productName: "청약 전략 컨설팅",
  },
  {
    id: 3,
    clientName: "박민수",
    date: "2026-03-17",
    time: "16:00",
    status: "waiting",
    productName: "절세 전략 상담",
  },
];

export const mockAIRecords: AIConsultationRecord[] = [
  {
    id: 1,
    clientName: "김철수",
    date: "2026-03-10",
    summary:
      "강남구 재건축 아파트 투자 시점과 예상 수익률에 대해 상담. 고객은 2~3년 내 매도 계획이며 세금 절감 방안도 함께 논의함.",
    sentiment: "positive",
    keyTopics: ["재건축", "강남구", "수익률", "양도세"],
    followUpNeeded: true,
  },
  {
    id: 2,
    clientName: "최지은",
    date: "2026-03-08",
    summary:
      "서울 외곽 경매 물건 3건에 대한 입찰가 분석 요청. 권리분석 결과 1건은 리스크가 높아 제외 권고함.",
    sentiment: "neutral",
    keyTopics: ["경매", "권리분석", "입찰가", "리스크"],
    followUpNeeded: false,
  },
  {
    id: 3,
    clientName: "이영희",
    date: "2026-03-05",
    summary:
      "3기 신도시 청약 전략 상담. 가점이 낮아 추첨제 위주로 접근하기로 하고, 사전청약 일정을 공유함.",
    sentiment: "positive",
    keyTopics: ["청약", "3기 신도시", "추첨제", "사전청약"],
    followUpNeeded: true,
  },
  {
    id: 4,
    clientName: "정하늘",
    date: "2026-03-01",
    summary:
      "분양권 전매 관련 세금 문제로 상담. 전매 제한 기간과 양도세 중과 여부를 확인하고 대안을 제시함.",
    sentiment: "negative",
    keyTopics: ["분양권", "전매", "양도세", "중과"],
    followUpNeeded: true,
  },
];

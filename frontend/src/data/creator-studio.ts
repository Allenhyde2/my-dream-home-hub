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

export interface CourseChapterProgress {
  chapterId: number;
  chapterTitle: string;
  completionRate: number;
  totalLessons: number;
  completedLessons: number;
}

export interface StudentActivityRecord {
  id: number;
  studentName: string;
  lastActive: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
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

export interface AIConsultationDetailRecord {
  id: number;
  clientName: string;
  date: string;
  duration: string;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  actionItems: string[];
  marketAnalysis?: string;
  riskFactors?: string[];
  sentiment: "positive" | "neutral" | "negative";
  keyTopics: string[];
}

// ─── Section Keys ─────────────────────────────────────────────

export const SECTION_KEYS = [
  "course-sales",
  "course-management",
  "consultation-scheduler",
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

export const mockChapterProgress: Record<number, CourseChapterProgress[]> = {
  1: [
    { chapterId: 1, chapterTitle: "재건축의 기본 개념", completionRate: 92.1, totalLessons: 5, completedLessons: 5 },
    { chapterId: 2, chapterTitle: "재건축 사업 절차 이해", completionRate: 84.5, totalLessons: 6, completedLessons: 5 },
    { chapterId: 3, chapterTitle: "조합원 자격과 분담금", completionRate: 71.3, totalLessons: 4, completedLessons: 3 },
    { chapterId: 4, chapterTitle: "재건축 투자 수익 분석", completionRate: 58.2, totalLessons: 5, completedLessons: 3 },
    { chapterId: 5, chapterTitle: "실전 재건축 사례 연구", completionRate: 42.7, totalLessons: 4, completedLessons: 2 },
  ],
  2: [
    { chapterId: 1, chapterTitle: "청약 제도 기초", completionRate: 88.4, totalLessons: 4, completedLessons: 4 },
    { chapterId: 2, chapterTitle: "가점제와 추첨제 전략", completionRate: 72.6, totalLessons: 5, completedLessons: 4 },
    { chapterId: 3, chapterTitle: "특별공급 완전 분석", completionRate: 55.8, totalLessons: 4, completedLessons: 2 },
    { chapterId: 4, chapterTitle: "당첨 확률 높이는 실전 팁", completionRate: 38.1, totalLessons: 5, completedLessons: 2 },
  ],
  5: [
    { chapterId: 1, chapterTitle: "신도시 개발 계획 읽기", completionRate: 95.3, totalLessons: 4, completedLessons: 4 },
    { chapterId: 2, chapterTitle: "분양권 가치 평가 방법", completionRate: 89.1, totalLessons: 5, completedLessons: 4 },
    { chapterId: 3, chapterTitle: "프리미엄 분석과 매매 전략", completionRate: 82.0, totalLessons: 4, completedLessons: 3 },
    { chapterId: 4, chapterTitle: "3기 신도시 투자 포인트", completionRate: 76.6, totalLessons: 5, completedLessons: 4 },
  ],
};

export const mockStudentActivity: Record<number, StudentActivityRecord[]> = {
  1: [
    { id: 1, studentName: "김서연", lastActive: "2026-03-17", progress: 85.2, completedLessons: 20, totalLessons: 24 },
    { id: 2, studentName: "박준혁", lastActive: "2026-03-16", progress: 62.5, completedLessons: 15, totalLessons: 24 },
    { id: 3, studentName: "이하은", lastActive: "2026-03-15", progress: 41.7, completedLessons: 10, totalLessons: 24 },
    { id: 4, studentName: "정우진", lastActive: "2026-03-14", progress: 29.2, completedLessons: 7, totalLessons: 24 },
  ],
  2: [
    { id: 5, studentName: "한소희", lastActive: "2026-03-17", progress: 77.8, completedLessons: 14, totalLessons: 18 },
    { id: 6, studentName: "오민재", lastActive: "2026-03-16", progress: 55.6, completedLessons: 10, totalLessons: 18 },
    { id: 7, studentName: "윤채원", lastActive: "2026-03-13", progress: 33.3, completedLessons: 6, totalLessons: 18 },
  ],
  5: [
    { id: 8, studentName: "송지호", lastActive: "2026-03-10", progress: 94.4, completedLessons: 17, totalLessons: 18 },
    { id: 9, studentName: "강예린", lastActive: "2026-03-08", progress: 88.9, completedLessons: 16, totalLessons: 18 },
    { id: 10, studentName: "임도현", lastActive: "2026-03-05", progress: 72.2, completedLessons: 13, totalLessons: 18 },
  ],
};

export const mockConsultationBookings: ConsultationBookingRecord[] = [
  // ── February 2026 ──
  {
    id: 1,
    clientName: "김철수",
    date: "2026-02-05",
    time: "10:00",
    type: "재건축 상담",
    status: "completed",
    price: 150000,
  },
  {
    id: 2,
    clientName: "이영희",
    date: "2026-02-10",
    time: "14:00",
    type: "청약 전략 상담",
    status: "completed",
    price: 120000,
  },
  {
    id: 3,
    clientName: "박민수",
    date: "2026-02-14",
    time: "11:00",
    type: "절세 상담",
    status: "completed",
    price: 150000,
  },
  {
    id: 4,
    clientName: "최지은",
    date: "2026-02-18",
    time: "15:00",
    type: "경매 상담",
    status: "cancelled",
    price: 130000,
  },
  {
    id: 5,
    clientName: "정하늘",
    date: "2026-02-25",
    time: "09:00",
    type: "분양권 상담",
    status: "completed",
    price: 120000,
  },
  // ── March 2026 ──
  {
    id: 6,
    clientName: "한소희",
    date: "2026-03-03",
    time: "10:00",
    type: "GTX 역세권 상담",
    status: "completed",
    price: 140000,
  },
  {
    id: 7,
    clientName: "오민재",
    date: "2026-03-08",
    time: "13:00",
    type: "전세 전환 상담",
    status: "confirmed",
    price: 110000,
  },
  {
    id: 8,
    clientName: "윤채원",
    date: "2026-03-12",
    time: "15:00",
    type: "갭투자 상담",
    status: "pending",
    price: 130000,
  },
  {
    id: 9,
    clientName: "송지호",
    date: "2026-03-18",
    time: "10:00",
    type: "재건축 상담",
    status: "confirmed",
    price: 150000,
  },
  {
    id: 10,
    clientName: "강예린",
    date: "2026-03-22",
    time: "14:00",
    type: "리모델링 상담",
    status: "cancelled",
    price: 120000,
  },
  // ── April 2026 ──
  {
    id: 11,
    clientName: "임도현",
    date: "2026-04-02",
    time: "11:00",
    type: "청약 전략 상담",
    status: "pending",
    price: 120000,
  },
  {
    id: 12,
    clientName: "조서연",
    date: "2026-04-07",
    time: "09:00",
    type: "경매 상담",
    status: "confirmed",
    price: 130000,
  },
  {
    id: 13,
    clientName: "김태윤",
    date: "2026-04-11",
    time: "16:00",
    type: "절세 상담",
    status: "pending",
    price: 150000,
  },
  {
    id: 14,
    clientName: "이수빈",
    date: "2026-04-18",
    time: "10:00",
    type: "분양권 상담",
    status: "confirmed",
    price: 120000,
  },
  {
    id: 15,
    clientName: "박지훈",
    date: "2026-04-25",
    time: "14:00",
    type: "GTX 역세권 상담",
    status: "pending",
    price: 140000,
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
    clientName: "이영희",
    date: "2026-03-05",
    summary:
      "3기 신도시 청약 전략 상담. 가점이 낮아 추첨제 위주로 접근하기로 하고, 사전청약 일정을 공유함.",
    sentiment: "positive",
    keyTopics: ["청약", "3기 신도시", "추첨제", "사전청약"],
    followUpNeeded: true,
  },
  {
    id: 3,
    clientName: "박민수",
    date: "2026-02-28",
    summary:
      "종합부동산세 절세 방안 상담. 1세대 1주택 비과세 요건과 장기보유특별공제 적용 가능성을 분석함.",
    sentiment: "positive",
    keyTopics: ["절세", "종부세", "비과세", "장기보유공제"],
    followUpNeeded: false,
  },
  {
    id: 4,
    clientName: "최지은",
    date: "2026-02-20",
    summary:
      "서울 외곽 경매 물건 3건에 대한 입찰가 분석 요청. 권리분석 결과 1건은 리스크가 높아 제외 권고함.",
    sentiment: "neutral",
    keyTopics: ["경매", "권리분석", "입찰가", "리스크"],
    followUpNeeded: false,
  },
  {
    id: 5,
    clientName: "정하늘",
    date: "2026-02-15",
    summary:
      "분양권 전매 관련 세금 문제로 상담. 전매 제한 기간과 양도세 중과 여부를 확인하고 대안을 제시함.",
    sentiment: "negative",
    keyTopics: ["분양권", "전매", "양도세", "중과"],
    followUpNeeded: true,
  },
  {
    id: 6,
    clientName: "한소희",
    date: "2026-02-10",
    summary:
      "GTX-A 노선 개통에 따른 역세권 아파트 가격 변동 전망 상담. 파주·동탄 지역 비교 분석을 진행함.",
    sentiment: "positive",
    keyTopics: ["GTX", "역세권", "파주", "동탄"],
    followUpNeeded: true,
  },
  {
    id: 7,
    clientName: "오민재",
    date: "2026-01-28",
    summary:
      "전세 만기 후 월세 전환 시 수익률 비교 상담. 현재 전세가율과 월세 시세를 기반으로 최적 전환 비율을 산출함.",
    sentiment: "neutral",
    keyTopics: ["전세", "월세", "전환", "수익률"],
    followUpNeeded: false,
  },
  {
    id: 8,
    clientName: "윤채원",
    date: "2026-01-22",
    summary:
      "갭투자 리스크 분석 요청. 전세가율 하락 추세에서의 역전세 위험과 대출 규제 영향을 설명함.",
    sentiment: "negative",
    keyTopics: ["갭투자", "역전세", "전세가율", "대출규제"],
    followUpNeeded: true,
  },
  {
    id: 9,
    clientName: "강예린",
    date: "2026-01-15",
    summary:
      "노후 아파트 리모델링 투자 가치 분석. 리모델링 조합 설립 현황과 예상 분담금을 검토함.",
    sentiment: "neutral",
    keyTopics: ["리모델링", "분담금", "조합", "노후아파트"],
    followUpNeeded: false,
  },
  {
    id: 10,
    clientName: "임도현",
    date: "2026-01-10",
    summary:
      "다주택자 양도세 중과 유예 기간 활용 전략 상담. 매도 순서와 시기별 세금 시뮬레이션을 제공함.",
    sentiment: "negative",
    keyTopics: ["양도세", "중과", "다주택", "매도전략"],
    followUpNeeded: true,
  },
  {
    id: 11,
    clientName: "송지호",
    date: "2026-03-12",
    summary:
      "수도권 신축 아파트 분양 일정 및 청약 가점 분석. 특별공급 자격 요건을 확인하고 전략을 수립함.",
    sentiment: "neutral",
    keyTopics: ["청약", "특별공급", "가점", "신축"],
    followUpNeeded: false,
  },
  {
    id: 12,
    clientName: "조서연",
    date: "2026-03-14",
    summary:
      "상가 투자 수익률 분석 상담. 공실 리스크와 임대차 계약 조건을 검토하고 대안 물건을 추천함.",
    sentiment: "negative",
    keyTopics: ["상가", "수익률", "공실", "임대차"],
    followUpNeeded: true,
  },
];

export const mockAIConsultationDetails: Record<number, AIConsultationDetailRecord> = {
  1: {
    id: 1,
    clientName: "김철수",
    date: "2026-03-10",
    duration: "45분",
    summary:
      "강남구 재건축 아파트 투자 시점과 예상 수익률에 대해 심층 상담을 진행했습니다. 고객은 2~3년 내 매도를 계획하고 있으며, 양도세 절감 방안과 함께 최적 매도 시점을 분석했습니다.",
    keyPoints: [
      "강남구 주요 재건축 단지 사업 진행 현황 분석",
      "예상 분담금 대비 시세 차익 시뮬레이션",
      "2~3년 내 매도 시 양도세 예상 금액 산출",
      "재건축 초과이익환수제 적용 여부 확인",
    ],
    recommendations: [
      "조합원 입주권 확보 후 준공 전 매도 검토",
      "장기보유특별공제 적용을 위한 보유 기간 전략 수립",
      "세무사 연계 상담을 통한 절세 플랜 확정",
    ],
    actionItems: [
      "해당 단지 관리처분인가 일정 확인",
      "양도세 시뮬레이션 보고서 발송",
      "2주 내 후속 상담 일정 잡기",
      "세무사 소개 및 연계 진행",
    ],
    marketAnalysis:
      "강남구 재건축 시장은 안전마진 확보 구간에 진입했으며, 2026년 하반기 관리처분인가 예정 단지들의 가격 상승이 예상됩니다.",
    riskFactors: [
      "재건축 초과이익환수제 부담금 증가 가능성",
      "금리 인상에 따른 분담금 부담 확대",
      "사업 지연 리스크",
    ],
    sentiment: "positive",
    keyTopics: ["재건축", "강남구", "수익률", "양도세"],
  },
  2: {
    id: 2,
    clientName: "이영희",
    date: "2026-03-05",
    duration: "35분",
    summary:
      "3기 신도시 청약 전략에 대해 상담했습니다. 가점이 낮아 추첨제 위주로 접근하기로 결정했으며, 사전청약 일정과 자격 요건을 상세히 검토했습니다.",
    keyPoints: [
      "현재 청약 가점 42점으로 가점제 당첨 어려움",
      "추첨제 85㎡ 초과 물량 집중 공략 전략",
      "사전청약 vs 본청약 장단점 비교",
    ],
    recommendations: [
      "85㎡ 초과 추첨제 물량 위주로 청약 전략 수립",
      "청약통장 납입 인정 횟수 최대화를 위한 추가 납입",
      "특별공급 자격 요건 재확인",
    ],
    actionItems: [
      "3기 신도시 사전청약 일정표 발송",
      "청약 가점 상세 계산서 작성",
      "추첨제 당첨 확률 시뮬레이션 제공",
    ],
    sentiment: "positive",
    keyTopics: ["청약", "3기 신도시", "추첨제", "사전청약"],
  },
  4: {
    id: 4,
    clientName: "최지은",
    date: "2026-02-20",
    duration: "50분",
    summary:
      "서울 외곽 경매 물건 3건에 대한 입찰가 분석을 진행했습니다. 권리분석 결과 1건은 선순위 임차인 리스크가 높아 제외를 권고했으며, 나머지 2건의 적정 입찰가를 산출했습니다.",
    keyPoints: [
      "물건 A: 감정가 대비 70% 수준 입찰 권고",
      "물건 B: 감정가 대비 75% 수준 입찰 권고",
      "물건 C: 선순위 임차인 보증금 미반환 리스크로 제외",
      "명도 소요 기간 및 비용 예상치 산출",
    ],
    recommendations: [
      "물건 A를 1순위로 입찰 진행",
      "낙찰 후 명도 전문 법무사 연계",
      "대출 사전 승인 확보 후 입찰 참여",
    ],
    actionItems: [
      "물건 A, B 현장 답사 일정 조율",
      "권리분석 보고서 최종본 발송",
      "경매 입찰 대리인 위임장 준비",
      "대출 가능 금액 사전 조회",
    ],
    marketAnalysis:
      "서울 외곽 경매 시장은 낙찰가율이 하락 추세이며, 실수요 목적의 입찰 시 적정 가격에 낙찰받을 기회가 증가하고 있습니다.",
    riskFactors: [
      "선순위 임차인 명도 지연 가능성",
      "건물 하자 및 수리 비용 발생",
      "경매 취소 또는 변경 가능성",
    ],
    sentiment: "neutral",
    keyTopics: ["경매", "권리분석", "입찰가", "리스크"],
  },
  6: {
    id: 6,
    clientName: "한소희",
    date: "2026-02-10",
    duration: "40분",
    summary:
      "GTX-A 노선 개통에 따른 역세권 아파트 가격 변동 전망을 상담했습니다. 파주와 동탄 지역을 비교 분석하고, 투자 적정 시점을 검토했습니다.",
    keyPoints: [
      "GTX-A 개통 후 파주 운정 지역 접근성 대폭 개선",
      "동탄역 인근 아파트 이미 프리미엄 반영 완료",
      "파주 지역 상대적 저평가 구간 존재",
    ],
    recommendations: [
      "파주 운정 역세권 500m 이내 단지 집중 검토",
      "개통 전 매수 후 개통 후 1~2년 보유 전략",
      "동탄은 실거주 목적이 아니면 신규 진입 보류",
    ],
    actionItems: [
      "파주 운정 역세권 단지 리스트 정리",
      "GTX-A 개통 일정 및 노선도 자료 발송",
      "파주 vs 동탄 가격 추이 비교 보고서 작성",
    ],
    marketAnalysis:
      "GTX 개통은 수도권 외곽 지역의 교통 혁신으로, 역세권 500m 이내 단지의 가격 상승이 기대됩니다. 특히 파주 운정은 아직 프리미엄이 충분히 반영되지 않은 상태입니다.",
    riskFactors: [
      "GTX 개통 지연 가능성",
      "파주 지역 공급 과잉 우려",
    ],
    sentiment: "positive",
    keyTopics: ["GTX", "역세권", "파주", "동탄"],
  },
  8: {
    id: 8,
    clientName: "윤채원",
    date: "2026-01-22",
    duration: "55분",
    summary:
      "갭투자 리스크에 대한 심층 분석을 진행했습니다. 전세가율 하락 추세에서의 역전세 위험과 대출 규제 강화에 따른 영향을 상세히 설명하고, 리스크 완화 방안을 제시했습니다.",
    keyPoints: [
      "현재 전세가율 60% 이하로 하락한 지역 다수",
      "역전세 발생 시 보증금 반환 자금 확보 필요",
      "DSR 규제로 추가 대출 한도 제한",
      "전세보증보험 가입 요건 강화 영향",
    ],
    recommendations: [
      "전세가율 70% 이상 유지 지역으로 투자 대상 한정",
      "역전세 대비 비상 자금 최소 3천만원 확보",
      "갭투자 대신 월세 수익형 전환 검토",
    ],
    actionItems: [
      "보유 물건 전세가율 현황 점검 보고서 작성",
      "역전세 시나리오별 자금 계획 수립",
      "월세 전환 시 수익률 시뮬레이션 제공",
      "1개월 내 후속 상담으로 진행 상황 점검",
    ],
    riskFactors: [
      "전세가율 추가 하락 시 역전세 확대",
      "금리 인상에 따른 이자 부담 증가",
      "전세사기 관련 규제 강화로 임대 시장 위축",
    ],
    sentiment: "negative",
    keyTopics: ["갭투자", "역전세", "전세가율", "대출규제"],
  },
};

export type NotificationType = 
  | "property"      // 새 매물
  | "price_change"  // 가격 변동
  | "message"       // 중개사 메시지
  | "schedule"      // 일정 알림
  | "system"        // 시스템 알림
  | "news"          // 뉴스/정보
  | "reward";       // 리워드

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  imageUrl?: string;
  actionLabel?: string;
  actionUrl?: string;
  metadata?: {
    propertyId?: string;
    agentId?: string;
    price?: number;
    address?: string;
  };
}

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  property: "🏠",
  price_change: "💰",
  message: "💬",
  schedule: "📅",
  system: "⚙️",
  news: "📰",
  reward: "🎁",
};

export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  property: "bg-blue-500",
  price_change: "bg-green-500",
  message: "bg-purple-500",
  schedule: "bg-orange-500",
  system: "bg-gray-500",
  news: "bg-indigo-500",
  reward: "bg-yellow-500",
};

// Mock notification data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "property",
    title: "새 매물 등록",
    description: "저장한 '강남구 오피스텔' 조건에 맞는 매물이 2건 등록되었어요",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
    isRead: false,
    actionLabel: "바로 보기",
    actionUrl: "/search?region=강남구&type=오피스텔",
    metadata: {
      address: "강남구 역삼동",
    },
  },
  {
    id: "2",
    type: "message",
    title: "김중개사님이 메시지를 보냈어요",
    description: "네, 해당 매물은 주차가 가능하고 융자도 잘 나옵니다...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    isRead: false,
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=agent1",
    actionLabel: "답장하기",
    actionUrl: "/chat/agent1",
    metadata: {
      agentId: "agent1",
    },
  },
  {
    id: "3",
    type: "price_change",
    title: "관심 매물 가격 하락",
    description: "송파구 잠실동 아파트 가격이 5,000만원 하락했어요",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    isRead: true,
    metadata: {
      propertyId: "prop1",
      price: 850000000,
      address: "송파구 잠실동",
    },
  },
  {
    id: "4",
    type: "schedule",
    title: "상담 예약 리마인더",
    description: "내일 오후 2시 김중개사님과 상담이 예정되어 있어요",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
    isRead: true,
    actionLabel: "상세 보기",
    actionUrl: "/my-reservations",
  },
  {
    id: "5",
    type: "news",
    title: "청약 소식",
    description: "이번 달 서울 청약 일정이 공개되었어요",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    isRead: true,
    actionLabel: "확인하기",
    actionUrl: "/news/subscription",
  },
  {
    id: "6",
    type: "reward",
    title: "리워드 적립!",
    description: "회원가입 축하 3,000P가 적립되었어요",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
    isRead: true,
  },
  {
    id: "7",
    type: "system",
    title: "서비스 업데이트",
    description: "뉴글 앱이 새롭게 업데이트되었어요. 더 편리해진 기능을 만나보세요!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3일 전
    isRead: true,
  },
  {
    id: "8",
    type: "property",
    title: "청약 마감 임박",
    description: "관심 청약 '래미안 포레스트' 접수가 3일 뒤 마감돼요",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4일 전
    isRead: true,
    actionLabel: "청약 정보",
    actionUrl: "/subscription/1",
  },
];

// 알림 설정 타입
export interface NotificationSettings {
  // 푸시 알림
  pushNewProperty: boolean;      // 새 매물 알림
  pushPriceChange: boolean;      // 가격 변동 알림
  pushMessage: boolean;          // 중개사 메시지 알림
  pushSchedule: boolean;         // 일정 알림
  pushNews: boolean;             // 뉴스/정보 알림
  pushMarketing: boolean;        // 마케팅 알림
  
  // 이메일 알림
  emailWeeklyReport: boolean;    // 주간 리포트
  emailMonthlyReport: boolean;   // 월간 리포트
  emailNews: boolean;            // 부동산 뉴스
  
  // 방해 금지 시간
  quietHoursEnabled: boolean;
  quietHoursStart: string;       // "22:00"
  quietHoursEnd: string;         // "08:00"
}

export const defaultNotificationSettings: NotificationSettings = {
  pushNewProperty: true,
  pushPriceChange: true,
  pushMessage: true,
  pushSchedule: true,
  pushNews: true,
  pushMarketing: false,
  
  emailWeeklyReport: true,
  emailMonthlyReport: false,
  emailNews: false,
  
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
};

// 시간 포맷팅 유틸리티
export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

// 알림 그룹핑 (날짜별)
export function groupNotificationsByDate(notifications: Notification[]): {
  label: string;
  notifications: Notification[];
}[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  const thisWeek = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 7);
  
  const groups: { label: string; notifications: Notification[] }[] = [];
  
  const todayNotifs = notifications.filter(n => n.timestamp >= today);
  const yesterdayNotifs = notifications.filter(n => n.timestamp >= yesterday && n.timestamp < today);
  const thisWeekNotifs = notifications.filter(n => n.timestamp >= thisWeek && n.timestamp < yesterday);
  const olderNotifs = notifications.filter(n => n.timestamp < thisWeek);
  
  if (todayNotifs.length > 0) {
    groups.push({ label: "오늘", notifications: todayNotifs });
  }
  if (yesterdayNotifs.length > 0) {
    groups.push({ label: "어제", notifications: yesterdayNotifs });
  }
  if (thisWeekNotifs.length > 0) {
    groups.push({ label: "이번 주", notifications: thisWeekNotifs });
  }
  if (olderNotifs.length > 0) {
    groups.push({ label: "이전", notifications: olderNotifs });
  }
  
  return groups;
}

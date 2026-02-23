export type CourseLevel = "초보" | "중수" | "고수";

export interface CourseLesson {
  id: number;
  title: string;
  duration: string;
  durationSeconds: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: CourseLevel;
  price: number;
  originalPrice: number;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  totalDuration: string;
  lessonCount: number;
  lessons: CourseLesson[];
  tags: string[];
  createdAt: string;
}

export const COURSE_LEVELS: CourseLevel[] = ["초보", "중수", "고수"];

export const courses: Course[] = [
  {
    id: 1,
    title: "부동산 투자 첫걸음: 완전 초보자를 위한 입문 강의",
    description: "부동산 투자를 처음 시작하는 분들을 위한 기초 개념부터 실전 팁까지 알려드립니다. 아파트, 오피스텔, 상가 등 다양한 부동산 유형의 특징과 투자 시 고려해야 할 사항들을 쉽게 설명합니다.",
    instructor: "김부동",
    level: "초보",
    price: 49000,
    originalPrice: 89000,
    thumbnail: "",
    rating: 4.8,
    reviewCount: 342,
    studentCount: 2150,
    totalDuration: "5시간 30분",
    lessonCount: 12,
    lessons: [
      { id: 1, title: "부동산 투자란 무엇인가?", duration: "25분", durationSeconds: 1500 },
      { id: 2, title: "부동산 시장의 기본 구조", duration: "30분", durationSeconds: 1800 },
      { id: 3, title: "아파트 vs 오피스텔 vs 상가", duration: "28분", durationSeconds: 1680 },
      { id: 4, title: "입지 분석의 기초", duration: "32분", durationSeconds: 1920 },
      { id: 5, title: "시세 확인하는 방법", duration: "25분", durationSeconds: 1500 },
      { id: 6, title: "등기부등본 읽는 법", duration: "30분", durationSeconds: 1800 },
      { id: 7, title: "매매 계약서 작성하기", duration: "28분", durationSeconds: 1680 },
      { id: 8, title: "대출의 기초", duration: "25분", durationSeconds: 1500 },
      { id: 9, title: "취득세와 보유세", duration: "22분", durationSeconds: 1320 },
      { id: 10, title: "임대 수익 계산하기", duration: "30분", durationSeconds: 1800 },
      { id: 11, title: "리스크 관리 기초", duration: "25분", durationSeconds: 1500 },
      { id: 12, title: "첫 부동산 구매 체크리스트", duration: "30분", durationSeconds: 1800 }
    ],
    tags: ["입문", "기초", "투자 원리"],
    createdAt: "2025-12-01"
  },
  {
    id: 2,
    title: "청약의 모든 것: A부터 Z까지",
    description: "청약통장 가입부터 당첨까지의 전 과정을 상세히 설명합니다. 청약 점수 계산법, 유리한 청약 전략, 특별공급 활용법 등을 배워보세요.",
    instructor: "박청약",
    level: "초보",
    price: 39000,
    originalPrice: 69000,
    thumbnail: "",
    rating: 4.9,
    reviewCount: 521,
    studentCount: 3420,
    totalDuration: "4시간 15분",
    lessonCount: 10,
    lessons: [
      { id: 1, title: "청약통장의 종류와 선택", duration: "25분", durationSeconds: 1500 },
      { id: 2, title: "청약 점수 계산하기", duration: "30분", durationSeconds: 1800 },
      { id: 3, title: "1순위 조건 완벽 분석", duration: "28분", durationSeconds: 1680 },
      { id: 4, title: "특별공급 총정리", duration: "32분", durationSeconds: 1920 },
      { id: 5, title: "분양가 상한제 이해하기", duration: "25분", durationSeconds: 1500 },
      { id: 6, title: "모델하우스 방문 가이드", duration: "22분", durationSeconds: 1320 },
      { id: 7, title: "청약 신청 실전 가이드", duration: "28분", durationSeconds: 1680 },
      { id: 8, title: "당첨 후 절차", duration: "25분", durationSeconds: 1500 },
      { id: 9, title: "계약금과 중도금 대출", duration: "30분", durationSeconds: 1800 },
      { id: 10, title: "전매와 입주 전략", duration: "20분", durationSeconds: 1200 }
    ],
    tags: ["청약", "분양", "신축"],
    createdAt: "2025-11-15"
  },
  {
    id: 3,
    title: "전세 vs 월세: 현명한 선택 가이드",
    description: "전세와 월세의 장단점을 비교하고, 나에게 맞는 선택을 할 수 있도록 도와드립니다. 전세자금대출, 월세 세액공제 등 실용적인 정보를 제공합니다.",
    instructor: "이임대",
    level: "초보",
    price: 29000,
    originalPrice: 49000,
    thumbnail: "",
    rating: 4.7,
    reviewCount: 189,
    studentCount: 1280,
    totalDuration: "3시간",
    lessonCount: 8,
    lessons: [
      { id: 1, title: "전세와 월세의 기본 개념", duration: "22분", durationSeconds: 1320 },
      { id: 2, title: "전세자금대출 완전 분석", duration: "28분", durationSeconds: 1680 },
      { id: 3, title: "적정 전세가 계산하기", duration: "25분", durationSeconds: 1500 },
      { id: 4, title: "월세 전환율 이해하기", duration: "22분", durationSeconds: 1320 },
      { id: 5, title: "전세 사기 예방법", duration: "30분", durationSeconds: 1800 },
      { id: 6, title: "임대차 계약서 체크포인트", duration: "25분", durationSeconds: 1500 },
      { id: 7, title: "확정일자와 전입신고", duration: "20분", durationSeconds: 1200 },
      { id: 8, title: "보증금 보호받는 방법", duration: "28분", durationSeconds: 1680 }
    ],
    tags: ["전세", "월세", "임대차"],
    createdAt: "2025-11-20"
  },
  {
    id: 4,
    title: "부동산 세금 기초: 취득세부터 양도세까지",
    description: "부동산 거래 시 발생하는 각종 세금을 알기 쉽게 설명합니다. 절세 전략과 주의사항도 함께 알려드립니다.",
    instructor: "최절세",
    level: "초보",
    price: 35000,
    originalPrice: 59000,
    thumbnail: "",
    rating: 4.6,
    reviewCount: 278,
    studentCount: 1850,
    totalDuration: "4시간",
    lessonCount: 9,
    lessons: [
      { id: 1, title: "부동산 세금의 종류", duration: "25분", durationSeconds: 1500 },
      { id: 2, title: "취득세 계산하기", duration: "30분", durationSeconds: 1800 },
      { id: 3, title: "재산세와 종부세", duration: "28분", durationSeconds: 1680 },
      { id: 4, title: "양도소득세 기초", duration: "32분", durationSeconds: 1920 },
      { id: 5, title: "1세대 1주택 비과세", duration: "28분", durationSeconds: 1680 },
      { id: 6, title: "다주택자 세금 정책", duration: "30분", durationSeconds: 1800 },
      { id: 7, title: "증여세와 상속세", duration: "25분", durationSeconds: 1500 },
      { id: 8, title: "절세 팁 모음", duration: "22분", durationSeconds: 1320 },
      { id: 9, title: "세무사 상담 가이드", duration: "20분", durationSeconds: 1200 }
    ],
    tags: ["세금", "절세", "양도세"],
    createdAt: "2025-10-30"
  },
  {
    id: 5,
    title: "부동산 앱 100% 활용법",
    description: "호갱노노, 아실, 네이버 부동산 등 주요 부동산 앱을 효과적으로 활용하는 방법을 배웁니다. 실거래가 조회, 시세 분석, 매물 찾기 등 실전 스킬을 익힐 수 있습니다.",
    instructor: "정앱왕",
    level: "초보",
    price: 25000,
    originalPrice: 45000,
    thumbnail: "",
    rating: 4.8,
    reviewCount: 412,
    studentCount: 2890,
    totalDuration: "2시간 30분",
    lessonCount: 7,
    lessons: [
      { id: 1, title: "필수 부동산 앱 소개", duration: "20분", durationSeconds: 1200 },
      { id: 2, title: "호갱노노 완벽 가이드", duration: "25분", durationSeconds: 1500 },
      { id: 3, title: "아실로 시세 분석하기", duration: "22분", durationSeconds: 1320 },
      { id: 4, title: "네이버 부동산 활용법", duration: "25분", durationSeconds: 1500 },
      { id: 5, title: "KB시세와 한국감정원", duration: "20분", durationSeconds: 1200 },
      { id: 6, title: "등기부등본 열람 앱", duration: "18분", durationSeconds: 1080 },
      { id: 7, title: "종합 실습: 매물 분석하기", duration: "30분", durationSeconds: 1800 }
    ],
    tags: ["앱활용", "시세분석", "실전"],
    createdAt: "2025-12-10"
  },
  {
    id: 6,
    title: "재건축 투자 전략: 사업성 분석부터 출구까지",
    description: "재건축 투자의 핵심 포인트를 깊이있게 다룹니다. 사업성 분석, 조합원 지위 취득, 추가분담금 계산 등 실전 투자 전략을 배웁니다.",
    instructor: "한재건",
    level: "중수",
    price: 89000,
    originalPrice: 149000,
    thumbnail: "",
    rating: 4.9,
    reviewCount: 187,
    studentCount: 920,
    totalDuration: "8시간",
    lessonCount: 15,
    lessons: [
      { id: 1, title: "재건축 vs 리모델링", duration: "30분", durationSeconds: 1800 },
      { id: 2, title: "재건축 절차 총정리", duration: "35분", durationSeconds: 2100 },
      { id: 3, title: "사업성 분석 프레임워크", duration: "40분", durationSeconds: 2400 },
      { id: 4, title: "비례율과 권리가액", duration: "35분", durationSeconds: 2100 },
      { id: 5, title: "추가분담금 계산법", duration: "32분", durationSeconds: 1920 },
      { id: 6, title: "조합원 지위 취득 전략", duration: "30분", durationSeconds: 1800 },
      { id: 7, title: "정비구역 지정 분석", duration: "28분", durationSeconds: 1680 },
      { id: 8, title: "안전진단과 통과 기준", duration: "25분", durationSeconds: 1500 },
      { id: 9, title: "시공사 선정과 영향", duration: "30분", durationSeconds: 1800 },
      { id: 10, title: "관리처분계획 읽기", duration: "35분", durationSeconds: 2100 },
      { id: 11, title: "이주비와 주거이전비", duration: "25분", durationSeconds: 1500 },
      { id: 12, title: "분양권 전매 전략", duration: "28분", durationSeconds: 1680 },
      { id: 13, title: "입주권 투자 포인트", duration: "30분", durationSeconds: 1800 },
      { id: 14, title: "리스크 관리", duration: "25분", durationSeconds: 1500 },
      { id: 15, title: "실전 사례 분석", duration: "32분", durationSeconds: 1920 }
    ],
    tags: ["재건축", "정비사업", "조합원"],
    createdAt: "2025-09-15"
  },
  {
    id: 7,
    title: "갭투자 마스터 클래스",
    description: "소액으로 시작하는 갭투자의 전략과 리스크 관리를 배웁니다. 전세가율 분석, 적정 갭 계산, 역전세 대비 등 실전 노하우를 공유합니다.",
    instructor: "송갭왕",
    level: "중수",
    price: 79000,
    originalPrice: 129000,
    thumbnail: "",
    rating: 4.7,
    reviewCount: 234,
    studentCount: 1150,
    totalDuration: "6시간 30분",
    lessonCount: 12,
    lessons: [
      { id: 1, title: "갭투자의 원리와 수익 구조", duration: "28분", durationSeconds: 1680 },
      { id: 2, title: "전세가율 분석하기", duration: "32분", durationSeconds: 1920 },
      { id: 3, title: "안전 마진 계산법", duration: "30분", durationSeconds: 1800 },
      { id: 4, title: "지역별 갭투자 전략", duration: "35분", durationSeconds: 2100 },
      { id: 5, title: "입지 분석 심화", duration: "32분", durationSeconds: 1920 },
      { id: 6, title: "물건 소싱 방법", duration: "28분", durationSeconds: 1680 },
      { id: 7, title: "임차인 관리 노하우", duration: "30분", durationSeconds: 1800 },
      { id: 8, title: "역전세 리스크 대비", duration: "35분", durationSeconds: 2100 },
      { id: 9, title: "다주택자 세금 최적화", duration: "32분", durationSeconds: 1920 },
      { id: 10, title: "갭투자 레버리지 전략", duration: "30분", durationSeconds: 1800 },
      { id: 11, title: "출구 전략 수립", duration: "28분", durationSeconds: 1680 },
      { id: 12, title: "실전 포트폴리오 구성", duration: "30분", durationSeconds: 1800 }
    ],
    tags: ["갭투자", "전세", "레버리지"],
    createdAt: "2025-10-01"
  },
  {
    id: 8,
    title: "상가 투자 실전 가이드",
    description: "상가 투자의 A to Z를 배웁니다. 상권 분석, 임대차 계약, 권리금, 수익률 계산 등 상가 투자에 필요한 모든 지식을 담았습니다.",
    instructor: "오상가",
    level: "중수",
    price: 69000,
    originalPrice: 119000,
    thumbnail: "",
    rating: 4.6,
    reviewCount: 156,
    studentCount: 780,
    totalDuration: "7시간",
    lessonCount: 13,
    lessons: [
      { id: 1, title: "상가 투자의 특징", duration: "25분", durationSeconds: 1500 },
      { id: 2, title: "상권 분석 방법론", duration: "35분", durationSeconds: 2100 },
      { id: 3, title: "유동인구와 배후수요", duration: "30분", durationSeconds: 1800 },
      { id: 4, title: "업종별 입지 조건", duration: "32분", durationSeconds: 1920 },
      { id: 5, title: "권리금의 이해", duration: "28분", durationSeconds: 1680 },
      { id: 6, title: "상가 임대차 보호법", duration: "35분", durationSeconds: 2100 },
      { id: 7, title: "수익률 계산과 적정가", duration: "32분", durationSeconds: 1920 },
      { id: 8, title: "공실 리스크 관리", duration: "28분", durationSeconds: 1680 },
      { id: 9, title: "집합상가 vs 근린상가", duration: "30분", durationSeconds: 1800 },
      { id: 10, title: "신축 상가 분양 분석", duration: "32분", durationSeconds: 1920 },
      { id: 11, title: "상가 관리와 운영", duration: "25분", durationSeconds: 1500 },
      { id: 12, title: "상가 세금 정리", duration: "30분", durationSeconds: 1800 },
      { id: 13, title: "실전 투자 사례", duration: "28분", durationSeconds: 1680 }
    ],
    tags: ["상가", "수익형", "임대"],
    createdAt: "2025-10-15"
  },
  {
    id: 9,
    title: "신도시 투자 완전 정복",
    description: "신도시 개발 과정과 투자 타이밍을 배웁니다. 3기 신도시, GTX 노선별 수혜 지역 분석, 분양권 투자 전략 등을 다룹니다.",
    instructor: "윤신도시",
    level: "중수",
    price: 75000,
    originalPrice: 125000,
    thumbnail: "",
    rating: 4.8,
    reviewCount: 198,
    studentCount: 1020,
    totalDuration: "6시간",
    lessonCount: 11,
    lessons: [
      { id: 1, title: "신도시 개발의 역사", duration: "28분", durationSeconds: 1680 },
      { id: 2, title: "3기 신도시 총정리", duration: "35분", durationSeconds: 2100 },
      { id: 3, title: "GTX와 교통 호재", duration: "32분", durationSeconds: 1920 },
      { id: 4, title: "개발 단계별 투자 전략", duration: "35분", durationSeconds: 2100 },
      { id: 5, title: "사전청약 분석", duration: "30분", durationSeconds: 1800 },
      { id: 6, title: "분양권 프리미엄 예측", duration: "32분", durationSeconds: 1920 },
      { id: 7, title: "입지 우선순위 결정", duration: "28분", durationSeconds: 1680 },
      { id: 8, title: "인프라 개발 시기 분석", duration: "30분", durationSeconds: 1800 },
      { id: 9, title: "리스크 요인 점검", duration: "25분", durationSeconds: 1500 },
      { id: 10, title: "구도심 vs 신도시", duration: "30분", durationSeconds: 1800 },
      { id: 11, title: "장기 투자 전략", duration: "35분", durationSeconds: 2100 }
    ],
    tags: ["신도시", "GTX", "분양권"],
    createdAt: "2025-09-20"
  },
  {
    id: 10,
    title: "오피스텔 투자의 정석",
    description: "오피스텔 투자의 장단점과 전략을 배웁니다. 주거용 vs 업무용, 수익률 분석, 세금 이슈 등 오피스텔만의 특수성을 다룹니다.",
    instructor: "장오피",
    level: "중수",
    price: 59000,
    originalPrice: 99000,
    thumbnail: "",
    rating: 4.5,
    reviewCount: 145,
    studentCount: 890,
    totalDuration: "5시간",
    lessonCount: 10,
    lessons: [
      { id: 1, title: "오피스텔의 특징과 종류", duration: "28분", durationSeconds: 1680 },
      { id: 2, title: "주거용 vs 업무용 구분", duration: "30분", durationSeconds: 1800 },
      { id: 3, title: "수익률 계산 실습", duration: "32분", durationSeconds: 1920 },
      { id: 4, title: "입지 분석 포인트", duration: "28분", durationSeconds: 1680 },
      { id: 5, title: "분양 오피스텔 분석", duration: "30분", durationSeconds: 1800 },
      { id: 6, title: "기존 오피스텔 매입", duration: "28분", durationSeconds: 1680 },
      { id: 7, title: "임대 운영 노하우", duration: "32분", durationSeconds: 1920 },
      { id: 8, title: "오피스텔 세금 총정리", duration: "30분", durationSeconds: 1800 },
      { id: 9, title: "공실 관리 전략", duration: "25분", durationSeconds: 1500 },
      { id: 10, title: "매도 타이밍", duration: "27분", durationSeconds: 1620 }
    ],
    tags: ["오피스텔", "수익형", "임대"],
    createdAt: "2025-10-20"
  },
  {
    id: 11,
    title: "경매 투자 고급 전략",
    description: "법원 경매를 통한 저가 매수 전략을 마스터합니다. 권리분석, 입찰가 산정, 명도 절차 등 경매의 모든 것을 배웁니다.",
    instructor: "문경매",
    level: "고수",
    price: 149000,
    originalPrice: 249000,
    thumbnail: "",
    rating: 4.9,
    reviewCount: 89,
    studentCount: 420,
    totalDuration: "12시간",
    lessonCount: 20,
    lessons: [
      { id: 1, title: "경매의 기본 원리", duration: "30분", durationSeconds: 1800 },
      { id: 2, title: "경매 절차 총정리", duration: "35분", durationSeconds: 2100 },
      { id: 3, title: "권리분석 기초", duration: "40분", durationSeconds: 2400 },
      { id: 4, title: "말소기준권리 판단", duration: "45분", durationSeconds: 2700 },
      { id: 5, title: "유치권과 법정지상권", duration: "40분", durationSeconds: 2400 },
      { id: 6, title: "임차권 분석", duration: "35분", durationSeconds: 2100 },
      { id: 7, title: "특수물건 분석", duration: "38분", durationSeconds: 2280 },
      { id: 8, title: "입찰가 산정 전략", duration: "40분", durationSeconds: 2400 },
      { id: 9, title: "현장답사 체크리스트", duration: "30분", durationSeconds: 1800 },
      { id: 10, title: "입찰 실전 가이드", duration: "35분", durationSeconds: 2100 },
      { id: 11, title: "낙찰 후 절차", duration: "32분", durationSeconds: 1920 },
      { id: 12, title: "명도 협상 기술", duration: "40분", durationSeconds: 2400 },
      { id: 13, title: "강제집행 절차", duration: "35분", durationSeconds: 2100 },
      { id: 14, title: "경매 대출 활용", duration: "30분", durationSeconds: 1800 },
      { id: 15, title: "NPL 투자 입문", duration: "38분", durationSeconds: 2280 },
      { id: 16, title: "공매 vs 경매", duration: "28분", durationSeconds: 1680 },
      { id: 17, title: "지분경매 전략", duration: "35분", durationSeconds: 2100 },
      { id: 18, title: "상가 경매 특수성", duration: "32분", durationSeconds: 1920 },
      { id: 19, title: "경매 세금 계산", duration: "30분", durationSeconds: 1800 },
      { id: 20, title: "실전 사례 분석", duration: "42분", durationSeconds: 2520 }
    ],
    tags: ["경매", "권리분석", "명도"],
    createdAt: "2025-08-15"
  },
  {
    id: 12,
    title: "부동산 포트폴리오 설계",
    description: "자산 규모에 따른 최적의 부동산 포트폴리오를 설계하는 방법을 배웁니다. 분산 투자, 리밸런싱, 현금흐름 관리 등 고급 전략을 다룹니다.",
    instructor: "배자산",
    level: "고수",
    price: 129000,
    originalPrice: 199000,
    thumbnail: "",
    rating: 4.8,
    reviewCount: 76,
    studentCount: 380,
    totalDuration: "10시간",
    lessonCount: 16,
    lessons: [
      { id: 1, title: "포트폴리오 이론 기초", duration: "35분", durationSeconds: 2100 },
      { id: 2, title: "자산 배분 전략", duration: "40분", durationSeconds: 2400 },
      { id: 3, title: "부동산 유형별 특성", duration: "38분", durationSeconds: 2280 },
      { id: 4, title: "현금흐름 vs 시세차익", duration: "35분", durationSeconds: 2100 },
      { id: 5, title: "레버리지 활용법", duration: "40분", durationSeconds: 2400 },
      { id: 6, title: "DSR 관리 전략", duration: "32분", durationSeconds: 1920 },
      { id: 7, title: "지역 분산 투자", duration: "38분", durationSeconds: 2280 },
      { id: 8, title: "리밸런싱 타이밍", duration: "35분", durationSeconds: 2100 },
      { id: 9, title: "부동산 법인 활용", duration: "42분", durationSeconds: 2520 },
      { id: 10, title: "세금 최적화 전략", duration: "40분", durationSeconds: 2400 },
      { id: 11, title: "은퇴 설계와 부동산", duration: "35분", durationSeconds: 2100 },
      { id: 12, title: "증여와 상속 계획", duration: "38분", durationSeconds: 2280 },
      { id: 13, title: "리스크 헷지 전략", duration: "35분", durationSeconds: 2100 },
      { id: 14, title: "시장 사이클 대응", duration: "40분", durationSeconds: 2400 },
      { id: 15, title: "포트폴리오 진단", duration: "32분", durationSeconds: 1920 },
      { id: 16, title: "케이스 스터디", duration: "45분", durationSeconds: 2700 }
    ],
    tags: ["포트폴리오", "자산관리", "절세"],
    createdAt: "2025-08-01"
  },
  {
    id: 13,
    title: "부동산 개발 투자 입문",
    description: "토지 매입부터 건물 신축까지 부동산 개발의 전 과정을 배웁니다. 사업성 분석, 인허가, 시공사 선정 등 개발 투자의 핵심을 다룹니다.",
    instructor: "신개발",
    level: "고수",
    price: 179000,
    originalPrice: 299000,
    thumbnail: "",
    rating: 4.7,
    reviewCount: 52,
    studentCount: 280,
    totalDuration: "14시간",
    lessonCount: 22,
    lessons: [
      { id: 1, title: "부동산 개발의 이해", duration: "30분", durationSeconds: 1800 },
      { id: 2, title: "개발 사업의 종류", duration: "35분", durationSeconds: 2100 },
      { id: 3, title: "토지 분석 기초", duration: "40분", durationSeconds: 2400 },
      { id: 4, title: "용도지역과 건폐율/용적률", duration: "45분", durationSeconds: 2700 },
      { id: 5, title: "개발 가능성 검토", duration: "38분", durationSeconds: 2280 },
      { id: 6, title: "사업성 분석 방법", duration: "42분", durationSeconds: 2520 },
      { id: 7, title: "분양가 산정", duration: "35분", durationSeconds: 2100 },
      { id: 8, title: "인허가 절차", duration: "40분", durationSeconds: 2400 },
      { id: 9, title: "건축 설계 기초", duration: "35분", durationSeconds: 2100 },
      { id: 10, title: "시공사 선정과 계약", duration: "38분", durationSeconds: 2280 },
      { id: 11, title: "PF대출의 이해", duration: "42분", durationSeconds: 2520 },
      { id: 12, title: "분양 마케팅", duration: "35분", durationSeconds: 2100 },
      { id: 13, title: "분양률 관리", duration: "30분", durationSeconds: 1800 },
      { id: 14, title: "공사 관리 기초", duration: "38분", durationSeconds: 2280 },
      { id: 15, title: "준공과 입주", duration: "32분", durationSeconds: 1920 },
      { id: 16, title: "소규모 개발 실전", duration: "40분", durationSeconds: 2400 },
      { id: 17, title: "단독/다가구 신축", duration: "38분", durationSeconds: 2280 },
      { id: 18, title: "근린생활시설 개발", duration: "35분", durationSeconds: 2100 },
      { id: 19, title: "리스크 관리", duration: "40분", durationSeconds: 2400 },
      { id: 20, title: "세금과 회계", duration: "35분", durationSeconds: 2100 },
      { id: 21, title: "공동 개발 투자", duration: "38분", durationSeconds: 2280 },
      { id: 22, title: "실전 사례 분석", duration: "45분", durationSeconds: 2700 }
    ],
    tags: ["개발", "신축", "토지"],
    createdAt: "2025-07-15"
  },
  {
    id: 14,
    title: "해외 부동산 투자 마스터",
    description: "미국, 일본, 동남아 등 해외 부동산 투자 전략을 배웁니다. 국가별 특성, 세금, 환율 리스크 관리 등을 다룹니다.",
    instructor: "글로벌김",
    level: "고수",
    price: 159000,
    originalPrice: 259000,
    thumbnail: "",
    rating: 4.6,
    reviewCount: 43,
    studentCount: 210,
    totalDuration: "11시간",
    lessonCount: 18,
    lessons: [
      { id: 1, title: "해외 투자의 이점과 리스크", duration: "32분", durationSeconds: 1920 },
      { id: 2, title: "미국 부동산 시장 개요", duration: "40분", durationSeconds: 2400 },
      { id: 3, title: "미국 투자 실전 가이드", duration: "45분", durationSeconds: 2700 },
      { id: 4, title: "일본 부동산 투자", duration: "38분", durationSeconds: 2280 },
      { id: 5, title: "동남아 시장 분석", duration: "35분", durationSeconds: 2100 },
      { id: 6, title: "베트남 투자 전략", duration: "38분", durationSeconds: 2280 },
      { id: 7, title: "태국 부동산 시장", duration: "32분", durationSeconds: 1920 },
      { id: 8, title: "호주와 뉴질랜드", duration: "35분", durationSeconds: 2100 },
      { id: 9, title: "유럽 부동산 투자", duration: "38분", durationSeconds: 2280 },
      { id: 10, title: "해외 송금과 환전", duration: "30분", durationSeconds: 1800 },
      { id: 11, title: "환율 리스크 관리", duration: "35분", durationSeconds: 2100 },
      { id: 12, title: "해외 부동산 세금", duration: "40분", durationSeconds: 2400 },
      { id: 13, title: "이중과세 방지 협약", duration: "32분", durationSeconds: 1920 },
      { id: 14, title: "해외 부동산 대출", duration: "35분", durationSeconds: 2100 },
      { id: 15, title: "현지 법인 설립", duration: "38분", durationSeconds: 2280 },
      { id: 16, title: "임대 관리 시스템", duration: "32분", durationSeconds: 1920 },
      { id: 17, title: "출구 전략", duration: "35분", durationSeconds: 2100 },
      { id: 18, title: "실전 투자 사례", duration: "40분", durationSeconds: 2400 }
    ],
    tags: ["해외투자", "미국", "동남아"],
    createdAt: "2025-09-01"
  },
  {
    id: 15,
    title: "부동산 법인 설립과 운영",
    description: "부동산 투자를 위한 법인 설립부터 운영, 세금 최적화까지 배웁니다. 개인 vs 법인 비교, 법인 전환 전략 등을 다룹니다.",
    instructor: "정법인",
    level: "고수",
    price: 139000,
    originalPrice: 229000,
    thumbnail: "",
    rating: 4.8,
    reviewCount: 67,
    studentCount: 350,
    totalDuration: "9시간",
    lessonCount: 15,
    lessons: [
      { id: 1, title: "부동산 법인의 이해", duration: "30분", durationSeconds: 1800 },
      { id: 2, title: "개인 vs 법인 비교", duration: "38분", durationSeconds: 2280 },
      { id: 3, title: "법인 설립 절차", duration: "35분", durationSeconds: 2100 },
      { id: 4, title: "정관 작성 가이드", duration: "32분", durationSeconds: 1920 },
      { id: 5, title: "자본금 설정 전략", duration: "30분", durationSeconds: 1800 },
      { id: 6, title: "법인 명의 취득", duration: "35분", durationSeconds: 2100 },
      { id: 7, title: "법인세 계산", duration: "40분", durationSeconds: 2400 },
      { id: 8, title: "법인 경비 처리", duration: "35분", durationSeconds: 2100 },
      { id: 9, title: "대표이사 급여 설정", duration: "32분", durationSeconds: 1920 },
      { id: 10, title: "배당과 처분", duration: "38분", durationSeconds: 2280 },
      { id: 11, title: "법인 대출 활용", duration: "35분", durationSeconds: 2100 },
      { id: 12, title: "개인에서 법인 전환", duration: "40분", durationSeconds: 2400 },
      { id: 13, title: "부동산 PF 활용", duration: "35분", durationSeconds: 2100 },
      { id: 14, title: "법인 청산과 정리", duration: "32분", durationSeconds: 1920 },
      { id: 15, title: "실전 운영 사례", duration: "38분", durationSeconds: 2280 }
    ],
    tags: ["법인", "절세", "자산관리"],
    createdAt: "2025-08-20"
  }
];

export const getCoursesByLevel = (level: CourseLevel): Course[] => {
  return courses.filter((course) => course.level === level);
};

export const getCourseById = (id: number): Course | undefined => {
  return courses.find((course) => course.id === id);
};

export const LEVEL_DESCRIPTIONS: Record<CourseLevel, { title: string; description: string; color: string }> = {
  "초보": {
    title: "입문자 코스",
    description: "부동산 투자를 처음 시작하는 분들을 위한 기초 강의",
    color: "bg-green-500"
  },
  "중수": {
    title: "실전 투자 코스",
    description: "기초를 익히고 실전 투자를 준비하는 분들을 위한 심화 강의",
    color: "bg-blue-500"
  },
  "고수": {
    title: "전문가 코스",
    description: "고급 전략과 다양한 투자 방법을 익히고 싶은 분들을 위한 전문 강의",
    color: "bg-purple-500"
  }
};

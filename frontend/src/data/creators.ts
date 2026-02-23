import creator1 from "@/assets/images/creators/creator-1.png";
import creator2 from "@/assets/images/creators/creator-2.png";
import creator3 from "@/assets/images/creators/creator-3.png";
import creator4 from "@/assets/images/creators/creator-4.png";
import creator5 from "@/assets/images/creators/creator-5.png";
import creator6 from "@/assets/images/creators/creator-6.png";
import creator7 from "@/assets/images/creators/creator-7.png";
import creator8 from "@/assets/images/creators/creator-8.png";
import creator9 from "@/assets/images/creators/creator-9.png";
import creator10 from "@/assets/images/creators/creator-10.png";

export const CREATOR_TAGS = [
  "전체",
  "재건축",
  "청약",
  "시세분석",
  "실수요",
  "분양",
  "교통호재",
  "경매",
  "신도시",
  "절세",
  "대출",
] as const;

export type CreatorTag = typeof CREATOR_TAGS[number];

export interface Creator {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  tags: CreatorTag[];
  followers: number;
  rating: number;
  verified: boolean;
  color: string;
  bio: string;
  experience: string;
  certifications: string[];
}

export const creators: Creator[] = [
  {
    id: 1,
    name: "부동산김사부",
    avatar: creator1.src,
    specialty: "재건축 전문",
    tags: ["재건축", "시세분석"],
    followers: 12500,
    rating: 4.9,
    verified: true,
    color: "bg-primary",
    bio: "15년간 강남권 재건축 시장을 분석해온 전문가입니다. 재건축 사업성 분석과 투자 타이밍에 대한 노하우를 공유합니다.",
    experience: "15년",
    certifications: ["공인중개사", "감정평가사"],
  },
  {
    id: 2,
    name: "청약마스터",
    avatar: creator2.src,
    specialty: "청약 분석",
    tags: ["청약", "실수요"],
    followers: 8900,
    rating: 4.8,
    verified: true,
    color: "bg-blue-500",
    bio: "청약 당첨 전략과 분양권 분석 전문가입니다. 수도권 주요 청약 단지 분석과 당첨 확률 높이는 방법을 알려드립니다.",
    experience: "10년",
    certifications: ["공인중개사"],
  },
  {
    id: 3,
    name: "강남부자되기",
    avatar: creator3.src,
    specialty: "강남권 시세",
    tags: ["시세분석", "재건축"],
    followers: 15200,
    rating: 4.7,
    verified: true,
    color: "bg-purple-500",
    bio: "강남 3구 부동산 시장의 모든 것을 분석합니다. 시세 흐름과 투자 포인트를 명확하게 짚어드립니다.",
    experience: "12년",
    certifications: ["공인중개사", "주택관리사"],
  },
  {
    id: 4,
    name: "월급쟁이내집마련",
    avatar: creator4.src,
    specialty: "실수요 전략",
    tags: ["실수요", "대출"],
    followers: 21000,
    rating: 4.9,
    verified: true,
    color: "bg-green-500",
    bio: "직장인을 위한 현실적인 내집마련 전략을 제시합니다. 자금 계획부터 대출, 매수 타이밍까지 단계별로 안내해드립니다.",
    experience: "8년",
    certifications: ["공인중개사", "금융투자분석사"],
  },
  {
    id: 5,
    name: "분양정보통",
    avatar: creator5.src,
    specialty: "신규 분양",
    tags: ["분양", "청약"],
    followers: 7600,
    rating: 4.6,
    verified: false,
    color: "bg-orange-500",
    bio: "전국 신규 분양 정보를 가장 빠르게 전해드립니다. 분양가 분석과 투자 가치를 객관적으로 평가합니다.",
    experience: "6년",
    certifications: ["공인중개사"],
  },
  {
    id: 6,
    name: "GTX호재분석",
    avatar: creator6.src,
    specialty: "교통 호재",
    tags: ["교통호재", "시세분석"],
    followers: 9400,
    rating: 4.8,
    verified: true,
    color: "bg-cyan-500",
    bio: "GTX, 신분당선 등 교통 호재가 부동산 가격에 미치는 영향을 분석합니다. 미래 가치를 선점하는 투자 전략을 제시합니다.",
    experience: "9년",
    certifications: ["도시계획기사", "공인중개사"],
  },
  {
    id: 7,
    name: "경매달인",
    avatar: creator7.src,
    specialty: "경매 투자",
    tags: ["경매", "절세"],
    followers: 6300,
    rating: 4.7,
    verified: false,
    color: "bg-red-500",
    bio: "부동산 경매의 A to Z를 알려드립니다. 권리분석부터 낙찰, 명도까지 실전 경험을 바탕으로 안내합니다.",
    experience: "11년",
    certifications: ["법무사", "공인중개사"],
  },
  {
    id: 8,
    name: "신도시리서치",
    avatar: creator8.src,
    specialty: "신도시 분석",
    tags: ["신도시", "분양"],
    followers: 11200,
    rating: 4.8,
    verified: true,
    color: "bg-indigo-500",
    bio: "3기 신도시와 수도권 택지개발 지구를 깊이 분석합니다. 입주 시점과 가격 전망을 객관적인 데이터로 제시합니다.",
    experience: "7년",
    certifications: ["도시계획기사"],
  },
  {
    id: 9,
    name: "절세부동산",
    avatar: creator9.src,
    specialty: "세금 전문",
    tags: ["절세", "시세분석"],
    followers: 8700,
    rating: 4.7,
    verified: true,
    color: "bg-amber-500",
    bio: "부동산 관련 세금(취득세, 양도세, 종부세)을 최적화하는 전략을 알려드립니다. 합법적인 절세 방법을 제시합니다.",
    experience: "14년",
    certifications: ["세무사", "공인중개사"],
  },
  {
    id: 10,
    name: "대출의신",
    avatar: creator10.src,
    specialty: "대출 상담",
    tags: ["대출", "실수요"],
    followers: 10500,
    rating: 4.8,
    verified: true,
    color: "bg-teal-500",
    bio: "주택담보대출, 신용대출 등 부동산 매수에 필요한 대출 전략을 안내합니다. DSR, LTV 규제 대응 방법도 알려드립니다.",
    experience: "10년",
    certifications: ["금융투자분석사", "공인중개사"],
  },
];

export const getCreatorById = (id: number): Creator | undefined => {
  return creators.find((creator) => creator.id === id);
};

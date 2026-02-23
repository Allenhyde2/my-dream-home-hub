import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Wallet, ArrowRight, AlertCircle, Eye, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  views: number;
  comments: number;
}

interface ContentSection {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof MapPin;
  items: ContentItem[];
}

const generateLocationContent = (targetAreas: { city: string; district: string; dong: string }[] | null): ContentItem[] => {
  if (!targetAreas || targetAreas.length === 0) return [];

  const primaryArea = targetAreas[0];
  return [
    {
      id: "loc-1",
      title: `${primaryArea.district} 2026년 분양 예정 단지 총정리`,
      description: `${primaryArea.dong} 인근 핵심 입지 신규 분양 정보`,
      views: Math.floor(Math.random() * 3000) + 1000,
      comments: Math.floor(Math.random() * 50) + 10,
    },
    {
      id: "loc-2",
      title: `${primaryArea.district} 재건축 투자 수익률 분석`,
      description: "장기 투자 관점의 재건축 단지 비교",
      views: Math.floor(Math.random() * 2500) + 800,
      comments: Math.floor(Math.random() * 40) + 8,
    },
    {
      id: "loc-3",
      title: `${primaryArea.district} 실거래가 추이 리포트`,
      description: "최근 3개월 거래 동향 분석",
      views: Math.floor(Math.random() * 2000) + 600,
      comments: Math.floor(Math.random() * 30) + 5,
    },
  ];
};

const generateFamilyContent = (familyTypes: string[] | null): ContentItem[] => {
  if (!familyTypes || familyTypes.length === 0) return [];

  const primaryType = familyTypes[0];
  const contentMap: Record<string, ContentItem[]> = {
    "신혼부부(7년이하)": [
      { id: "fam-1", title: "신혼부부 특별공급 완벽 가이드", description: "자격 요건부터 당첨 전략까지", views: 2340, comments: 45 },
      { id: "fam-2", title: "신혼부부 대출 한도 계산기", description: "소득 기준 최대 대출 가능 금액 확인", views: 1890, comments: 32 },
      { id: "fam-3", title: "신혼부부 생애최초 특별공급 전략", description: "청약 가점 없이 당첨되는 방법", views: 1560, comments: 28 },
    ],
    "예비 신혼부부": [
      { id: "fam-1", title: "예비 신혼부부 청약 전략", description: "결혼 전 준비해야 할 청약 체크리스트", views: 1980, comments: 38 },
      { id: "fam-2", title: "신혼희망타운 입주 조건 총정리", description: "예비 신혼부부도 신청 가능한 단지", views: 1650, comments: 27 },
      { id: "fam-3", title: "결혼 전 청약통장 관리법", description: "가입 기간 최대화 전략", views: 1420, comments: 22 },
    ],
    "미취학 자녀": [
      { id: "fam-1", title: "어린이집 인프라 좋은 단지 추천", description: "미취학 자녀 맘들의 실거주 후기", views: 2100, comments: 52 },
      { id: "fam-2", title: "다자녀 특별공급 자격 요건", description: "2자녀 가정도 가능한 특공 정보", views: 1780, comments: 35 },
      { id: "fam-3", title: "육아하기 좋은 아파트 체크리스트", description: "놀이터, 도서관, 키즈카페 등", views: 1540, comments: 28 },
    ],
    "학령기 자녀": [
      { id: "fam-1", title: "강남 8학군 아파트 시세 분석", description: "학군지 프리미엄 현황", views: 3200, comments: 78 },
      { id: "fam-2", title: "학군 좋은 신도시 추천", description: "수도권 우수 학군 지역 비교", views: 2540, comments: 56 },
      { id: "fam-3", title: "학원가 인접 아파트 투자 가치", description: "교육 인프라와 집값 상관관계", views: 1980, comments: 42 },
    ],
    "1인 가구": [
      { id: "fam-1", title: "1인 가구 청약 전략", description: "무주택 1인 가구 특별공급 정보", views: 1890, comments: 34 },
      { id: "fam-2", title: "소형 아파트 투자 가이드", description: "전용 59㎡ 이하 매물 분석", views: 1650, comments: 28 },
      { id: "fam-3", title: "오피스텔 vs 아파트 비교", description: "1인 가구 주거 형태 선택 가이드", views: 1420, comments: 22 },
    ],
  };

  return contentMap[primaryType] || [
    { id: "fam-1", title: `${primaryType} 맞춤 주거 가이드`, description: "가구 형태별 최적 주거 전략", views: 1500, comments: 25 },
    { id: "fam-2", title: "생애주기별 주택 구매 타이밍", description: "언제 집을 사야 할까?", views: 1320, comments: 20 },
    { id: "fam-3", title: "가족 구성원 수에 따른 평수 선택", description: "적정 주거 면적 가이드", views: 1180, comments: 18 },
  ];
};

const generateFundsContent = (availableFunds: string | null): ContentItem[] => {
  if (!availableFunds) return [];

  // Parse Korean funds string to number (unit: 억)
  let amount = 0;
  if (availableFunds === "5천만원 미만") amount = 0.4;
  else if (availableFunds === "10억 이상") amount = 10;
  else {
    if (availableFunds.includes("억")) {
      amount += parseInt(availableFunds.split("억")[0]);
    }
    if (availableFunds.includes("5천만원")) {
      amount += 0.5;
    }
    if (!availableFunds.includes("억") && availableFunds.includes("5천만원")) {
      amount = 0.5;
    }
  }

  // Bucket Logic
  if (amount < 1) { // 1억 미만
    return [
      { id: "fund-1", title: "1억 미만으로 시작하는 부동산 투자", description: "소액 투자 전략 가이드", views: 2100, comments: 45 },
      { id: "fund-2", title: "갭투자 입문 가이드", description: "적은 자금으로 시작하는 방법", views: 1890, comments: 38 },
      { id: "fund-3", title: "저가 매물 발굴 노하우", description: "급매물, 경매 활용법", views: 1650, comments: 32 },
    ];
  }

  if (amount < 3) { // 1억 ~ 3억
    return [
      { id: "fund-1", title: "1~3억대 수도권 아파트 추천", description: "실거주 가능한 매물 분석", views: 2340, comments: 52 },
      { id: "fund-2", title: "3억 이하로 서울 입성하기", description: "노도강 및 외곽 지역 분석", views: 2100, comments: 45 },
      { id: "fund-3", title: "소형 아파트 투자 전략", description: "전용 59㎡ 이하 틈새 시장", views: 1780, comments: 38 },
    ];
  }

  if (amount < 5) { // 3억 ~ 5억
    return [
      { id: "fund-1", title: "3~5억대 역세권 매물 분석", description: "GTX 호재 지역 집중 분석", views: 2580, comments: 55 },
      { id: "fund-2", title: "5억으로 강남 접근 전략", description: "재개발/재건축 입주권 투자", views: 2340, comments: 48 },
      { id: "fund-3", title: "생애최초 주택 구입 가이드", description: "대출 활용과 세금 혜택", views: 2100, comments: 42 },
    ];
  }

  if (amount < 10) { // 5억 ~ 10억
    return [
      { id: "fund-1", title: "5~10억대 서울 핵심지 분석", description: "마용성 및 강남 3구 접근", views: 2780, comments: 62 },
      { id: "fund-2", title: "갈아타기 성공 전략", description: "상급지 이동 골든타임", views: 2450, comments: 50 },
      { id: "fund-3", title: "학군지 아파트 집중 분석", description: "자녀 교육을 위한 최적의 선택", views: 2200, comments: 45 },
    ];
  }

  // 10억 이상
  return [
    { id: "fund-1", title: "10억 이상 프리미엄 아파트 분석", description: "래미안, 자이, 힐스테이트 비교", views: 3200, comments: 78 },
    { id: "fund-2", title: "고가 아파트 절세 전략", description: "취득세, 보유세 최소화 방법", views: 2890, comments: 65 },
    { id: "fund-3", title: "10억대 투자 수익률 비교", description: "아파트 vs 빌딩 vs 상가", views: 2540, comments: 58 },
  ];
};

const PersonalizedContent = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  const sections = useMemo((): ContentSection[] => {
    if (!user) return [];

    const targetAreas = user.targetAreas;
    const familyTypes = user.familyTypes;
    const availableFunds = user.availableFunds;

    const primaryArea = targetAreas?.[0];
    const primaryFamily = familyTypes?.[0];

    return [
      {
        id: "location",
        title: primaryArea ? `${primaryArea.district} ${primaryArea.dong} 맞춤 콘텐츠` : "목표 지역 맞춤 콘텐츠",
        subtitle: primaryArea ? `${primaryArea.city} ${primaryArea.district} 기준` : "관심 지역을 설정해주세요",
        icon: MapPin,
        items: generateLocationContent(targetAreas),
      },
      {
        id: "family",
        title: primaryFamily ? `${primaryFamily} 맞춤 콘텐츠` : "가족 형태 맞춤 콘텐츠",
        subtitle: primaryFamily ? `${primaryFamily} 가구 기준` : "가족 유형을 설정해주세요",
        icon: Users,
        items: generateFamilyContent(familyTypes),
      },
      {
        id: "funds",
        title: availableFunds ? `${availableFunds} 예산 맞춤 콘텐츠` : "자금 상황 맞춤 콘텐츠",
        subtitle: availableFunds ? `가용 자금 ${availableFunds} 기준` : "예산을 설정해주세요",
        icon: Wallet,
        items: generateFundsContent(availableFunds),
      },
    ];
  }, [user]);

  if (isLoading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">맞춤 콘텐츠</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">맞춤 콘텐츠</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              로그인 후 프로필을 설정하면 맞춤 콘텐츠를 확인할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">맞춤 콘텐츠</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const IconComponent = section.icon;
          const hasItems = section.items.length > 0;

          return (
            <Card key={section.id} className="bg-card border-border" data-testid={`content-section-${section.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {section.title}
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">{section.subtitle}</p>
              </CardHeader>
              <CardContent className="pt-0">
                {hasItems ? (
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer group"
                        data-testid={`content-item-${item.id}`}
                      >
                        <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {item.comments}
                            </span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    프로필에서 정보를 설정해주세요
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default PersonalizedContent;

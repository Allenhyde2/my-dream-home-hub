import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, CheckCircle2, Clock, Circle, AlertCircle, Wallet, FileText, Home, Building } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface MissionItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface MissionPhase {
  id: string;
  title: string;
  icon: typeof Wallet;
  monthsBeforePurchase: { min: number; max: number };
  items: MissionItem[];
  status: "completed" | "active" | "upcoming";
}

const MISSION_TEMPLATES: Omit<MissionPhase, "status">[] = [
  {
    id: "financial",
    title: "금전 준비",
    icon: Wallet,
    monthsBeforePurchase: { min: 10, max: 12 },
    items: [
      { id: "f1", title: "총 매수 예산 설정", description: "자기자금 + 대출 가능액 계산", completed: false },
      { id: "f2", title: "신용점수 확인 및 관리", description: "800점 이상 목표", completed: false },
      { id: "f3", title: "청약통장 납입 현황 확인", description: "24회 이상 납입 확인", completed: false },
      { id: "f4", title: "추가 비용 계산", description: "취득세, 중개수수료, 등기비용 등", completed: false },
    ],
  },
  {
    id: "loan",
    title: "대출 준비",
    icon: Building,
    monthsBeforePurchase: { min: 7, max: 9 },
    items: [
      { id: "l1", title: "주택담보대출 사전 상담", description: "은행별 한도 및 금리 비교", completed: false },
      { id: "l2", title: "DSR/LTV 규제 확인", description: "대출 한도 사전 파악", completed: false },
      { id: "l3", title: "대출 서류 준비", description: "소득증빙, 재직증명서 등", completed: false },
      { id: "l4", title: "대출 승인 조건 확인", description: "특약사항 검토", completed: false },
    ],
  },
  {
    id: "documents",
    title: "서류 준비",
    icon: FileText,
    monthsBeforePurchase: { min: 4, max: 6 },
    items: [
      { id: "d1", title: "등기부등본 열람", description: "권리관계 확인 (근저당, 가압류 등)", completed: false },
      { id: "d2", title: "건축물대장 확인", description: "용도, 면적, 위반건축물 확인", completed: false },
      { id: "d3", title: "실거래가 조회", description: "국토부 실거래가 공개시스템 활용", completed: false },
      { id: "d4", title: "매매계약서 검토", description: "특약사항 및 계약조건 확인", completed: false },
      { id: "d5", title: "인감증명서/주민등록등본 발급", description: "계약 시 필요 서류 준비", completed: false },
    ],
  },
  {
    id: "movein",
    title: "입주 준비",
    icon: Home,
    monthsBeforePurchase: { min: 1, max: 3 },
    items: [
      { id: "m1", title: "잔금 전 최종 점검", description: "등기부등본 재확인, 물건 상태 확인", completed: false },
      { id: "m2", title: "잔금 납부 및 소유권 이전", description: "60일 이내 등기 신청", completed: false },
      { id: "m3", title: "취득세 납부", description: "잔금일로부터 60일 이내", completed: false },
      { id: "m4", title: "전입신고 및 확정일자", description: "주민센터 방문 또는 온라인 신청", completed: false },
      { id: "m5", title: "공과금 명의 변경", description: "전기, 수도, 가스 명의 변경", completed: false },
    ],
  },
];

const calculateRemainingMonths = (purchaseTimeline: number | null | undefined): number => {
  if (!purchaseTimeline) return 0;
  
  const today = new Date();
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + purchaseTimeline);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const fullMonths = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;
  
  if (remainingDays >= 15) {
    return fullMonths + 1;
  }
  return fullMonths;
};

const getTargetDateString = (purchaseTimeline: number | null | undefined): string => {
  if (!purchaseTimeline) return "";
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + purchaseTimeline);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  return `${year}년 ${month}월`;
};

const PurchaseGoals = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const purchaseTimeline = user?.purchaseTimeline as number | null | undefined;

  const remainingMonths = useMemo(() => {
    return calculateRemainingMonths(purchaseTimeline);
  }, [purchaseTimeline]);

  const targetDateString = useMemo(() => {
    return getTargetDateString(purchaseTimeline);
  }, [purchaseTimeline]);

  const missions = useMemo((): MissionPhase[] => {
    return MISSION_TEMPLATES.map((template) => {
      let status: "completed" | "active" | "upcoming" = "upcoming";
      
      if (remainingMonths <= template.monthsBeforePurchase.max && 
          remainingMonths >= template.monthsBeforePurchase.min) {
        status = "active";
      } else if (remainingMonths < template.monthsBeforePurchase.min) {
        status = "completed";
      }
      
      return {
        ...template,
        status,
      };
    });
  }, [remainingMonths]);

  const totalProgress = useMemo(() => {
    const completedPhases = missions.filter(m => m.status === "completed").length;
    const activePhase = missions.find(m => m.status === "active");
    let progress = (completedPhases / missions.length) * 100;
    
    if (activePhase) {
      progress += (1 / missions.length) * 50;
    }
    
    return Math.min(Math.round(progress), 100);
  }, [missions]);

  if (isLoading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">매수 목표 & 미션</h2>
        <Skeleton className="h-32 w-full mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !purchaseTimeline) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">매수 목표 & 미션</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {!isAuthenticated 
                ? "로그인 후 매수 목표를 설정하면 맞춤 미션을 확인할 수 있습니다."
                : "매수 목표 시기를 설정하면 단계별 미션을 확인할 수 있습니다."}
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">매수 목표 & 미션</h2>

      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-full">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">목표 매수 시기</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-target-date">
                  {targetDateString}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">남은 기간</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-remaining-months">
                  {remainingMonths}개월
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">전체 진행률</span>
                <span className="font-medium text-foreground" data-testid="text-progress">
                  {totalProgress}%
                </span>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {missions.map((mission) => {
          const IconComponent = mission.icon;
          return (
            <Card
              key={mission.id}
              className={`bg-card border-border ${
                mission.status === "active" ? "ring-2 ring-primary" : ""
              }`}
              data-testid={`mission-card-${mission.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base text-foreground">{mission.title}</CardTitle>
                  </div>
                  {mission.status === "completed" ? (
                    <Badge variant="secondary" className="shrink-0">완료</Badge>
                  ) : mission.status === "active" ? (
                    <Badge className="bg-primary text-primary-foreground shrink-0">진행중</Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0">예정</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  D-{mission.monthsBeforePurchase.max}개월 ~ D-{mission.monthsBeforePurchase.min}개월
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mission.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      {mission.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      ) : mission.status === "active" ? (
                        <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-sm block ${
                            mission.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default PurchaseGoals;

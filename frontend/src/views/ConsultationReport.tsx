"use client";

import { useParams, useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  MapPin,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Target,
  Download
} from "lucide-react";
import { creators } from "@/data/creators";

interface ConsultationReport {
  id: number;
  creatorId: number;
  productName: string;
  date: string;
  time: string;
  duration: string;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  actionItems: string[];
  marketAnalysis?: string;
  riskFactors?: string[];
  nextSteps?: string;
}

const mockReports: Record<number, ConsultationReport> = {
  3: {
    id: 3,
    creatorId: 1,
    productName: "30분 기본 상담",
    date: "2026-01-20",
    time: "15:00",
    duration: "32분",
    summary: "서울 강남구 재건축 아파트 투자에 관한 상담을 진행했습니다. 현재 고객님의 자금 상황과 투자 목표를 고려하여 적합한 재건축 단지를 분석하고, 투자 시기와 전략에 대해 논의했습니다.",
    keyPoints: [
      "현재 가용 자금 3억원으로 강남 3구 재건축 투자 가능",
      "입주권 매수 시 추가 분담금 약 2-3억 예상",
      "재건축 진행 단계에 따른 리스크 분석 완료",
      "향후 3-5년 내 입주 예정 단지 우선 검토 권장"
    ],
    recommendations: [
      "대치동 은마아파트 - 재건축 진행 중, 안정적인 투자처",
      "압구정 현대아파트 - 프리미엄 높으나 잠재 가치 충분",
      "잠실주공5단지 - 가격 대비 상승 여력 기대"
    ],
    actionItems: [
      "대치동 은마아파트 현장 방문 및 시세 확인",
      "입주권 vs 분양권 비교 분석 자료 검토",
      "대출 한도 사전 조회 진행",
      "다음 상담에서 구체적 매물 검토 예정"
    ],
    marketAnalysis: "현재 재건축 시장은 정비사업 규제 완화로 인해 활기를 띠고 있습니다. 특히 강남권 재건축 단지는 희소성이 높아 장기적으로 안정적인 자산 가치 상승이 예상됩니다. 다만, 공사비 상승과 분담금 이슈로 인한 변동성에 주의가 필요합니다.",
    riskFactors: [
      "공사비 상승으로 인한 추가 분담금 발생 가능성",
      "재건축 일정 지연 리스크",
      "금리 변동에 따른 대출 부담 증가",
      "정책 변화에 따른 규제 리스크"
    ],
    nextSteps: "2주 내 추천 단지 현장 방문 후, 심층 상담을 통해 구체적인 매수 전략을 수립할 예정입니다."
  },
  4: {
    id: 4,
    creatorId: 3,
    productName: "프리미엄 컨설팅",
    date: "2026-01-15",
    time: "13:00",
    duration: "2시간 15분",
    summary: "GTX 개통 예정 지역 투자 전략에 관한 프리미엄 컨설팅을 진행했습니다. GTX-A, B, C 노선별 수혜 지역을 분석하고, 투자 적기와 예산에 맞는 최적의 투자 포트폴리오를 제안했습니다.",
    keyPoints: [
      "GTX-A 노선 2024년 개통으로 수혜 지역 가격 선반영 진행 중",
      "GTX-B, C 노선 역세권은 아직 투자 기회 존재",
      "인덕원-동탄선 연계 지역 주목 필요",
      "교통 호재 외 개발 호재 복합 지역 선별 완료"
    ],
    recommendations: [
      "GTX-B 송도역 인근 - 개통 전 선점 기회",
      "GTX-C 의정부역 인근 - 가격 대비 높은 상승 여력",
      "인덕원역 환승지역 - 트리플 역세권 프리미엄 기대",
      "동탄2신도시 - GTX 및 신도시 개발 시너지"
    ],
    actionItems: [
      "GTX-B 노선 개통 일정 확정 시 재검토",
      "추천 지역 현장 답사 일정 조율",
      "투자 예산 재확인 및 대출 계획 수립",
      "분산 투자 포트폴리오 구성 검토"
    ],
    marketAnalysis: "GTX 개통은 수도권 부동산 시장의 게임체인저가 될 것으로 예상됩니다. 서울 접근성이 획기적으로 개선되는 지역은 실거주 및 투자 수요가 동시에 증가할 것입니다. 다만, 이미 가격에 상당 부분 반영된 지역과 아직 저평가된 지역을 정확히 구분하는 것이 중요합니다.",
    riskFactors: [
      "GTX 개통 지연 가능성",
      "예상 대비 낮은 이용객 수",
      "주변 경쟁 노선 개통에 따른 수혜 분산",
      "지역별 공급 과잉 우려"
    ],
    nextSteps: "1개월 내 현장 답사 완료 후, 최종 투자 결정을 위한 후속 미팅을 진행할 예정입니다."
  }
};

const ConsultationReport = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const id = params?.id;

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const report = mockReports[Number(id)];
  const creator = report ? creators.find((c) => c.id === report.creatorId) : null;

  if (!report || !creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">리포트를 찾을 수 없습니다</h2>
          <Button onClick={() => navigate("/my-reservations")} data-testid="button-go-back">
            예약 현황으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">상담 리포트</h1>
          </div>
          <Button variant="outline" size="sm" className="gap-2" data-testid="button-download">
            <Download className="w-4 h-4" />
            PDF 저장
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-600">완료</Badge>
                  <Badge variant="outline">{report.productName}</Badge>
                </div>
                <h2 className="text-xl font-bold mb-1">{creator.name} 전문가 상담</h2>
                <p className="text-muted-foreground">{creator.specialty}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{report.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{report.time} (상담 시간: {report.duration})</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              상담 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{report.summary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              핵심 포인트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-green-600">{index + 1}</span>
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              추천 투자처
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {report.marketAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                시장 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{report.marketAnalysis}</p>
            </CardContent>
          </Card>
        )}

        {report.riskFactors && report.riskFactors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                리스크 요인
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                    <span className="text-muted-foreground">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-purple-500" />
              실행 항목
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded border-2 border-purple-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {report.nextSteps && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">다음 단계</h3>
              <p className="text-muted-foreground">{report.nextSteps}</p>
              <Button className="mt-4" onClick={() => navigate(`/creator/${report.creatorId}`)}>
                추가 상담 예약하기
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ConsultationReport;

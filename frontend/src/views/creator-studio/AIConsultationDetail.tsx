"use client";

import { ArrowLeft, FileText, CheckCircle, Lightbulb, MapPin, Target, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAIRecords, mockAIConsultationDetails } from "@/data/creator-studio";

const sentimentConfig: Record<string, { label: string; className?: string; variant?: "destructive" | "secondary" }> = {
  positive: { label: "긍정", className: "bg-green-600 text-white border-transparent" },
  neutral: { label: "중립", variant: "secondary" },
  negative: { label: "부정", variant: "destructive" },
};

interface Props {
  recordId: number;
  onBack: () => void;
}

export default function AIConsultationDetail({ recordId, onBack }: Props) {
  const record = mockAIRecords.find((r) => r.id === recordId);
  const detail = mockAIConsultationDetails[recordId];

  if (!record) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} data-testid="ai-detail-back">
          <ArrowLeft className="mr-1 h-4 w-4" /> 목록으로
        </Button>
        <div className="text-center py-12 text-muted-foreground">상담 이력을 찾을 수 없습니다</div>
      </div>
    );
  }

  const sentiment = sentimentConfig[record.sentiment];
  const summary = detail?.summary ?? record.summary;
  const keyTopics = detail?.keyTopics ?? record.keyTopics;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="ai-detail-back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{record.clientName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">{record.date}</span>
            {detail && <span className="text-sm text-muted-foreground">· {detail.duration}</span>}
            <Badge variant={sentiment.variant} className={sentiment.variant ? undefined : sentiment.className}>
              {sentiment.label}
            </Badge>
          </div>
        </div>
      </div>

      <Card data-testid="ai-detail-summary">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileText className="w-5 h-5 text-primary" /> 상담 요약</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground leading-relaxed">{summary}</p></CardContent>
      </Card>

      {detail && (
        <>
          <Card data-testid="ai-detail-keypoints">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="w-5 h-5 text-green-600" /> 핵심 포인트</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {detail.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-green-600">{i + 1}</span>
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="ai-detail-recommendations">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="w-5 h-5 text-amber-500" /> 추천 사항</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {detail.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3"><MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /><span>{rec}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="ai-detail-actions">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target className="w-5 h-5 text-purple-500" /> 실행 항목</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {detail.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3"><div className="w-5 h-5 rounded border-2 border-purple-500 shrink-0 mt-0.5" /><span>{item}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {detail.marketAnalysis && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="w-5 h-5 text-blue-500" /> 시장 분석</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground leading-relaxed">{detail.marketAnalysis}</p></CardContent>
            </Card>
          )}

          {detail.riskFactors && detail.riskFactors.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5 text-red-500" /> 리스크 요인</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {detail.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" /><span className="text-muted-foreground">{risk}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-1.5">
        {keyTopics.map((topic) => (
          <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
        ))}
      </div>
    </div>
  );
}

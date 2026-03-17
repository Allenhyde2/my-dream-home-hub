"use client"
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAIRecords } from "@/data/creator-studio";

const sentimentConfig: Record<string, { label: string; className?: string; variant?: "destructive" | "secondary" }> = {
  positive: { label: "긍정", className: "bg-green-600 text-white border-transparent" },
  neutral: { label: "중립", variant: "secondary" },
  negative: { label: "부정", variant: "destructive" },
};

export default function AIConsultationHistory() {
  return (
    <div data-testid="content-ai-consultation-history" className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">AI 상담 이력 관리</h3>
      </div>

      <div className="space-y-4">
        {mockAIRecords.map((record) => {
          const sentiment = sentimentConfig[record.sentiment];
          return (
            <Card key={record.id} data-testid={`ai-record-${record.id}`}>
              <CardContent className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{record.clientName}</span>
                  <span className="text-sm text-muted-foreground">{record.date}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {record.summary}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={sentiment.variant}
                    className={sentiment.variant ? undefined : sentiment.className}
                  >
                    {sentiment.label}
                  </Badge>
                  {record.followUpNeeded && (
                    <Badge className="bg-amber-500 text-white border-transparent">
                      후속 조치 필요
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {record.keyTopics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

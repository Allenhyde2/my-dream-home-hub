"use client"
import { useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAIRecords } from "@/data/creator-studio";
import AIConsultationDetail from "./AIConsultationDetail";

const sentimentConfig: Record<string, { label: string; className?: string; variant?: "destructive" | "secondary" }> = {
  positive: { label: "긍정", className: "bg-green-600 text-white border-transparent" },
  neutral: { label: "중립", variant: "secondary" },
  negative: { label: "부정", variant: "destructive" },
};

export default function AIConsultationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [followUpFilter, setFollowUpFilter] = useState("all");
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  if (selectedRecordId !== null) {
    return <AIConsultationDetail recordId={selectedRecordId} onBack={() => setSelectedRecordId(null)} />;
  }

  const filteredRecords = mockAIRecords.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.clientName.toLowerCase().includes(q) && !r.summary.toLowerCase().includes(q)) return false;
    }
    if (sentimentFilter !== "all" && r.sentiment !== sentimentFilter) return false;
    if (followUpFilter === "needed" && !r.followUpNeeded) return false;
    if (followUpFilter === "not-needed" && r.followUpNeeded) return false;
    return true;
  });

  return (
    <div data-testid="content-ai-consultation-history" className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">AI 상담 이력 관리</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="고객명 또는 키워드 검색..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="ai-history-search"
        />
      </div>

      <div className="flex items-center gap-4">
        <Tabs value={sentimentFilter} onValueChange={setSentimentFilter} className="flex-1">
          <TabsList className="grid w-full grid-cols-4" data-testid="ai-sentiment-tabs">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="positive">긍정</TabsTrigger>
            <TabsTrigger value="neutral">중립</TabsTrigger>
            <TabsTrigger value="negative">부정</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={followUpFilter} onValueChange={setFollowUpFilter}>
          <SelectTrigger className="w-[140px]" data-testid="ai-followup-select">
            <SelectValue placeholder="후속 조치" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="needed">필요</SelectItem>
            <SelectItem value="not-needed">불필요</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">{filteredRecords.length}건의 상담 이력</p>

      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">검색 결과가 없습니다</div>
        ) : (
          filteredRecords.map((record) => {
            const sentiment = sentimentConfig[record.sentiment];
            return (
              <Card
                key={record.id}
                data-testid={`ai-record-${record.id}`}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedRecordId(record.id)}
              >
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{record.clientName}</span>
                    <span className="text-sm text-muted-foreground">{record.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{record.summary}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={sentiment.variant} className={sentiment.variant ? undefined : sentiment.className}>
                      {sentiment.label}
                    </Badge>
                    {record.followUpNeeded && (
                      <Badge className="bg-amber-500 text-white border-transparent">후속 조치 필요</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {record.keyTopics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

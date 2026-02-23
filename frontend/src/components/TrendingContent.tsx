import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle, Clock, TrendingUp, Flame, Sparkles } from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  category: string;
  author: string;
  views: number;
  comments: number;
  createdAt: string;
  isHot?: boolean;
}

const newContent: ContentItem[] = [
  { id: 1, title: "2026년 상반기 분양 예정 단지 총정리", category: "분양", author: "분양정보통", views: 234, comments: 12, createdAt: "10분 전", isHot: true },
  { id: 2, title: "GTX-C 노선 개통 예정일 확정", category: "교통", author: "GTX호재분석", views: 189, comments: 8, createdAt: "25분 전" },
  { id: 3, title: "신혼부부 특별공급 자격 완화 소식", category: "청약", author: "청약마스터", views: 156, comments: 15, createdAt: "1시간 전", isHot: true },
  { id: 4, title: "강남 재건축 사업 진행 현황 업데이트", category: "재건축", author: "부동산김사부", views: 298, comments: 23, createdAt: "2시간 전" },
  { id: 5, title: "2026년 대출 금리 전망", category: "대출", author: "대출의신", views: 167, comments: 9, createdAt: "3시간 전" },
  { id: 6, title: "경기도 신도시 입주 물량 분석", category: "신도시", author: "신도시리서치", views: 145, comments: 7, createdAt: "4시간 전" },
];

const popularContent: ContentItem[] = [
  { id: 1, title: "2026년 부동산 시장 전망 총정리", category: "전망", author: "강남부자되기", views: 15234, comments: 342, createdAt: "3일 전", isHot: true },
  { id: 2, title: "내 집 마련 로드맵 완벽 가이드", category: "전략", author: "월급쟁이내집마련", views: 12890, comments: 287, createdAt: "5일 전", isHot: true },
  { id: 3, title: "청약 가점 계산기 활용법", category: "청약", author: "청약마스터", views: 9876, comments: 156, createdAt: "1주 전" },
  { id: 4, title: "재건축 투자 수익률 분석", category: "재건축", author: "부동산김사부", views: 8765, comments: 198, createdAt: "1주 전" },
  { id: 5, title: "취득세 절세 완벽 가이드", category: "절세", author: "절세부동산", views: 7654, comments: 123, createdAt: "2주 전", isHot: true },
  { id: 6, title: "GTX 수혜 지역 분석", category: "교통", author: "GTX호재분석", views: 6543, comments: 98, createdAt: "2주 전" },
];

const TrendingContent = () => {
  const [activeTab, setActiveTab] = useState("new");

  const renderContentList = (items: ContentItem[]) => (
    <div className="grid md:grid-cols-2 gap-3">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="bg-card border-border hover-elevate cursor-pointer"
          data-testid={`trending-item-${item.id}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {item.category}
                  </Badge>
                  {item.isHot && (
                    <Badge className="bg-orange-500 text-white text-xs shrink-0">
                      <Flame className="w-3 h-3 mr-1" />
                      HOT
                    </Badge>
                  )}
                </div>
                <h3 className="font-medium text-foreground line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{item.author}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.createdAt}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {item.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {item.comments}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-foreground">신규/인기 콘텐츠</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-card">
          <TabsTrigger 
            value="new" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-testid="tab-new-content"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            신규 콘텐츠
          </TabsTrigger>
          <TabsTrigger 
            value="popular" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-testid="tab-popular-content"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            인기 콘텐츠
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          {renderContentList(newContent)}
        </TabsContent>

        <TabsContent value="popular">
          {renderContentList(popularContent)}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default TrendingContent;

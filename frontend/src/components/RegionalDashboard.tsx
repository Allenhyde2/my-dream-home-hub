import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, MessageCircle, MapPin, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface TargetArea {
  city: string;
  district: string;
  dong: string;
  priority: number;
}

interface Post {
  id: number;
  title: string;
  views: number;
  comments: number;
  trend: "up" | "down";
  category: string;
  createdAt: string;
}

const generateMockPosts = (area: TargetArea): Post[] => {
  const categories = ["분석", "시세", "분양", "전망", "후기", "개발"];
  const postTemplates = [
    `${area.district} ${area.dong} 아파트 시세 동향`,
    `${area.district} 재건축 호재 분석`,
    `${area.dong} 신규 분양 단지 정보`,
    `${area.district} 전세가 추이 리포트`,
    `${area.dong} 학군 및 생활 인프라 분석`,
    `${area.district} 2026년 부동산 전망`,
    `${area.dong} 실거래가 분석`,
    `${area.district} 대단지 아파트 비교`,
  ];

  return postTemplates.slice(0, 5).map((title, index) => ({
    id: index + 1,
    title,
    views: Math.floor(Math.random() * 3000) + 500,
    comments: Math.floor(Math.random() * 80) + 10,
    trend: (Math.random() > 0.3 ? "up" : "down") as "up" | "down",
    category: categories[Math.floor(Math.random() * categories.length)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const RegionalDashboard = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const targetAreas = user?.targetAreas as TargetArea[] | undefined;

  const [activeTab, setActiveTab] = useState<string>("0");

  const postsData = useMemo(() => {
    if (!targetAreas || targetAreas.length === 0) return {};
    return targetAreas.reduce((acc, area, index) => {
      acc[index.toString()] = generateMockPosts(area);
      return acc;
    }, {} as Record<string, Post[]>);
  }, [targetAreas]);

  if (isLoading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">관심 지역 게시글</h2>
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !targetAreas || targetAreas.length === 0) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">관심 지역 게시글</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {!isAuthenticated
                ? "로그인 후 관심 지역을 설정하면 맞춤 게시글을 볼 수 있습니다."
                : "관심 지역을 설정하면 해당 지역의 최신 게시글을 확인할 수 있습니다."}
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const sortedAreas = [...targetAreas].sort((a, b) => a.priority - b.priority);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">관심 지역 게시글</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6 bg-card">
          {sortedAreas.map((area, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="min-w-fit data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid={`tab-area-${index}`}
            >
              <MapPin className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{area.district}</span>
              <span className="sm:hidden">{area.dong}</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {area.priority}순위
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {sortedAreas.map((area, index) => (
          <TabsContent key={index} value={index.toString()}>
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border-l-2 border-primary/30">
              <p className="text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 inline mr-1" />
                {area.city} {area.district} {area.dong}
              </p>
            </div>
            <div className="space-y-3">
              {postsData[index.toString()]?.map((post) => (
                <Card
                  key={post.id}
                  className="hover-elevate cursor-pointer bg-card border-border"
                  data-testid={`post-card-${index}-${post.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                          {post.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        <h3 className="font-medium text-foreground line-clamp-1">{post.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="w-4 h-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RegionalDashboard;

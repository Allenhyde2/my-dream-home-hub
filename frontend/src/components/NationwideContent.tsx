import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, MessageCircle, ChevronRight } from "lucide-react";

interface RegionContent {
  id: string;
  name: string;
  subRegions: string[];
  topPosts: {
    id: number;
    title: string;
    views: number;
    comments: number;
  }[];
}

const regionData: RegionContent[] = [
  {
    id: "seoul",
    name: "서울특별시",
    subRegions: ["강남구", "서초구", "송파구", "용산구", "마포구"],
    topPosts: [
      { id: 1, title: "강남 재건축 아파트 매수 타이밍", views: 3421, comments: 67 },
      { id: 2, title: "서울 아파트 전세가율 분석", views: 2890, comments: 54 },
      { id: 3, title: "2026년 서울 분양 예정 단지", views: 2456, comments: 48 },
    ],
  },
  {
    id: "gyeonggi",
    name: "경기도",
    subRegions: ["수원시", "성남시", "용인시", "고양시", "화성시"],
    topPosts: [
      { id: 1, title: "GTX 개통 수혜 지역 분석", views: 4123, comments: 89 },
      { id: 2, title: "경기도 신도시 입주 물량", views: 3210, comments: 62 },
      { id: 3, title: "판교 IT밸리 주변 시세", views: 2876, comments: 51 },
    ],
  },
  {
    id: "incheon",
    name: "인천광역시",
    subRegions: ["연수구", "서구", "남동구", "부평구", "계양구"],
    topPosts: [
      { id: 1, title: "송도국제도시 투자 가치", views: 2345, comments: 43 },
      { id: 2, title: "청라신도시 생활 인프라", views: 1987, comments: 38 },
      { id: 3, title: "인천 지하철 연장 호재", views: 1654, comments: 29 },
    ],
  },
  {
    id: "busan",
    name: "부산광역시",
    subRegions: ["해운대구", "수영구", "남구", "동래구", "연제구"],
    topPosts: [
      { id: 1, title: "해운대 재개발 현황", views: 2123, comments: 41 },
      { id: 2, title: "부산 신항만 개발 호재", views: 1876, comments: 35 },
      { id: 3, title: "부산 아파트 시세 동향", views: 1543, comments: 28 },
    ],
  },
  {
    id: "daegu",
    name: "대구광역시",
    subRegions: ["수성구", "달서구", "동구", "북구", "중구"],
    topPosts: [
      { id: 1, title: "수성구 학군 아파트 분석", views: 1876, comments: 34 },
      { id: 2, title: "대구 신규 분양 단지 정보", views: 1543, comments: 28 },
      { id: 3, title: "대구 전세 시장 동향", views: 1234, comments: 22 },
    ],
  },
  {
    id: "sejong",
    name: "세종특별자치시",
    subRegions: ["조치원읍", "새롬동", "도담동", "어진동", "한솔동"],
    topPosts: [
      { id: 1, title: "세종시 행정수도 이전 현황", views: 2654, comments: 52 },
      { id: 2, title: "세종시 아파트 투자 가이드", views: 2123, comments: 41 },
      { id: 3, title: "세종시 교통 인프라 분석", views: 1876, comments: 35 },
    ],
  },
];

const NationwideContent = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">전국 지역별 콘텐츠</h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionData.map((region) => (
          <Card
            key={region.id}
            className="bg-card border-border hover-elevate cursor-pointer group"
            data-testid={`region-card-${region.id}`}
            onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {region.name}
                </CardTitle>
                <ChevronRight
                  className={`w-5 h-5 text-muted-foreground transition-transform ${selectedRegion === region.id ? "rotate-90" : ""
                    }`}
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {region.subRegions.slice(0, 3).map((sub) => (
                  <Badge key={sub} variant="secondary" className="text-xs">
                    {sub}
                  </Badge>
                ))}
                {region.subRegions.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{region.subRegions.length - 3}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {region.topPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-2 p-2 rounded-md bg-accent/40 hover:bg-accent/70 border border-border/20 transition-colors"
                  >
                    <span className="text-xs font-bold text-primary shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-3 text-primary"
                data-testid={`button-more-${region.id}`}
              >
                더보기
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NationwideContent;

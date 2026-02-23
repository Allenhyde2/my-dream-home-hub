"use client"
import { useState } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  BookOpen, 
  Video,
  Receipt,
  Calendar,
  Download,
  FileText
} from "lucide-react";

interface PurchaseItem {
  id: number;
  type: "course" | "consultation" | "content";
  itemName: string;
  price: number;
  purchasedAt: string;
  status: "completed" | "refunded" | "cancelled";
  paymentMethod: string;
  transactionId: string;
}

const mockPurchaseHistory: PurchaseItem[] = [
  { 
    id: 1, 
    type: "course", 
    itemName: "부동산 투자 첫걸음: 완전 초보자를 위한 입문 강의", 
    price: 49000, 
    purchasedAt: "2026-01-15 10:30", 
    status: "completed",
    paymentMethod: "신용카드",
    transactionId: "TXN20260115103045"
  },
  { 
    id: 2, 
    type: "content", 
    itemName: "2026년 서울 재건축 유망 단지 TOP 10 분석", 
    price: 15000, 
    purchasedAt: "2026-01-18 14:20", 
    status: "completed",
    paymentMethod: "신용카드",
    transactionId: "TXN20260118142020"
  },
  { 
    id: 3, 
    type: "course", 
    itemName: "재건축 투자 전략: 사업성 분석부터 출구까지", 
    price: 89000, 
    purchasedAt: "2026-01-20 14:20", 
    status: "completed",
    paymentMethod: "신용카드",
    transactionId: "TXN20260120142015"
  },
  { 
    id: 4, 
    type: "consultation", 
    itemName: "김재건 - 30분 기본 상담 (2026-01-22 14:00)", 
    price: 50000, 
    purchasedAt: "2026-01-22 09:15", 
    status: "completed",
    paymentMethod: "계좌이체",
    transactionId: "TXN20260122091530"
  },
  { 
    id: 5, 
    type: "content", 
    itemName: "청약 당첨 확률 높이는 5가지 전략", 
    price: 12000, 
    purchasedAt: "2026-01-22 16:00", 
    status: "completed",
    paymentMethod: "신용카드",
    transactionId: "TXN20260122160010"
  },
  { 
    id: 6, 
    type: "course", 
    itemName: "청약의 모든 것: A부터 Z까지", 
    price: 39000, 
    purchasedAt: "2026-01-25 16:45", 
    status: "completed",
    paymentMethod: "신용카드",
    transactionId: "TXN20260125164520"
  },
  { 
    id: 7, 
    type: "content", 
    itemName: "GTX 호재 지역 투자 가이드", 
    price: 20000, 
    purchasedAt: "2026-01-25 18:30", 
    status: "completed",
    paymentMethod: "계좌이체",
    transactionId: "TXN20260125183015"
  },
  { 
    id: 8, 
    type: "consultation", 
    itemName: "박청약 - 1시간 심층 상담 (2026-02-10 10:00)", 
    price: 100000, 
    purchasedAt: "2026-01-28 11:00", 
    status: "completed",
    paymentMethod: "신용카드",
    transactionId: "TXN20260128110025"
  },
  { 
    id: 9, 
    type: "course", 
    itemName: "경매 투자 고급 전략", 
    price: 149000, 
    purchasedAt: "2026-01-10 08:30", 
    status: "refunded",
    paymentMethod: "신용카드",
    transactionId: "TXN20260110083010"
  },
  { 
    id: 10, 
    type: "consultation", 
    itemName: "이경매 - 프리미엄 컨설팅 (2026-01-12 14:00)", 
    price: 200000, 
    purchasedAt: "2026-01-08 15:20", 
    status: "cancelled",
    paymentMethod: "계좌이체",
    transactionId: "TXN20260108152005"
  },
];

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredHistory = () => {
    if (activeTab === "all") return mockPurchaseHistory;
    return mockPurchaseHistory.filter((item) => item.type === activeTab);
  };

  const filteredHistory = getFilteredHistory();

  const totalSpent = mockPurchaseHistory
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + item.price, 0);

  const courseCount = mockPurchaseHistory.filter((item) => item.type === "course" && item.status === "completed").length;
  const consultationCount = mockPurchaseHistory.filter((item) => item.type === "consultation" && item.status === "completed").length;
  const contentCount = mockPurchaseHistory.filter((item) => item.type === "content" && item.status === "completed").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="text-xs bg-green-500">결제완료</Badge>;
      case "refunded":
        return <Badge variant="destructive" className="text-xs">환불됨</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="text-xs">취소됨</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-6 h-6 text-primary" />;
      case "content":
        return <FileText className="w-6 h-6 text-orange-500" />;
      case "consultation":
        return <Video className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTypeBgClass = (type: string) => {
    switch (type) {
      case "course":
        return "bg-primary/10";
      case "content":
        return "bg-orange-100 dark:bg-orange-900/20";
      case "consultation":
        return "bg-blue-100 dark:bg-blue-900/20";
      default:
        return "bg-muted";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "course":
        return "강의";
      case "content":
        return "컨텐츠";
      case "consultation":
        return "상담";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/profile")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">구매 내역</h1>
          </div>
          <Button variant="ghost" size="icon" data-testid="button-download">
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">{totalSpent.toLocaleString()}원</p>
                <p className="text-xs sm:text-sm text-muted-foreground">총 결제 금액</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{courseCount}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">강의</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{consultationCount}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">상담</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{contentCount}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">컨텐츠</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" data-testid="tab-all">전체</TabsTrigger>
            <TabsTrigger value="course" data-testid="tab-courses">강의</TabsTrigger>
            <TabsTrigger value="consultation" data-testid="tab-consultations">상담</TabsTrigger>
            <TabsTrigger value="content" data-testid="tab-content">컨텐츠</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <Card key={item.id} data-testid={`history-item-${item.id}`}>
                  <CardContent className="py-4">
                    <div className="flex gap-4">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${getTypeBgClass(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(item.type)}
                          </Badge>
                          {getStatusBadge(item.status)}
                        </div>
                        <h4 className="font-medium line-clamp-2 mb-2">{item.itemName}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.purchasedAt}
                          </span>
                          <span>{item.paymentMethod}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          거래번호: {item.transactionId}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-lg font-bold ${item.status !== "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {item.price.toLocaleString()}원
                        </p>
                        {item.status === "completed" && (
                          <Button variant="ghost" size="sm" className="mt-2 text-xs">
                            영수증
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">구매 내역이 없습니다</h3>
                  <p className="text-muted-foreground">
                    강의, 상담 또는 컨텐츠를 구매하면 여기에 표시됩니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PurchaseHistory;

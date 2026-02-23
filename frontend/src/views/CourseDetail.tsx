"use client";

import { useState } from "react";
import { useParams, useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  PlayCircle,
  Check,
  ShoppingCart,
  CreditCard
} from "lucide-react";
import { getCourseById, LEVEL_DESCRIPTIONS } from "@/data/courses";

const CourseDetail = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const id = params?.id;
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const course = getCourseById(Number(id));
  
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">강의를 찾을 수 없습니다</h2>
          <Button onClick={() => navigate("/")} data-testid="button-go-home">
            메인으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const levelInfo = LEVEL_DESCRIPTIONS[course.level];
  const discountPercent = Math.round((1 - course.price / course.originalPrice) * 100);

  const handlePayment = () => {
    setPaymentComplete(true);
  };

  const handleStartLearning = () => {
    setPaymentDialogOpen(false);
    navigate(`/course/${course.id}/lecture/1`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold line-clamp-1">강의 상세</h1>
        </div>
      </header>

      <div className={`${levelInfo.color} py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-white/20 hover:bg-white/30 text-white">
                  {course.level}
                </Badge>
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-white/30 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-course-title">
                {course.title}
              </h1>
              <p className="text-white/90 mb-4">{course.description}</p>
              <p className="text-white/80 mb-4">강사: {course.instructor}</p>
              <div className="flex flex-wrap gap-4 text-white/90">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {course.rating} ({course.reviewCount}개 리뷰)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.studentCount.toLocaleString()}명 수강
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  총 {course.totalDuration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.lessonCount}개 강의
                </span>
              </div>
            </div>

            <Card className="w-full md:w-80 shrink-0">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-primary">
                      {course.price.toLocaleString()}원
                    </span>
                    {course.originalPrice > course.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        {course.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  {course.originalPrice > course.price && (
                    <Badge variant="destructive">{discountPercent}% 할인</Badge>
                  )}
                </div>
                <Button 
                  className="w-full mb-3 gap-2" 
                  size="lg"
                  onClick={() => setPaymentDialogOpen(true)}
                  data-testid="button-purchase"
                >
                  <ShoppingCart className="w-4 h-4" />
                  수강 신청
                </Button>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    평생 무제한 수강
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    수료증 발급
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Q&A 게시판 이용
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              커리큘럼
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="lessons">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>{course.lessonCount}개 강의</span>
                    <span className="text-sm text-muted-foreground">{course.totalDuration}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {course.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer"
                        data-testid={`lesson-item-${lesson.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <PlayCircle className="w-4 h-4" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>이런 분께 추천해요</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {course.level === "초보" && (
                <>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>부동산 투자를 처음 시작하는 분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>기초 개념부터 차근차근 배우고 싶은 분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>내 집 마련을 준비하는 분</span>
                  </li>
                </>
              )}
              {course.level === "중수" && (
                <>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>기초 지식을 갖추고 실전 투자를 준비하는 분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>특정 분야에 대한 심화 학습이 필요한 분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>투자 수익률을 높이고 싶은 분</span>
                  </li>
                </>
              )}
              {course.level === "고수" && (
                <>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>다양한 고급 투자 전략을 익히고 싶은 분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>자산 규모를 크게 늘리고 싶은 분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>전문 투자자로 성장하고 싶은 분</span>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </main>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          {paymentComplete ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  결제 완료
                </DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center">
                <h3 className="text-lg font-semibold mb-2">수강 신청이 완료되었습니다!</h3>
                <p className="text-muted-foreground mb-4">
                  지금 바로 학습을 시작해보세요.
                </p>
                <div className="bg-muted rounded-lg p-4 text-left mb-4">
                  <p className="font-medium mb-1">{course.title}</p>
                  <p className="text-sm text-muted-foreground">결제 금액: {course.price.toLocaleString()}원</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleStartLearning} className="w-full" data-testid="button-start-learning">
                  학습 시작하기
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  결제하기
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">주문 정보</h4>
                  <p className="text-sm text-muted-foreground mb-2">{course.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">결제 금액</span>
                    <span className="font-bold text-primary">{course.price.toLocaleString()}원</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">결제 수단</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start gap-2" data-testid="payment-card">
                      <CreditCard className="w-4 h-4" />
                      신용카드
                    </Button>
                    <Button variant="outline" className="justify-start gap-2" data-testid="payment-bank">
                      <span className="text-sm">🏦</span>
                      계좌이체
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  * 이 화면은 결제 시뮬레이션입니다. 실제 결제가 진행되지 않습니다.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handlePayment} className="w-full" data-testid="button-confirm-payment">
                  {course.price.toLocaleString()}원 결제하기
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;

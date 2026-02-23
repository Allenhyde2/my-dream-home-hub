"use client"
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useParams, useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Star,
  Users,
  Award,
  Clock,
  MessageCircle,
  Video,
  Lock,
  Eye,
  Heart,
  Calendar,
  Check,
  X
} from "lucide-react";
import { getCreatorById } from "@/data/creators";
import { ko } from "date-fns/locale";
import { format, addDays, isBefore, startOfDay } from "date-fns";

interface Reservation {
  date: string;
  startTime: string;
  endTime: string;
  productId: number;
}

interface ConsultingOption {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  durationMinutes: number;
  slotInterval: number;
  requiredWindow: number;
}

const CreatorProfile = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const id = params?.id;
  const [activeTab, setActiveTab] = useState("main");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ConsultingOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([
    { date: "2026-01-30", startTime: "10:00", endTime: "10:30", productId: 1 },
    { date: "2026-01-30", startTime: "14:00", endTime: "15:00", productId: 2 },
    { date: "2026-01-31", startTime: "11:00", endTime: "13:00", productId: 3 },
  ]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const creator = getCreatorById(Number(id));

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">크리에이터를 찾을 수 없습니다</h2>
          <Button onClick={() => navigate("/")} data-testid="button-go-back">
            메인으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const mainContent = [
    { id: 1, title: `${creator.specialty} 시장 동향 분석`, views: 2340, likes: 156, date: "2일 전" },
    { id: 2, title: "이번 주 주목할 매물 TOP 5", views: 1890, likes: 98, date: "4일 전" },
    { id: 3, title: "초보자를 위한 부동산 기초 가이드", views: 3210, likes: 245, date: "1주일 전" },
    { id: 4, title: "2025년 부동산 시장 전망", views: 4520, likes: 312, date: "2주일 전" },
    { id: 5, title: "실전 매수 체크리스트", views: 2100, likes: 178, date: "3주일 전" },
  ];

  const paidContent = [
    { id: 1, title: `[프리미엄] ${creator.specialty} 심층 분석 리포트`, price: 29000, subscribers: 156 },
    { id: 2, title: "[독점] 숨겨진 호재 지역 분석", price: 39000, subscribers: 89 },
    { id: 3, title: `[VIP] ${creator.name}의 투자 포트폴리오 공개`, price: 99000, subscribers: 42 },
  ];

  const consultingOptions: ConsultingOption[] = [
    { id: 1, title: "30분 기본 상담", description: "간단한 질문과 방향성 상담", price: 50000, duration: "30분", durationMinutes: 30, slotInterval: 30, requiredWindow: 30 },
    { id: 2, title: "1시간 심층 상담", description: "구체적인 투자 전략 수립", price: 100000, duration: "60분", durationMinutes: 60, slotInterval: 60, requiredWindow: 60 },
    { id: 3, title: "프리미엄 컨설팅", description: "맞춤형 투자 계획 + 후속 관리", price: 300000, duration: "90분 + 후속", durationMinutes: 90, slotInterval: 60, requiredWindow: 120 },
  ];

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const generateTimeSlots = (interval: number): string[] => {
    const slots: string[] = [];
    const startHour = 9 * 60;
    const endHour = 18 * 60;

    for (let minutes = startHour; minutes < endHour; minutes += interval) {
      slots.push(minutesToTime(minutes));
    }
    return slots;
  };

  const isTimeSlotAvailable = (
    date: string,
    startTime: string,
    product: ConsultingOption
  ): boolean => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + product.requiredWindow;

    if (endMinutes > 18 * 60) return false;

    for (const reservation of reservations) {
      if (reservation.date !== date) continue;

      const resStart = timeToMinutes(reservation.startTime);
      const resEnd = timeToMinutes(reservation.endTime);

      if (startMinutes < resEnd && endMinutes > resStart) {
        return false;
      }
    }

    return true;
  };

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedProduct) return [];

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const slots = generateTimeSlots(selectedProduct.slotInterval);

    return slots.map((slot) => ({
      time: slot,
      available: isTimeSlotAvailable(dateStr, slot, selectedProduct),
    }));
  }, [selectedDate, selectedProduct, reservations]);

  const handleBookingClick = (option: ConsultingOption) => {
    setSelectedProduct(option);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setBookingConfirmed(false);
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !selectedProduct) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const startMinutes = timeToMinutes(selectedTime);
    const endMinutes = startMinutes + selectedProduct.durationMinutes;

    const newReservation: Reservation = {
      date: dateStr,
      startTime: selectedTime,
      endTime: minutesToTime(endMinutes),
      productId: selectedProduct.id,
    };

    setReservations([...reservations, newReservation]);
    setBookingConfirmed(true);
  };

  const handleCloseDialog = () => {
    setBookingDialogOpen(false);
    setSelectedProduct(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setBookingConfirmed(false);
  };

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">크리에이터 프로필</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-border">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className={`${creator.color} text-white text-2xl font-bold`}>
                    {creator.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {creator.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold" data-testid="text-creator-name">{creator.name}</h2>
                  {creator.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      인증 크리에이터
                    </Badge>
                  )}
                </div>

                <Badge className="mb-3">{creator.specialty}</Badge>

                <p className="text-muted-foreground mb-4" data-testid="text-creator-bio">
                  {creator.bio}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>팔로워 {creator.followers.toLocaleString()}명</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>경력 {creator.experience}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{creator.rating}점</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button className="flex-1 md:flex-none" data-testid="button-follow">
                  팔로우
                </Button>
                <Button variant="outline" size="icon" data-testid="button-message">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">전문 분야</h3>
              <div className="flex flex-wrap gap-2">
                {creator.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>

            {creator.certifications.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">보유 자격증</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="gap-1">
                      <Award className="w-3 h-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="main" data-testid="tab-main">메인 페이지</TabsTrigger>
            <TabsTrigger value="paid" data-testid="tab-paid">유료 컨텐츠</TabsTrigger>
            <TabsTrigger value="consulting" data-testid="tab-consulting">일대일 온라인 상담</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">최신 콘텐츠</h3>
              <Button variant="ghost" size="sm">전체보기</Button>
            </div>
            {mainContent.map((content) => (
              <Card key={content.id} className="hover-elevate cursor-pointer" data-testid={`content-card-${content.id}`}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{content.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {content.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {content.likes}
                        </span>
                        <span>{content.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="paid" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">유료 콘텐츠</h3>
              <Badge variant="secondary" className="gap-1">
                <Lock className="w-3 h-3" />
                프리미엄
              </Badge>
            </div>
            {paidContent.map((content) => (
              <Card key={content.id} className="hover-elevate cursor-pointer" data-testid={`paid-content-${content.id}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">{content.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {content.subscribers}명이 구독 중
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{content.price.toLocaleString()}원</p>
                      <Button size="sm" className="mt-2">구매하기</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="consulting" className="space-y-4">
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">온라인 1:1 상담</h3>
                    <p className="text-sm text-muted-foreground">화상 통화로 직접 상담을 받으실 수 있습니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {consultingOptions.map((option) => (
              <Card key={option.id} className="hover-elevate" data-testid={`consulting-option-${option.id}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{option.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{option.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">{option.price.toLocaleString()}원</p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => handleBookingClick(option)}
                        data-testid={`button-book-${option.id}`}
                      >
                        예약하기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {bookingConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  예약 완료
                </DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center">
                <h3 className="text-lg font-semibold mb-4">상담 예약이 완료되었습니다!</h3>
                <div className="bg-muted rounded-lg p-4 space-y-2 text-left">
                  <p><span className="text-muted-foreground">상담 유형:</span> {selectedProduct?.title}</p>
                  <p><span className="text-muted-foreground">날짜:</span> {selectedDate && format(selectedDate, "yyyy년 M월 d일 (EEEE)", { locale: ko })}</p>
                  <p><span className="text-muted-foreground">시간:</span> {selectedTime} ~ {selectedTime && selectedProduct && minutesToTime(timeToMinutes(selectedTime) + selectedProduct.durationMinutes)}</p>
                  <p><span className="text-muted-foreground">금액:</span> {selectedProduct?.price.toLocaleString()}원</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCloseDialog} className="w-full" data-testid="button-close-confirm">
                  확인
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedProduct?.title} 예약</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    날짜 선택
                  </h4>
                  <div className="flex justify-center">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      disabled={(date) => isBefore(date, today) || isBefore(maxDate, date)}
                      locale={ko}
                      className="rounded-md border p-4 w-full flex justify-center"
                      classNames={{
                        head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem]",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 outline-none hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                        month: "space-y-4 w-full",
                        table: "w-full border-collapse space-y-1",
                      }}
                      data-testid="calendar"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      시간 선택
                      <span className="text-sm text-muted-foreground font-normal">
                        ({selectedProduct?.slotInterval}분 단위)
                      </span>
                    </h4>
                    {selectedProduct?.id === 3 && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                        프리미엄 컨설팅은 선택 시간부터 2시간 동안 다른 예약이 없어야 합니다.
                      </p>
                    )}
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                      {availableTimeSlots.map(({ time, available }) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          disabled={!available}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            !available ? "opacity-50 cursor-not-allowed" : "",
                            "h-9 px-0"
                          )}
                          data-testid={`time-slot-${time.replace(":", "")}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    {availableTimeSlots.every(slot => !slot.available) && (
                      <p className="text-sm text-muted-foreground mt-3 text-center">
                        선택한 날짜에 예약 가능한 시간이 없습니다.
                      </p>
                    )}
                  </div>
                )}

                {selectedDate && selectedTime && selectedProduct && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">예약 정보</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">날짜:</span> {format(selectedDate, "yyyy년 M월 d일 (EEEE)", { locale: ko })}</p>
                      <p><span className="text-muted-foreground">시간:</span> {selectedTime} ~ {minutesToTime(timeToMinutes(selectedTime) + selectedProduct.durationMinutes)}</p>
                      <p><span className="text-muted-foreground">금액:</span> <span className="font-semibold text-primary">{selectedProduct.price.toLocaleString()}원</span></p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full"
                  data-testid="button-confirm-booking"
                >
                  예약 확정
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorProfile;

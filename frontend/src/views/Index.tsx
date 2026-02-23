import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useNavigate } from "@/hooks/use-navigate";
import HeroBanner from "@/components/HeroBanner";
import RegionalDashboard from "@/components/RegionalDashboard";
import PurchaseGoals from "@/components/PurchaseGoals";
import PersonalizedContent from "@/components/PersonalizedContent";
import TrendingContent from "@/components/TrendingContent";
import NationwideContent from "@/components/NationwideContent";
import CreatorsList from "@/components/CreatorsList";
import CoursesSection from "@/components/CoursesSection";
import { Home, Bell, User, Search, LogOut, LogIn, BookOpen, Calendar, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import Onboarding from "./Onboarding";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, isAuthenticated, needsOnboarding } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const handleTestOnboarding = () => {
    navigate('/signup');
  };

  const handleOnboardingExit = () => {
    setIsOnboardingOpen(false);
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    setTimeout(() => setShowNotificationPopup(true), 500);
  };

  useEffect(() => {
    if (needsOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, [needsOnboarding]);

  // standalone 온보딩 완료 후 리다이렉트된 경우 알림 팝업 노출
  useEffect(() => {
    if (searchParams?.get("showNotification") === "true") {
      setTimeout(() => setShowNotificationPopup(true), 500);
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const f = firstName?.charAt(0) || "";
    const l = lastName?.charAt(0) || "";
    return (f + l).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">부동산 정보</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="지역, 아파트명 검색..."
                  className="pl-10 bg-background border-border"
                  data-testid="input-search"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleTestOnboarding}>
                회원가입 테스트
              </Button>
              <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
                <DialogContent className="max-w-3xl h-[85vh] overflow-y-auto">
                  <DialogHeader className="sr-only">
                    <DialogTitle>회원가입</DialogTitle>
                    <DialogDescription>회원가입 추가 정보 입력</DialogDescription>
                  </DialogHeader>
                  <Onboarding isEmbedded onClose={handleOnboardingExit} onComplete={handleOnboardingComplete} />
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon" className="text-foreground" data-testid="button-notifications">
                <Bell className="w-5 h-5" />
              </Button>

              {isLoading ? (
                <Skeleton className="w-9 h-9 rounded-full" />
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer" data-testid="link-profile">
                      <User className="w-4 h-4 mr-2" />
                      <span>내 프로필</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-reservations")} className="cursor-pointer" data-testid="link-reservations">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>예약 현황</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-courses")} className="cursor-pointer" data-testid="link-my-learning">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>내 강의</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" className="flex items-center gap-2 cursor-pointer" data-testid="link-logout">
                        <LogOut className="w-4 h-4" />
                        <span>로그아웃</span>
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="default" size="sm" data-testid="button-login">
                  <a href="/login" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>로그인</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* Hero Banner Carousel */}
        <HeroBanner />

        {/* Regional Dashboard with Tabs */}
        <RegionalDashboard />

        {/* Purchase Goals & Missions */}
        <PurchaseGoals />

        {/* Personalized Content */}
        <PersonalizedContent />

        {/* New/Popular Content */}
        <TrendingContent />

        {/* Nationwide Regional Content */}
        <NationwideContent />

        {/* Recommended Creators */}
        <CreatorsList />

        {/* Real Estate Courses */}
        <CoursesSection />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-primary" data-testid="nav-home">
            <Home className="w-5 h-5" />
            <span className="text-xs">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted" data-testid="nav-search">
            <Search className="w-5 h-5" />
            <span className="text-xs">검색</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted" data-testid="nav-notifications">
            <Bell className="w-5 h-5" />
            <span className="text-xs">알림</span>
          </button>
          {isAuthenticated && user ? (
            <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 text-muted" data-testid="nav-profile">
              <Avatar className="w-5 h-5">
                <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                <AvatarFallback className="text-xs">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">마이</span>
            </button>
          ) : (
            <a href="/login" className="flex flex-col items-center gap-1 text-muted" data-testid="nav-login">
              <User className="w-5 h-5" />
              <span className="text-xs">로그인</span>
            </a>
          )}
        </div>
      </nav>
      {/* 알림 허용 팝업 — 온보딩 완료 직후 노출 */}
      <AlertDialog open={showNotificationPopup} onOpenChange={setShowNotificationPopup}>
        <AlertDialogContent className="max-w-sm rounded-2xl p-6">
          <AlertDialogHeader className="sr-only">
            <AlertDialogTitle>뉴글 알림 받기</AlertDialogTitle>
            <AlertDialogDescription>알림 수신 동의 여부를 선택해주세요</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#126BFF]/10 flex items-center justify-center mb-5">
              <BellRing className="w-8 h-8 text-[#126BFF]" />
            </div>
            <p className="text-[15px] leading-relaxed text-foreground mb-1">
              놓치면 안될 <span className="font-bold text-[#126BFF]">줍줍·청약 정보</span>와
            </p>
            <p className="text-[15px] leading-relaxed text-foreground mb-1">
              관심지역 <span className="font-bold text-[#126BFF]">핵심 소식</span>을
            </p>
            <p className="text-[15px] leading-relaxed text-foreground mb-6">
              뉴글이 알아서 보내드릴게요
            </p>
            <p className="text-sm font-semibold text-foreground mb-5">
              뉴글 알림 받기
            </p>
          </div>
          <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 mt-0 rounded-xl h-12">
              허용 안 함
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-xl h-12 bg-[#126BFF] hover:bg-[#126BFF]/90"
              onClick={() => setShowNotificationPopup(false)}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;

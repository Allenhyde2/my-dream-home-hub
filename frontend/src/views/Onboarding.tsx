import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Gift,
  Search,
  MapPin,
  Calendar,
  Wallet,
  Users,
  Heart,
  Shield,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCities,
  getDistrictsByCity,
  getDongsByDistrict,
  searchAddress,
} from "@/data/koreanDistricts";
import {
  FAMILY_TYPES,
  INTEREST_OPTIONS,
  AVAILABLE_FUNDS_OPTIONS,
  TargetArea,
} from "@/shared/models/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

const TOTAL_STEPS = 9;

const PRIORITY_LABELS = ["1순위", "2순위", "3순위"] as const;

interface TermItem {
  key: string;
  label: string;
  required: boolean;
  content: string;
}

const TERMS_LIST: TermItem[] = [
  {
    key: "terms",
    label: "이용약관 동의",
    required: true,
    content: `제1조 (목적)
본 약관은 드림홈허브(이하 "회사")가 제공하는 부동산 정보 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 제공하는 부동산 시세 조회, 맞춤 매물 추천, 청약 정보, 투자 분석 등 일체의 온라인 서비스를 의미합니다.
② "이용자"란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
③ "콘텐츠"란 서비스 내에서 제공되는 텍스트, 이미지, 데이터, 분석 자료 등을 의미합니다.

제3조 (약관의 효력 및 변경)
① 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.
② 회사는 관련 법령에 위배되지 않는 범위에서 약관을 개정할 수 있으며, 변경 시 7일 전 공지합니다.

제4조 (서비스의 제공)
① 회사는 이용자에게 부동산 정보 및 분석 서비스를 제공합니다.
② 서비스 내 제공되는 정보는 참고용이며, 투자 판단의 최종 책임은 이용자에게 있습니다.

제5조 (이용자의 의무)
① 이용자는 관련 법령 및 본 약관의 규정을 준수하여야 합니다.
② 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.`,
  },
  {
    key: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    content: `1. 수집하는 개인정보 항목
- 필수항목: 닉네임, 거주지역(시/도, 시/군/구, 읍/면/동)
- 선택항목: 관심 투자 지역, 가족 형태, 가용 자금 범위, 매수 목표 시기, 관심사 및 투자 성향

2. 개인정보의 수집 및 이용 목적
- 맞춤형 부동산 정보 및 매물 추천 서비스 제공
- 지역별 시세 분석 및 투자 인사이트 제공
- 서비스 이용 통계 분석 및 서비스 개선
- 신규 서비스 개발 및 이용자 맞춤 콘텐츠 제공

3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다.
- 단, 관계 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
  · 계약 또는 청약철회에 관한 기록: 5년
  · 소비자 불만 또는 분쟁 처리에 관한 기록: 3년

4. 동의 거부 시 불이익
- 필수 항목에 대한 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.`,
  },
  {
    key: "marketing",
    label: "마케팅 정보 수신 동의",
    required: false,
    content: `1. 마케팅 활용 목적
- 신규 매물 알림, 관심 지역 시세 변동 안내
- 이벤트, 프로모션, 할인 혜택 정보 전달
- 맞춤형 부동산 투자 콘텐츠 및 뉴스레터 발송

2. 활용 항목
- 닉네임, 관심 지역, 투자 성향, 서비스 이용 기록

3. 수신 채널
- 이메일, 문자(SMS/MMS), 카카오톡 알림톡

4. 보유 기간
- 동의 철회 시까지 (서비스 내 설정에서 언제든 철회 가능)

※ 본 동의는 선택사항이며, 거부하셔도 서비스 이용에 제한이 없습니다.`,
  },
  {
    key: "push",
    label: "앱 푸시 알림 수신 동의",
    required: false,
    content: `1. 푸시 알림 내용
- 관심 지역 급매물/신규 매물 알림
- 실시간 시세 변동 및 호가 변경 알림
- 청약 일정 및 분양 정보 안내
- 리워드 적립/사용 내역 안내

2. 알림 시간
- 기본 알림 시간: 오전 8시 ~ 오후 10시
- 긴급 매물 알림은 시간 제한 없이 발송될 수 있습니다.

※ 본 동의는 선택사항이며, 기기 설정 또는 앱 내 설정에서 언제든 변경 가능합니다.`,
  },
  {
    key: "thirdParty",
    label: "개인정보 제3자 제공 동의",
    required: false,
    content: `1. 제공받는 자
- 제휴 공인중개사 사무소, 제휴 금융기관(은행, 보험사)

2. 제공 항목
- 닉네임, 관심 지역, 매수 예산 범위, 매수 목표 시기

3. 제공 목적
- 맞춤형 매물 중개 서비스 연결
- 부동산 담보대출 등 금융 상품 안내

4. 보유 및 이용 기간
- 제공 목적 달성 후 즉시 파기
- 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관

※ 본 동의는 선택사항이며, 거부하셔도 기본 서비스 이용에 제한이 없습니다.`,
  },
];

interface OnboardingData {
  nickname: string;
  residenceCity: string;
  residenceDistrict: string;
  residenceDong: string;
  targetAreas: TargetArea[];
  purchaseTimeline: number;
  availableFunds: string;
  familyTypes: string[];
  interests: string[];
}

interface OnboardingProps {
  isEmbedded?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

export default function Onboarding({ isEmbedded, onClose, onComplete }: OnboardingProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFadeOut, setShowFadeOut] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);


  const [data, setData] = useState<OnboardingData>({
    nickname: "",
    residenceCity: "",
    residenceDistrict: "",
    residenceDong: "",
    targetAreas: [],
    purchaseTimeline: 6,
    availableFunds: "3억",
    familyTypes: [],
    interests: [],
  });

  const [agreements, setAgreements] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    marketing: false,
    push: false,
    thirdParty: false,
  });
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({
    terms: true,
    privacy: true,
  });

  const allAgreed = TERMS_LIST.every((t) => agreements[t.key]);
  const requiredAgreed = TERMS_LIST.filter((t) => t.required).every((t) => agreements[t.key]);

  const toggleAll = () => {
    const newValue = !allAgreed;
    const next: Record<string, boolean> = {};
    TERMS_LIST.forEach((t) => { next[t.key] = newValue; });
    setAgreements(next);
  };

  const toggleAgreement = (key: string) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpanded = (key: string) => {
    setExpandedTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [residenceSearch, setResidenceSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchHighlight, setSearchHighlight] = useState(-1);

  const residenceInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce the search query (not the display value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(residenceSearch);
    }, 200);
    return () => clearTimeout(timer);
  }, [residenceSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        residenceInputRef.current &&
        !residenceInputRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Target area selection state
  const [selectedCity, setSelectedCity] = useState<string>("서울특별시");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const updateMutation = useMutation({
    mutationFn: async (profileData: OnboardingData) => {
      return apiRequest("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({
          ...profileData,
          onboardingCompleted: true,
          rewardPoints: 3000,
          marketingAccepted: agreements.marketing,
          adAgreementAccepted: agreements.push,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const searchResultsMemo = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchAddress(debouncedQuery);
  }, [debouncedQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!searchOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setSearchOpen(true);
        setSearchHighlight(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (searchResultsMemo.length > 0) {
          setSearchHighlight((prev) =>
            Math.min(prev + 1, searchResultsMemo.length - 1)
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (searchResultsMemo.length > 0) {
          setSearchHighlight((prev) => Math.max(prev - 1, 0));
        }
        break;
      case "Enter":
        e.preventDefault();
        if (searchHighlight >= 0 && searchResultsMemo[searchHighlight]) {
          handleSelectResidence(
            searchResultsMemo[searchHighlight].city,
            searchResultsMemo[searchHighlight].district,
            searchResultsMemo[searchHighlight].dong
          );
        }
        break;
      case "Escape":
        setSearchOpen(false);
        setSearchHighlight(-1);
        break;
    }
  };

  const handleSelectResidence = useCallback(
    (city: string, district: string, dong: string) => {
      setData((prev) => ({
        ...prev,
        residenceCity: city,
        residenceDistrict: district,
        residenceDong: dong,
      }));
      setResidenceSearch(`${city} ${district} ${dong}`);
      setSearchOpen(false);
      setSearchHighlight(-1);
    },
    []
  );

  // Nickname enter handler
  const handleNicknameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && data.nickname.trim().length >= 2) {
      e.preventDefault();
      setStep(3);
    }
  };

  const addTargetArea = (city: string, district: string, dong: string) => {
    if (data.targetAreas.length >= 3) return;
    if (
      data.targetAreas.some(
        (a) => a.city === city && a.district === district && a.dong === dong
      )
    )
      return;

    const newArea: TargetArea = {
      city,
      district,
      dong,
      priority: data.targetAreas.length + 1,
    };
    setData({ ...data, targetAreas: [...data.targetAreas, newArea] });
  };

  const removeTargetArea = (index: number) => {
    const newAreas = data.targetAreas
      .filter((_, i) => i !== index)
      .map((area, i) => ({
        ...area,
        priority: i + 1,
      }));
    setData({ ...data, targetAreas: newAreas });
  };

  const toggleFamilyType = (type: string) => {
    if (data.familyTypes.includes(type)) {
      setData({
        ...data,
        familyTypes: data.familyTypes.filter((t) => t !== type),
      });
    } else if (data.familyTypes.length < 3) {
      setData({ ...data, familyTypes: [...data.familyTypes, type] });
    }
  };

  const toggleInterest = (interest: string) => {
    if (data.interests.includes(interest)) {
      setData({
        ...data,
        interests: data.interests.filter((i) => i !== interest),
      });
    } else if (data.interests.length < 5) {
      setData({ ...data, interests: [...data.interests, interest] });
    }
  };

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return requiredAgreed;
      case 2:
        return data.nickname.trim().length >= 2;
      case 3:
        return data.residenceDong.length > 0;
      case 4:
        return data.targetAreas.length >= 1;
      case 5:
        return true;
      case 6:
        return true;
      case 7:
        return data.familyTypes.length >= 1;
      case 8:
        return data.interests.length >= 1;
      case 9:
        return true;
      default:
        return false;
    }
  }, [step, data, requiredAgreed]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setShowExitDialog(true);
    } else {
      setStep(step - 1);
    }
  };

  const coinPositions = useRef(
    Array.from({ length: 12 }).map((_, i) => ({
      x: `${Math.cos((i / 12) * Math.PI * 2) * 70}px`,
      y: `${-50 - Math.random() * 80}px`,
      delay: `${i * 0.06}s`,
    }))
  );

  const navigateAfterComplete = () => {
    if (onComplete) {
      onComplete();
    } else if (onClose) {
      onClose();
    } else {
      window.location.href = "/?showNotification=true";
    }
  };

  const fireRewardAnimation = async (buttonRect?: DOMRect) => {
    setShowRewardAnimation(true);

    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#FFD700", "#FFA500", "#FFEC8B", "#DAA520", "#F5DEB3"];
    
    const origin = buttonRect 
      ? { 
          x: (buttonRect.left + buttonRect.width / 2) / window.innerWidth,
          y: (buttonRect.top) / window.innerHeight 
        }
      : { y: 0.85 };

    confetti({ 
      particleCount: 80, 
      spread: 100, 
      origin, 
      colors, 
      gravity: 0.6,
      startVelocity: 35,
      angle: 90,
    });
    
    setTimeout(() => confetti({ 
      particleCount: 60, 
      spread: 70, 
      origin: { y: 0.4, x: 0.35 }, 
      colors, 
      gravity: 0.7 
    }), 300);
    
    setTimeout(() => confetti({ 
      particleCount: 60, 
      spread: 70, 
      origin: { y: 0.4, x: 0.65 }, 
      colors, 
      gravity: 0.7 
    }), 500);
  };

  const handleRewardClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    
    setIsProcessing(true);
    
    const saveProfile = updateMutation.mutateAsync(data).catch((error) => {
      console.error("Failed to save profile:", error);
    });

    await new Promise((r) => setTimeout(r, 800));
    
    setIsProcessing(false);
    fireRewardAnimation(buttonRect);

    await Promise.all([
      new Promise((r) => setTimeout(r, 2500)),
      saveProfile,
    ]);
    
    setShowFadeOut(true);
    
    await new Promise((r) => setTimeout(r, 500));
    
    navigateAfterComplete();
  };






















  const currentDistricts = getDistrictsByCity(selectedCity);
  const currentDongs = useMemo(() => {
    if (!selectedDistrict) return [];
    return getDongsByDistrict(selectedCity, selectedDistrict);
  }, [selectedCity, selectedDistrict]);

  const INPUT_STEPS = TOTAL_STEPS - 1; // 완료 화면 제외한 입력 단계 수
  const progress = Math.min((step / INPUT_STEPS) * 100, 100);

  const fundsIndex = AVAILABLE_FUNDS_OPTIONS.indexOf(
    data.availableFunds as (typeof AVAILABLE_FUNDS_OPTIONS)[number]
  );

  // Step 9: full-screen completion
  if (step === 9) {
    const topArea = data.targetAreas.find((a) => a.priority === 1);
    const areaLabel = topArea ? `${topArea.district} ${topArea.dong}` : "";

    return (
      <div className={cn(
        "min-h-screen bg-background flex flex-col relative transition-opacity duration-500",
        showFadeOut && "opacity-0"
      )}>
        {/* Dim overlay during processing */}
        {isProcessing && (
          <div 
            className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-white text-lg font-medium">지급 중...</p>
            </div>
          </div>
        )}
        
        {!showRewardAnimation ? (
      <div className="min-h-screen bg-background flex flex-col">
        {!showRewardAnimation ? (
          <>
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              {/* Welcome illustration */}
              <div className="relative w-56 h-56 mb-8">
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="95" fill="url(#skyGrad)" />
                  <ellipse cx="100" cy="160" rx="80" ry="12" fill="#86EFAC" opacity="0.6" />
                  <rect x="60" y="95" width="80" height="60" rx="4" fill="#F9A8D4" />
                  <path d="M50 100 L100 60 L150 100" fill="#FB7185" stroke="#E11D48" strokeWidth="2" strokeLinejoin="round" />
                  <rect x="88" y="120" width="24" height="35" rx="3" fill="#7C3AED" />
                  <circle cx="106" cy="140" r="2.5" fill="#FDE68A" />
                  <rect x="66" y="105" width="16" height="16" rx="2" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
                  <line x1="74" y1="105" x2="74" y2="121" stroke="#93C5FD" strokeWidth="1" />
                  <line x1="66" y1="113" x2="82" y2="113" stroke="#93C5FD" strokeWidth="1" />
                  <rect x="118" y="105" width="16" height="16" rx="2" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
                  <line x1="126" y1="105" x2="126" y2="121" stroke="#93C5FD" strokeWidth="1" />
                  <line x1="118" y1="113" x2="134" y2="113" stroke="#93C5FD" strokeWidth="1" />
                  <rect x="120" y="65" width="14" height="25" rx="2" fill="#FDA4AF" />
                  <path d="M100 42 C95 32, 80 32, 80 42 C80 52, 100 62, 100 62 C100 62, 120 52, 120 42 C120 32, 105 32, 100 42Z" fill="#F43F5E" opacity="0.9" />
                  <circle cx="40" cy="45" r="3" fill="#FDE68A" />
                  <circle cx="160" cy="50" r="2.5" fill="#FDE68A" />
                  <circle cx="55" cy="30" r="2" fill="#FDE68A" />
                  <circle cx="150" cy="35" r="2" fill="#FDE68A" />
                  <ellipse cx="35" cy="70" rx="18" ry="8" fill="white" opacity="0.7" />
                  <ellipse cx="28" cy="68" rx="10" ry="7" fill="white" opacity="0.7" />
                  <ellipse cx="170" cy="75" rx="16" ry="7" fill="white" opacity="0.7" />
                  <ellipse cx="178" cy="73" rx="10" ry="6" fill="white" opacity="0.7" />
                  <defs>
                    <radialGradient id="skyGrad" cx="0.5" cy="0.3" r="0.7">
                      <stop offset="0%" stopColor="#DBEAFE" />
                      <stop offset="100%" stopColor="#EFF6FF" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Welcome text */}
              <h2 className="text-2xl font-bold leading-snug mb-3">
                반가워요, {data.nickname}님!
              </h2>
              {areaLabel ? (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  <span className="font-semibold text-primary">{areaLabel}</span> 맞춤 정보를
                  <br />
                  지금 확인해보세요
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  맞춤 부동산 정보를
                  <br />
                  지금 확인해보세요
                </p>
              )}
            </div>

            {/* Fixed bottom CTA */}
            <div className="p-6 pb-10">
              <Button
                data-testid="button-claim-reward"
                size="lg"
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg py-7 text-base rounded-xl"
                onClick={handleRewardClick}
                disabled={updateMutation.isPending || isProcessing}

              >
                <Gift className="w-5 h-5" />
                {isProcessing ? "지급 중..." : updateMutation.isPending ? "처리 중..." : "3,000 리워드와 함께 시작"}

              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="relative w-48 h-48">
              {coinPositions.current.map((pos, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 text-2xl pointer-events-none"
                  style={{
                    animation: `coinBurst 1.4s ease-out ${pos.delay} both`,
                    "--coin-x": pos.x,
                    "--coin-y": pos.y,
                  } as React.CSSProperties}
                >
                  🪙
                </span>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
                  style={{ animation: "celebrationPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
                >
                  <span className="text-white text-5xl">🎉</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-center">
              <p
                className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"
                style={{ animation: "fadeSlideUp 0.5s ease-out 0.3s both" }}
              >
                +3,000P
              </p>
              <p
                className="text-muted-foreground text-base"
                style={{ animation: "fadeSlideUp 0.5s ease-out 0.5s both" }}
              >
                리워드가 지급되었습니다!
              </p>
            </div>
          </div>
        )}
        <style>{`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes coinBurst {

            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { opacity: 1; }
            100% { transform: translate(calc(-50% + var(--coin-x)), calc(-50% + var(--coin-y))) scale(1.3); opacity: 0; }
          }
          @keyframes celebrationPop {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeSlideUp {
            0% { transform: translateY(12px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        {/* 상단: 뒤로가기 + 프로그레스 */}
        <div className="flex items-center gap-3 mb-8">
          <button
            data-testid="button-back"
            onClick={handleBack}
            className="p-1.5 rounded-lg transition-colors shrink-0 text-foreground hover:bg-accent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {step}/{INPUT_STEPS}
          </span>
        </div>

        {step === 1 && (
          <div>
            {/* Header */}
            <div className="flex flex-col items-center text-center pt-6 pb-10">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">서비스 이용약관 동의</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                원활한 서비스 이용을 위해<br />약관에 동의해주세요
              </p>
            </div>

            {/* 전체 동의 */}
            <button
              onClick={toggleAll}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all mb-6",
                allAgreed
                  ? "bg-primary/10 border-primary"
                  : "bg-background border-border hover:border-primary/40"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                  allAgreed ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}
              >
                {allAgreed && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
              <span className="font-semibold text-base">전체 동의하기</span>
            </button>

            <Separator className="my-5" />

            {/* 필수 약관 */}
            <div className="space-y-3 mb-10">
              <p className="text-xs font-semibold text-muted-foreground tracking-wide px-1 mb-1">필수 동의</p>
              {TERMS_LIST.filter((t) => t.required).map((term) => (
                <div key={term.key} className="rounded-xl border overflow-hidden">
                  <div
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 transition-colors",
                      agreements[term.key] ? "bg-primary/5" : "bg-background"
                    )}
                  >
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                      onClick={() => toggleAgreement(term.key)}
                    >
                      <Checkbox
                        checked={agreements[term.key]}
                        className="h-5 w-5 shrink-0 pointer-events-none"
                      />
                      <span className="text-sm font-medium truncate">{term.label}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-red-500 border-red-200 shrink-0">필수</Badge>
                    <button
                      type="button"
                      onClick={() => toggleExpanded(term.key)}
                      className="p-1 rounded hover:bg-accent transition-colors shrink-0"
                    >
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedTerms[term.key] && "rotate-180")} />
                    </button>
                  </div>
                  {expandedTerms[term.key] && (
                    <div className="px-4 pb-3">
                      <div className="bg-muted/50 rounded-lg p-3 max-h-[140px] overflow-y-auto text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap border">
                        {term.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 선택 약관 */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground tracking-wide px-1 mb-1">선택 동의</p>
              {TERMS_LIST.filter((t) => !t.required).map((term) => (
                <div key={term.key} className="rounded-xl border overflow-hidden">
                  <div
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 transition-colors",
                      agreements[term.key] ? "bg-primary/5" : "bg-background"
                    )}
                  >
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                      onClick={() => toggleAgreement(term.key)}
                    >
                      <Checkbox
                        checked={agreements[term.key]}
                        className="h-5 w-5 shrink-0 pointer-events-none"
                      />
                      <span className="text-sm font-medium truncate">{term.label}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground shrink-0">선택</Badge>
                    <button
                      type="button"
                      onClick={() => toggleExpanded(term.key)}
                      className="p-1 rounded hover:bg-accent transition-colors shrink-0"
                    >
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedTerms[term.key] && "rotate-180")} />
                    </button>
                  </div>
                  {expandedTerms[term.key] && (
                    <div className="px-4 pb-3">
                      <div className="bg-muted/50 rounded-lg p-3 max-h-[120px] overflow-y-auto text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap border">
                        {term.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="pt-8">
            <h2 className="text-2xl font-bold leading-snug mb-10">
              뉴글에서 사용할
              <br />
              닉네임을 입력해주세요.
            </h2>
            <Input
              data-testid="input-nickname"
              placeholder="닉네임을 입력해주세요"
              value={data.nickname}
              onChange={(e) => setData({ ...data, nickname: e.target.value })}
              onKeyDown={handleNicknameKeyDown}
              className="text-lg h-14 rounded-xl border-2 focus-visible:border-primary px-4"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-3 px-1">
              2자 이상 입력해주세요.
            </p>
          </div>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                거주지 입력
              </CardTitle>
              <CardDescription>
                읍/면/동 이름으로 검색하여 거주지를 선택해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  ref={residenceInputRef}
                  data-testid="input-residence-search"
                  placeholder="읍/면/동 검색 (예: 역삼동, 판교동, 봉담읍)"
                  value={residenceSearch}
                  onChange={(e) => {
                    setResidenceSearch(e.target.value);
                    setSearchHighlight(0);
                    if (e.target.value.trim()) {
                      setSearchOpen(true);
                    } else {
                      setSearchOpen(false);
                    }
                    // Clear previous selection when user edits
                    if (data.residenceDong) {
                      setData((prev) => ({
                        ...prev,
                        residenceCity: "",
                        residenceDistrict: "",
                        residenceDong: "",
                      }));
                    }
                  }}
                  onFocus={() => {
                    if (residenceSearch.trim() && !data.residenceDong) {
                      setSearchOpen(true);
                    }
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10"
                  autoFocus
                />
                {searchOpen && debouncedQuery.trim() && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full mt-1 z-[60] rounded-md border bg-popover text-popover-foreground shadow-md max-h-[300px] overflow-auto"
                  >
                    {searchResultsMemo.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        검색 결과가 없습니다
                      </div>
                    ) : (
                      searchResultsMemo.map((result, index) => (
                        <button
                          key={`${result.city}-${result.district}-${result.dong}-${index}`}
                          className={cn(
                            "w-full text-left px-4 py-3 flex items-center border-b last:border-b-0 transition-colors",
                            searchHighlight === index
                              ? "bg-accent"
                              : "hover:bg-accent/50"
                          )}
                          onMouseDown={(e) => {
                            e.preventDefault(); // prevent input blur
                            handleSelectResidence(
                              result.city,
                              result.district,
                              result.dong
                            );
                          }}
                          onMouseEnter={() => setSearchHighlight(index)}
                        >
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                          <span className="flex-1">
                            <span className={cn(
                              result.matchType === "full"
                                ? "font-semibold"
                                : "text-muted-foreground"
                            )}>
                              {result.dong}
                            </span>
                            <span className="text-muted-foreground text-sm ml-1.5">
                              {result.city} {result.district}
                            </span>
                          </span>
                          {result.matchType === "full" && (
                            <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                              일치
                            </Badge>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {data.residenceDong && (
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          선택된 거주지
                        </p>
                        <p className="font-semibold text-lg text-foreground">
                          {data.residenceCity} {data.residenceDistrict}{" "}
                          {data.residenceDong}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          residenceCity: "",
                          residenceDistrict: "",
                          residenceDong: "",
                        }));
                        setResidenceSearch("");
                        setSearchOpen(false);
                        setSearchHighlight(-1);
                        residenceInputRef.current?.focus();
                      }}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                목표 지역 입력
              </CardTitle>
              <CardDescription>
                관심있는 지역을 최소 1개, 최대 3개까지 선택해주세요.
                {data.targetAreas.length === 0 && (
                  <span className="block mt-2 text-primary">
                    목표 지역이 없으시다면 현 거주지나 직장 근처 지역으로
                    입력해보세요!
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 3-column header labels */}
              <div className="grid grid-cols-3 gap-0 text-xs font-medium text-muted-foreground">
                <div className="px-3 py-1.5">시/도</div>
                <div className="px-3 py-1.5">시/군/구</div>
                <div className="px-3 py-1.5">읍/면/동</div>
              </div>

              {/* 3-column selector */}
              <div className="grid grid-cols-3 gap-0 h-[360px] border rounded-lg overflow-hidden">
                {/* Column 1: 시/도 */}
                <div className="border-r overflow-auto">
                  {getCities().map((city) => (
                    <button
                      key={city}
                      data-testid={`city-tab-${city}`}
                      className={cn(
                        "w-full text-left px-3 py-2.5 border-b text-sm transition-colors",
                        selectedCity === city
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-accent"
                      )}
                      onClick={() => {
                        setSelectedCity(city);
                        setSelectedDistrict("");
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* Column 2: 시/군/구 */}
                <div className="border-r overflow-auto">
                  {currentDistricts.map((district) => {
                    const hasSelected = data.targetAreas.some(
                      (a) => a.city === selectedCity && a.district === district.name
                    );
                    return (
                      <button
                        key={district.name}
                        data-testid={`district-tab-${district.name}`}
                        className={cn(
                          "w-full text-left px-3 py-2.5 border-b text-sm transition-colors",
                          selectedDistrict === district.name
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-accent",
                          hasSelected && selectedDistrict !== district.name && "text-primary"
                        )}
                        onClick={() => setSelectedDistrict(district.name)}
                      >
                        {district.name}
                        {hasSelected && selectedDistrict !== district.name && (
                          <span className="ml-1 text-xs">●</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Column 3: 읍/면/동 */}
                <div className="overflow-auto">
                  {!selectedDistrict ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground px-3 text-center">
                      시/군/구를
                      <br />
                      선택해주세요
                    </div>
                  ) : (
                    currentDongs.map((dong) => {
                      const selectedArea = data.targetAreas.find(
                        (a) =>
                          a.city === selectedCity &&
                          a.district === selectedDistrict &&
                          a.dong === dong
                      );
                      const isSelected = !!selectedArea;
                      const priorityLabel = selectedArea
                        ? PRIORITY_LABELS[selectedArea.priority - 1]
                        : null;
                      const isDisabled = data.targetAreas.length >= 3 && !isSelected;

                      return (
                        <button
                          key={dong}
                          data-testid={`dong-checkbox-${dong}`}
                          className={cn(
                            "w-full text-left px-3 py-2.5 border-b text-sm transition-colors flex items-center justify-between",
                            isSelected
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-accent",
                            isDisabled && "opacity-40 cursor-not-allowed"
                          )}
                          onClick={() => {
                            if (isSelected) {
                              const index = data.targetAreas.findIndex(
                                (a) =>
                                  a.city === selectedCity &&
                                  a.district === selectedDistrict &&
                                  a.dong === dong
                              );
                              removeTargetArea(index);
                            } else if (data.targetAreas.length < 3) {
                              addTargetArea(selectedCity, selectedDistrict, dong);
                            }
                          }}
                          disabled={isDisabled}
                        >
                          <span>{dong}</span>
                          {isSelected && priorityLabel && selectedArea && (
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0",
                              selectedArea.priority === 1 && "bg-blue-600 text-white",
                              selectedArea.priority === 2 && "bg-emerald-600 text-white",
                              selectedArea.priority === 3 && "bg-amber-500 text-white",
                            )}>
                              {priorityLabel}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Selected areas */}
              {data.targetAreas.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    선택한 목표 지역 (우선순위순)
                  </p>
                  <div className="flex flex-col gap-2">
                    {data.targetAreas.map((area, index) => {
                      const colorMap = [
                        "bg-blue-50 border-blue-300 text-blue-900",
                        "bg-emerald-50 border-emerald-300 text-emerald-900",
                        "bg-amber-50 border-amber-300 text-amber-900",
                      ];
                      const labelColorMap = [
                        "bg-blue-600 text-white",
                        "bg-emerald-600 text-white",
                        "bg-amber-500 text-white",
                      ];
                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg border",
                            colorMap[area.priority - 1]
                          )}
                          data-testid={`selected-area-${index}`}
                        >
                          <span
                            className={cn(
                              "text-xs font-bold px-2 py-0.5 rounded-full shrink-0",
                              labelColorMap[area.priority - 1]
                            )}
                          >
                            {PRIORITY_LABELS[area.priority - 1]}
                          </span>
                          <span className="flex-1 text-sm font-medium">
                            {area.city} {area.district} {area.dong}
                          </span>
                          <button
                            onClick={() => removeTargetArea(index)}
                            className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
                            data-testid={`remove-area-${index}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                매수 목표 시기
              </CardTitle>
              <CardDescription>
                부동산 매수를 목표로 하는 시기를 선택해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="flex flex-col items-center gap-12">
                <div className="flex flex-col items-center gap-2 pt-6">
                  <span className="text-5xl font-bold text-primary tracking-tight">
                    {data.purchaseTimeline}개월
                  </span>
                  <span className="text-muted-foreground text-sm">후 매수 목표</span>
                </div>
                <div className="w-full space-y-3 px-2">
                  <Slider
                    data-testid="slider-timeline"
                    value={[data.purchaseTimeline]}
                    onValueChange={(value) =>
                      setData({ ...data, purchaseTimeline: value[0] })
                    }
                    min={1}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1개월</span>
                    <span>6개월</span>
                    <span>12개월</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 6 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                가용 자금
              </CardTitle>
              <CardDescription>
                대출 제외 가용 자금 규모를 선택해주세요 (5천만원 단위)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="flex flex-col items-center gap-12">
                <div className="flex flex-col items-center gap-2 pt-6">
                  <span className="text-5xl font-bold text-primary tracking-tight">
                    {data.availableFunds}
                  </span>
                  <span className="text-muted-foreground text-sm">가용 자금 규모</span>
                </div>
                <div className="w-full space-y-3 px-2">
                  <Slider
                    data-testid="slider-funds"
                    value={[fundsIndex >= 0 ? fundsIndex : 5]}
                    onValueChange={(value) =>
                      setData({
                        ...data,
                        availableFunds: AVAILABLE_FUNDS_OPTIONS[value[0]],
                      })
                    }
                    min={0}
                    max={AVAILABLE_FUNDS_OPTIONS.length - 1}
                    step={1}
                    className="w-full"
                  />
                  <div className="relative w-full h-6 pt-1 text-xs text-muted-foreground select-none">
                    <button
                      className="absolute left-0 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setData({ ...data, availableFunds: "1억 미만" })}
                    >
                      1억 미만
                    </button>
                    <button
                      className="absolute left-[31.03%] -translate-x-1/2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setData({ ...data, availableFunds: "5억" })}
                    >
                      5억
                    </button>
                    <button
                      className="absolute left-[65.52%] -translate-x-1/2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setData({ ...data, availableFunds: "10억" })}
                    >
                      10억
                    </button>
                    <button
                      className="absolute right-0 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setData({ ...data, availableFunds: "15억 이상" })}
                    >
                      15억 이상
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 7 && (
          <div className="pt-8">
            <h2 className="text-2xl font-bold leading-snug mb-2 flex items-center gap-2">
              가족 형태
            </h2>
            <p className="text-muted-foreground mb-8">
              해당하는 가족 형태를 선택해주세요 (최대 3개)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FAMILY_TYPES.map((type) => {
                const isSelected = data.familyTypes.includes(type);
                const isDisabled = !isSelected && data.familyTypes.length >= 3;
                return (
                  <button
                    key={type}
                    data-testid={`family-type-${type}`}
                    onClick={() => toggleFamilyType(type)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center justify-center px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-center",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm ring-1 ring-primary/30"
                        : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-accent/50",
                      isDisabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                선택: <span className="font-medium text-foreground">{data.familyTypes.length}</span>/3
              </span>
              {data.familyTypes.length >= 3 && (
                <span className="text-xs text-muted-foreground">최대 선택 완료</span>
              )}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="pt-8">
            <h2 className="text-2xl font-bold leading-snug mb-2 flex items-center gap-2">
              관심사 및 고민
            </h2>
            <p className="text-muted-foreground mb-8">
              관심있는 주제를 선택해주세요 (최대 5개)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = data.interests.includes(interest);
                const isDisabled = !isSelected && data.interests.length >= 5;
                return (
                  <button
                    key={interest}
                    data-testid={`interest-${interest}`}
                    onClick={() => toggleInterest(interest)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center justify-center px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-center",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm ring-1 ring-primary/30"
                        : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-accent/50",
                      isDisabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                선택: <span className="font-medium text-foreground">{data.interests.length}</span>/5
              </span>
              {data.interests.length >= 5 && (
                <span className="text-xs text-muted-foreground">최대 선택 완료</span>
              )}
            </div>
          </div>
        )}

      </div>

      {step < 9 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-50">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <Button
              data-testid="button-next"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full py-6 text-base rounded-xl"
            >
              다음
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>회원 가입을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              입력한 정보가 초기화됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 mt-0">돌아가기</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  window.location.href = "/";
                }
              }}
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

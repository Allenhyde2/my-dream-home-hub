'use client';

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";

const banners = [
  {
    id: 1,
    image: banner1,
    title: "2026년 상반기 분양 예정 단지",
    subtitle: "강남권 핵심 입지 신규 분양 정보를 확인하세요",
    tag: "오늘의 추천",
  },
  {
    id: 2,
    image: banner2,
    title: "서울 아파트 시세 동향 분석",
    subtitle: "전문가가 분석한 지역별 부동산 트렌드",
    tag: "인기 콘텐츠",
  },
  {
    id: 3,
    image: banner3,
    title: "내 집 마련 체크리스트",
    subtitle: "첫 주택 구매자를 위한 완벽 가이드",
    tag: "초보자 추천",
  },
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-block px-3 py-1 mb-3 text-sm font-medium bg-primary text-primary-foreground rounded-full">
              {banner.tag}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {banner.title}
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-xl">
              {banner.subtitle}
            </p>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
        onClick={goToPrevious}
        data-testid="button-banner-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
        onClick={goToNext}
        data-testid="button-banner-next"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            data-testid={`button-banner-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

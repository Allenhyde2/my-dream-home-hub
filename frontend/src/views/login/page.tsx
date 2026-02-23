'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Heart, Home as HomeIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Login = () => {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 2) {
          clearInterval(progressTimer);
          return 2;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    if (loadingProgress >= 2) {
      router.push('/');
    }
  }, [loadingProgress, router]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://source.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery + ' apartment')}&per_page=6&sig=${Date.now()}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      <img
        src="https://source.unsplash.com/random/800x600?architecture,building,modern&sig=2024"
        alt="Modern apartment building"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://source.unsplash.com/random/800x600?apartment&sig=2024";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-[#126BFF]/20"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-6 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <HomeIcon className="w-12 h-12 text-[#126BFF]" />
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            뉴글에 오신 것을 환영합니다
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            당신의 드림하우스를 실현해 드릴게요
          </p>

          <div className="w-full space-y-3">
            <Button
              variant="default"
              size="lg"
              className="w-full h-12 bg-[#126BFF] hover:bg-[#0e5add] text-white font-semibold rounded-xl transition-colors shadow-lg"
              onClick={() => {
                window.location.href = '/api/login/test?redirect=/';
              }}
            >
              시작하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-colors text-gray-600"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              둘러보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

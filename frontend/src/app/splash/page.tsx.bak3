"use client"
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

const SplashPage = () => {
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
        src="https://images.unsplash.com/photo-1642086384689-8b4f7779420?q=80&w=1920"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-[#126BFF]/20"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-8 py-4 shadow-lg">
            <svg width="160" height="48" viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 20 L8 12 L14 6 L20 12 L20 20 Z" fill="#126BFF"/>
              <path d="M8 12 L14 6 L14 12 L8 12 Z" fill="#87CEEB"/>
              <text x="24" y="32" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="#126BFF">
                뉴글
              </text>
            </svg>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="부동산 정보를 검색해보세요"
              className="w-full h-12 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#126BFF] focus:border-transparent text-gray-700 placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSearch()}
              disabled={!searchQuery.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-[#126BFF] hover:bg-[#0e5add] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L12 5L19 12M5 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-100 p-4 space-y-3 max-h-64 overflow-y-auto">
              {searchResults.slice(0, 4).map((result: any) => (
                <div key={result.id} className="flex items-start gap-3 p-3 hover:bg-white rounded-lg transition-colors cursor-pointer">
                  <img
                    src={result.urls?.regular}
                    alt={result.alt_description || 'Real estate'}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {result.alt_description || '부동산 정보'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {result.location?.city ? `${result.location.city}, ${result.location.country}` : '실시간 검색'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                loadingProgress >= 1 ? 'bg-[#126BFF]' : 'bg-gray-200'
              }`}></div>
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                loadingProgress >= 2 ? 'bg-[#126BFF]' : 'bg-gray-200'
              }`}></div>
            </div>
            <span className="text-sm text-gray-600">
              {loadingProgress === 1 ? '로딩 중...' : '완료!'}
            </span>
          </div>

          {searchResults.length === 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  setSearchQuery('서울 아파트');
                  handleSearch();
                }}
                className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 hover:border-[#126BFF]/30 hover:bg-white transition-colors"
              >
                <span className="text-sm text-gray-700">🏢 서울 아파트</span>
              </button>
              <button
                onClick={() => {
                  setSearchQuery('분양 정보');
                  handleSearch();
                }}
                className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 hover:border-[#126BFF]/30 hover:bg-white transition-colors"
              >
                <span className="text-sm text-gray-700">📊 분양 정보</span>
              </button>
              <button
                onClick={() => {
                  setSearchQuery('매매 트렌드');
                  handleSearch();
                }}
                className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 hover:border-[#126BFF]/30 hover:bg-white transition-colors"
              >
                <span className="text-sm text-gray-700">📈 매매 트렌드</span>
              </button>
              <button
                onClick={() => {
                  setSearchQuery('신규 분양');
                  handleSearch();
                }}
                className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 hover:border-[#126BFF]/30 hover:bg-white transition-colors"
              >
                <span className="text-sm text-gray-700">🆕 신규 분양</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplashPage;

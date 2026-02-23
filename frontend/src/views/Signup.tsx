import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "@/hooks/use-navigate";
import { cn } from "@/lib/utils";

const Signup = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'selection' | 'email'>('selection');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSocialSignup = (provider: string) => {
        setIsLoading(true);
        window.location.href = '/api/login/test?redirect=/onboarding';
    };

    const handleEmailSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        setIsLoading(true);
        window.location.href = '/api/login/test?redirect=/onboarding';
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            {mode === 'selection' ? (
                <button
                    onClick={() => navigate('/')}
                    className="absolute right-4 top-4 z-50 p-2 text-muted-foreground hover:text-foreground transition-all active:scale-95"
                    aria-label="닫기"
                >
                    <X className="w-6 h-6" />
                </button>
            ) : (
                <button
                    onClick={() => setMode('selection')}
                    className="absolute left-4 top-4 z-50 p-2 text-foreground hover:text-primary transition-all active:scale-95"
                    aria-label="뒤로 가기"
                >
                    <ChevronLeft className="w-10 h-10" />
                </button>
            )}

            <div className={cn(
                "flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-4 md:px-0",
                mode === 'selection' ? "py-8" : "py-8 md:py-8"
            )}>

                {mode === 'selection' && (
                    <div className="flex flex-col h-full bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 mb-16">
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 rotate-3 transform transition-transform hover:rotate-6">
                                <Heart className="w-10 h-10 text-primary fill-current" />
                            </div>
                            <h1 className="text-2xl font-bold leading-tight">
                                시작하는<br />
                                나만의 드림하우스
                            </h1>
                            <p className="text-3xl font-extrabold text-primary tracking-tight">
                                Dream Hub.
                            </p>
                        </div>

                        <div className="space-y-3 w-full max-w-sm mx-auto">
                            <Button
                                variant="outline"
                                className="w-full h-12 bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-none font-medium text-base relative"
                                onClick={() => handleSocialSignup("kakao")}
                            >
                                <div className="absolute left-4">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                        <path d="M12 3C5.925 3 1 6.925 1 11.772c0 2.923 1.874 5.467 4.704 7.025-.138.517-.5.952-1.127 1.838-.138.196-.06.467.168.599.096.055.204.085.312.085.252 0 .504-.085.708-.252 2.136-1.503 3.192-2.188 3.324-2.272.612.096 1.248.144 1.911.144 6.075 0 11-3.925 11-8.772C22 6.925 17.075 3 12 3z" />
                                    </svg>
                                </div>
                                카카오로 회원가입
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-12 bg-black hover:bg-black/90 text-white border-none font-medium text-base relative"
                                onClick={() => handleSocialSignup("apple")}
                            >
                                <div className="absolute left-4">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.03 3.96-.8 2 .25 3.33 1.34 4.09 2.59-3.79 1.98-3.04 6.78.43 8.3-1.04 2.5-2.48 4.67-4.22 4.4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.04 4.19-3.74 4.25z" />
                                    </svg>
                                </div>
                                애플로 회원가입
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-12 bg-white hover:bg-gray-50 text-black border border-gray-200 font-medium text-base relative"
                                onClick={() => handleSocialSignup("google")}
                            >
                                <div className="absolute left-4">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </div>
                                구글로 회원가입
                            </Button>
                        </div>

                        <div className="relative my-6 w-full max-w-sm mx-auto">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted-foreground/20" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">또는</span>
                            </div>
                        </div>

                        <div className="mb-8 w-full max-w-sm mx-auto">
                            <Button
                                variant="outline"
                                className="w-full h-12 font-medium text-base relative"
                                onClick={() => setMode('email')}
                            >
                                이메일로 회원가입하기
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            이미 계정이 있으신가요?{" "}
                            <button
                                className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
                                onClick={() => navigate('/login')}
                            >
                                로그인
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'email' && (
                    <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="mb-8 text-center pt-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 mx-auto rotate-3">
                                <Heart className="w-8 h-8 text-primary fill-current" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">이메일로 회원가입</h2>
                            <p className="text-muted-foreground">Dream Hub에 오신 것을 환영합니다</p>
                        </div>

                        <form onSubmit={handleEmailSignup} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="signup-email" className="text-sm font-medium">이메일</label>
                                <input
                                    id="signup-email"
                                    placeholder="name@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="signup-password" className="text-sm font-medium">비밀번호</label>
                                <input
                                    id="signup-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="8자 이상 입력해주세요"
                                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="signup-confirm-password" className="text-sm font-medium">비밀번호 확인</label>
                                <input
                                    id="signup-confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="비밀번호를 다시 입력해주세요"
                                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <Button className="w-full h-12 text-base font-medium mt-6" type="submit" disabled={isLoading}>
                                {isLoading ? "회원가입 중..." : "회원가입"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setMode('selection')}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                다른 방법으로 회원가입
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Signup;

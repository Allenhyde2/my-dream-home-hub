"use client"
import { useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Award,
  Calendar,
  Download,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { getCourseById, LEVEL_DESCRIPTIONS } from "@/data/courses";

interface Certificate {
  id: number;
  courseId: number;
  issuedAt: string;
  certificateNumber: string;
}

const mockCertificates: Certificate[] = [
  { 
    id: 1, 
    courseId: 3, 
    issuedAt: "2026-01-10",
    certificateNumber: "CERT-2026-0001-0003"
  },
  { 
    id: 2, 
    courseId: 11, 
    issuedAt: "2025-12-20",
    certificateNumber: "CERT-2025-1220-0011"
  },
];

const MyCertificates = () => {
  const navigate = useNavigate();

  const certificatesWithDetails = mockCertificates.map((cert) => ({
    ...cert,
    course: getCourseById(cert.courseId),
  })).filter((item) => item.course);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/profile")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">내 수료증</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {certificatesWithDetails.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              총 {certificatesWithDetails.length}개의 수료증을 획득했습니다.
            </p>
            {certificatesWithDetails.map((item) => {
              const course = item.course!;
              const levelInfo = LEVEL_DESCRIPTIONS[course.level];
              
              return (
                <Card key={item.id} data-testid={`certificate-${item.id}`}>
                  <CardContent className="py-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className={`w-full md:w-32 h-24 rounded-lg ${levelInfo.color} flex items-center justify-center shrink-0`}>
                        <Award className="w-12 h-12 text-white/90" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={levelInfo.color}>
                            {course.level}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Award className="w-3 h-3" />
                            수료 완료
                          </Badge>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          강사: {course.instructor}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>발급일: {item.issuedAt}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>수료증 번호: {item.certificateNumber}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            PDF 다운로드
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            인증 링크 복사
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => navigate(`/course/${course.id}`)}
                          >
                            <BookOpen className="w-4 h-4" />
                            강의 다시보기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">아직 수료증이 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                강의를 완료하면 수료증을 받을 수 있습니다.
              </p>
              <Button onClick={() => navigate("/")} data-testid="button-explore">
                강의 둘러보기
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MyCertificates;

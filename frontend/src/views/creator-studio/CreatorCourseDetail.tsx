"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import {
  mockCreatorCourses, mockCourseProgress, mockChapterProgress, mockStudentActivity,
  type CreatorCourse,
} from "@/data/creator-studio";

function StatusBadge({ status }: { status: CreatorCourse["status"] }) {
  if (status === "published")
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">게시됨</Badge>;
  if (status === "archived")
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">보관</Badge>;
  return <Badge variant="secondary">초안</Badge>;
}

interface Props {
  courseId: number;
  onBack: () => void;
}

export default function CreatorCourseDetail({ courseId, onBack }: Props) {
  const course = mockCreatorCourses.find((c) => c.id === courseId);
  const progress = mockCourseProgress.find((p) => p.courseId === courseId);
  const chapters = mockChapterProgress[courseId] || [];
  const students = mockStudentActivity[courseId] || [];

  if (!course) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} data-testid="course-detail-back">
          <ArrowLeft className="mr-1 h-4 w-4" /> 목록으로
        </Button>
        <div className="text-center py-12 text-muted-foreground">강의를 찾을 수 없습니다</div>
      </div>
    );
  }

  const hasData = chapters.length > 0 || students.length > 0;

  const stats = [
    { label: "총 수강생", value: `${progress?.totalStudents ?? 0}명` },
    { label: "완료율", value: `${progress?.completionRate ?? 0}%` },
    { label: "평균 진행률", value: `${progress?.avgProgress ?? 0}%` },
    { label: "활성 수강생", value: `${progress?.activeStudents ?? 0}명` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} data-testid="course-detail-back">
          <ArrowLeft className="mr-1 h-4 w-4" /> 목록으로
        </Button>
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <StatusBadge status={course.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="course-detail-stats">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasData ? (
        <div className="text-center py-12 text-muted-foreground">
          아직 수강 데이터가 없습니다
        </div>
      ) : (
        <>
          <Card data-testid="course-detail-chapters">
            <CardHeader>
              <CardTitle className="text-base">챕터별 진행률</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chapters.map((ch) => (
                <div key={ch.chapterId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{ch.chapterTitle}</span>
                    <span className="text-muted-foreground">
                      {ch.completedLessons}/{ch.totalLessons} 강의 완료
                    </span>
                  </div>
                  <Progress value={ch.completionRate} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card data-testid="course-detail-students">
            <CardHeader>
              <CardTitle className="text-base">수강생 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>수강생명</TableHead>
                    <TableHead>마지막 활동</TableHead>
                    <TableHead className="text-right">진행률</TableHead>
                    <TableHead className="text-right">완료 강의</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.studentName}</TableCell>
                      <TableCell>{s.lastActive}</TableCell>
                      <TableCell className="text-right">{s.progress}%</TableCell>
                      <TableCell className="text-right">
                        {s.completedLessons}/{s.totalLessons}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

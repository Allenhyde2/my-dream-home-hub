"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockCourseProgress } from "@/data/creator-studio";

export default function CourseProgress() {
  return (
    <div data-testid="content-course-progress" className="space-y-6">
      <h3 className="text-lg font-semibold">강의 진행</h3>

      <div className="space-y-4">
        {mockCourseProgress.map((record) => (
          <Card key={record.courseId} data-testid={`progress-card-${record.courseId}`}>
            <CardContent className="py-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{record.courseTitle}</h4>
                <span className="text-sm text-muted-foreground">
                  수강생 {record.totalStudents}명
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">완료율</span>
                  <span className="font-medium">{record.completionRate}%</span>
                </div>
                <Progress value={record.completionRate} className="h-2" />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>평균 진행률: {record.avgProgress}%</span>
                <span>활성 수강생: {record.activeStudents}명</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

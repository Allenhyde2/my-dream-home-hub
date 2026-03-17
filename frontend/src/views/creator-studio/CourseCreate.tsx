"use client"
import { PlusCircle, FileEdit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockCreatorCourses } from "@/data/creator-studio";

const draftCourses = mockCreatorCourses.filter((c) => c.status === "draft");

export default function CourseCreate() {
  return (
    <div data-testid="content-course-create" className="space-y-6">
      <div className="flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">강의 개설</h3>
      </div>

      <Card>
        <CardContent className="py-6 flex flex-col items-center gap-3">
          <PlusCircle className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">새로운 강의를 만들어 보세요</p>
          <Button disabled data-testid="btn-create-course">
            <PlusCircle className="w-4 h-4 mr-2" />
            새 강의 만들기
          </Button>
        </CardContent>
      </Card>

      {draftCourses.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">작성 중인 초안</h4>
          {draftCourses.map((course) => (
            <Card key={course.id} data-testid={`draft-course-${course.id}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <FileEdit className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium line-clamp-1">{course.title}</h4>
                      <Badge variant="secondary">초안</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      마지막 수정: {course.lastEdited}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

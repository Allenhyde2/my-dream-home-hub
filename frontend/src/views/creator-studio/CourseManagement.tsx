"use client"
import { useState } from "react";
import { PlusCircle, FileEdit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { mockCreatorCourses, type CreatorCourse } from "@/data/creator-studio";
import CreatorCourseDetail from "./CreatorCourseDetail";

const statusLabel: Record<CreatorCourse["status"], string> = {
  draft: "초안",
  published: "게시됨",
  archived: "보관",
};

function StatusBadge({ status }: { status: CreatorCourse["status"] }) {
  if (status === "published") {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">게시됨</Badge>;
  }
  if (status === "archived") {
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">보관</Badge>;
  }
  return <Badge variant="secondary">{statusLabel[status]}</Badge>;
}

export default function CourseManagement() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const draftCourses = mockCreatorCourses.filter((c) => c.status === "draft");
  const filteredCourses =
    activeFilter === "all"
      ? mockCreatorCourses
      : mockCreatorCourses.filter((c) => c.status === activeFilter);

  if (selectedCourseId !== null) {
    return <CreatorCourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
  }

  return (
    <div data-testid="content-course-management" className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">강의 관리</h3>
        <Button disabled data-testid="btn-create-course">
          <PlusCircle className="w-4 h-4 mr-2" />새 강의 만들기
        </Button>
      </div>

      {draftCourses.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">작성 중인 초안</h4>
          {draftCourses.map((course) => (
            <Card key={course.id} data-testid={`draft-course-${course.id}`} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedCourseId(course.id)}>
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
                    <p className="text-sm text-muted-foreground">마지막 수정: {course.lastEdited}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-4" data-testid="management-tabs">
          <TabsTrigger value="all" data-testid="tab-all">전체</TabsTrigger>
          <TabsTrigger value="draft" data-testid="tab-draft">초안</TabsTrigger>
          <TabsTrigger value="published" data-testid="tab-published">게시됨</TabsTrigger>
          <TabsTrigger value="archived" data-testid="tab-archived">보관</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter}>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>강의명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">가격</TableHead>
                    <TableHead className="text-right">수강생</TableHead>
                    <TableHead className="text-right">평점</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id} data-testid={`mgmt-row-${course.id}`} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedCourseId(course.id)}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <StatusBadge status={course.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {course.price.toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-right">{course.studentCount}</TableCell>
                      <TableCell className="text-right">
                        {course.rating > 0 ? `★ ${course.rating}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

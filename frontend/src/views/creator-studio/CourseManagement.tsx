"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { mockCreatorCourses, type CreatorCourse } from "@/data/creator-studio";

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

  const filteredCourses =
    activeFilter === "all"
      ? mockCreatorCourses
      : mockCreatorCourses.filter((c) => c.status === activeFilter);

  return (
    <div data-testid="content-course-management" className="space-y-6">
      <h3 className="text-lg font-semibold">강의 관리</h3>

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
                    <TableRow key={course.id} data-testid={`mgmt-row-${course.id}`}>
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

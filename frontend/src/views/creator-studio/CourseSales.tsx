"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { mockCourseSales } from "@/data/creator-studio";

const totalRevenue = mockCourseSales.reduce((sum, r) => sum + r.totalRevenue, 0);
const monthlyRevenue = mockCourseSales.reduce((sum, r) => sum + r.monthlySales, 0);
const avgRefundRate =
  mockCourseSales.length > 0
    ? (mockCourseSales.reduce((sum, r) => sum + r.refundRate, 0) / mockCourseSales.length).toFixed(1)
    : "0";

export default function CourseSales() {
  return (
    <div data-testid="content-course-sales" className="space-y-6">
      <h3 className="text-lg font-semibold">강의 판매</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}원</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">이번 달 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{monthlyRevenue.toLocaleString()}원</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">환불률</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgRefundRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>강의명</TableHead>
                <TableHead className="text-right">총 매출</TableHead>
                <TableHead className="text-right">월 매출</TableHead>
                <TableHead className="text-right">환불 건수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCourseSales.map((record) => (
                <TableRow key={record.courseId} data-testid={`sales-row-${record.courseId}`}>
                  <TableCell className="font-medium">{record.courseTitle}</TableCell>
                  <TableCell className="text-right">
                    {record.totalRevenue.toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-right">
                    {record.monthlySales.toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-right">{record.refundCount}건</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

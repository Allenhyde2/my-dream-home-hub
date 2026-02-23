"use client"
'use client';

import nextDynamic from 'next/dynamic';

const CourseDetailPage = nextDynamic(() => import('@/views/CourseDetail'), { ssr: false });

export default function Page() {
  return <CourseDetailPage />;
}

"use client"
'use client';

import nextDynamic from 'next/dynamic';

const MyCoursesPage = nextDynamic(() => import('@/views/MyCourses'), { ssr: false });

export default function Page() {
  return <MyCoursesPage />;
}

"use client"
'use client';

import nextDynamic from 'next/dynamic';

const CourseLecturePage = nextDynamic(() => import('@/views/CourseLecture'), { ssr: false });

export default function Page() {
  return <CourseLecturePage />;
}

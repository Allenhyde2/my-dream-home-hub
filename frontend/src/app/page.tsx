"use client"
'use client';

import nextDynamic from 'next/dynamic';

const HomePage = nextDynamic(() => import('@/views/Index'), { ssr: false });

export default function Page() {
  return <HomePage />;
}

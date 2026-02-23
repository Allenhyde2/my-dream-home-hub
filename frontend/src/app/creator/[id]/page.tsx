"use client"
'use client';

import nextDynamic from 'next/dynamic';

const CreatorProfilePage = nextDynamic(() => import('@/views/CreatorProfile'), { ssr: false });

export default function Page() {
  return <CreatorProfilePage />;
}

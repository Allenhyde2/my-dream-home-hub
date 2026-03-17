'use client';

import nextDynamic from 'next/dynamic';

const CreatorStudioPage = nextDynamic(() => import('@/views/CreatorStudio'), { ssr: false });

export default function Page() {
  return <CreatorStudioPage />;
}

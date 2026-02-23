"use client"
'use client';

import nextDynamic from 'next/dynamic';

const MyCertificatesPage = nextDynamic(() => import('@/views/MyCertificates'), { ssr: false });

export default function Page() {
  return <MyCertificatesPage />;
}

"use client"
'use client';

import nextDynamic from 'next/dynamic';

const PurchaseHistoryDetailPage = nextDynamic(() => import('@/views/PurchaseHistory'), { ssr: false });

export default function Page() {
  return <PurchaseHistoryDetailPage />;
}

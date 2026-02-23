"use client"
'use client';

import nextDynamic from 'next/dynamic';

const MyReservationsPage = nextDynamic(() => import('@/views/MyReservations'), { ssr: false });

export default function Page() {
  return <MyReservationsPage />;
}

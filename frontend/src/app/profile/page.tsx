"use client"
'use client';

import nextDynamic from 'next/dynamic';

const ProfilePage = nextDynamic(() => import('@/views/Profile'), { ssr: false });

export default function Page() {
  return <ProfilePage />;
}

"use client";

import nextDynamic from 'next/dynamic';

const LoginPage = nextDynamic(() => import('@/views/Login'), { ssr: false });

export default function Page() {
    return <LoginPage />;
}

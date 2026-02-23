"use client";

import nextDynamic from 'next/dynamic';

const SignupPage = nextDynamic(() => import('@/views/Signup'), { ssr: false });

export default function Page() {
    return <SignupPage />;
}

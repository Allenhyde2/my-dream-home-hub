"use client";

import nextDynamic from 'next/dynamic';

const OnboardingPage = nextDynamic(() => import('@/views/Onboarding'), { ssr: false });


export default function Page() {
  return <OnboardingPage />;
}
